import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { generateAIResponse, shouldUseAIResponse, checkBusinessHours } from "@/lib/ai";
import { WhatsAppService } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    console.log("Test webhook called with body:", await request.text());
    
    // Simulate a WhatsApp webhook payload
    const testPayload = {
      object: "whatsapp_business_account",
      entry: [{
        id: "test_entry",
        changes: [{
          value: {
            messaging_product: "whatsapp",
            metadata: {
              display_phone_number: process.env.WHATSAPP_PHONE_NUMBER,
              phone_number_id: process.env.WHATSAPP_PHONE_NUMBER_ID
            },
            contacts: [{
              profile: {
                name: "Test Contact"
              },
              wa_id: "1234567890"  // This should be replaced with your actual test number
            }],
            messages: [{
              from: "1234567890",  // This should be replaced with your actual test number
              id: "test_msg_id",
              timestamp: Math.floor(Date.now() / 1000).toString(),
              text: {
                body: "Test message for debugging"
              },
              type: "text"
            }]
          },
          field: "messages"
        }]
      }]
    };

    // Process the simulated payload
    for (const entry of testPayload.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "messages") continue;

        const value = change.value;
        const metadata = value.metadata;
        const phoneNumberId = metadata?.phone_number_id;
        const displayPhoneNumber = metadata?.display_phone_number;

        // Handle incoming messages
        for (const message of value.messages || []) {
          console.log("Processing test message:", message);
          
          // Find the WhatsApp account and tenant by phone number ID
          const accountResult = await query(`
            SELECT wa.id as whatsapp_account_id, wa.tenant_id, wa.access_token
            FROM whatsapp_accounts wa
            WHERE wa.phone_number_id = $1
            LIMIT 1
          `, [phoneNumberId]);

          if (accountResult.length === 0) {
            console.log("No WhatsApp account found for phone number ID:", phoneNumberId);
            return NextResponse.json({ error: "No WhatsApp account found" }, { status: 404 });
          }

          const tenantId = accountResult[0].tenant_id;
          const whatsappAccountId = accountResult[0].whatsapp_account_id;
          const senderPhone = message.from;
          const senderName = value.contacts?.[0]?.profile?.name || "Unknown";

          // Find or create contact
          let contactResult = await query(`
            SELECT id FROM contacts
            WHERE tenant_id = $1 AND phone = $2
            LIMIT 1
          `, [tenantId, senderPhone]);

          let contactId: string;

          if (contactResult.length === 0) {
            // Create new contact
            const newContact = await query(`
              INSERT INTO contacts (tenant_id, phone, name, source)
              VALUES ($1, $2, $3, 'whatsapp')
              RETURNING id
            `, [tenantId, senderPhone, senderName]);
            contactId = newContact[0].id;
          } else {
            contactId = contactResult[0].id;
          }

          // Find or create conversation
          let conversationResult = await query(`
            SELECT id FROM conversations
            WHERE tenant_id = $1 AND contact_id = $2
            ORDER BY created_at DESC
            LIMIT 1
          `, [tenantId, contactId]);

          let conversationId: string;

          if (conversationResult.length === 0) {
            // Create new conversation
            const newConversation = await query(`
              INSERT INTO conversations (tenant_id, contact_id, whatsapp_account_id, status)
              VALUES ($1, $2, $3, 'open')
              RETURNING id
            `, [tenantId, contactId, whatsappAccountId]);
            conversationId = newConversation[0].id;
          } else {
            conversationId = conversationResult[0].id;
            // Reopen conversation if closed
            await query(`
              UPDATE conversations
              SET status = 'open', updated_at = NOW()
              WHERE id = $1
            `, [conversationId]);
          }

          // Determine message content based on type
          let content = message.text?.body || "";
          let messageType = message.type;

          // Store message
          await query(`
            INSERT INTO messages (
              conversation_id,
              direction,
              type,
              content,
              whatsapp_message_id,
              status,
              sent_at
            )
            VALUES (
              $1, 'inbound', $2, $3, $4, 'delivered', to_timestamp($5)
            )
          `, [conversationId, messageType, content, message.id, parseInt(message.timestamp)]);

          // Update conversation last message
          await query(`
            UPDATE conversations
            SET
              last_message = $1,
              last_message_at = to_timestamp($2),
              unread_count = unread_count + 1,
              updated_at = NOW()
            WHERE id = $3
          `, [content, parseInt(message.timestamp), conversationId]);

          // Update contact last contacted
          await query(`
            UPDATE contacts
            SET last_contacted_at = NOW(), updated_at = NOW()
            WHERE id = $1
          `, [contactId]);

          console.log("Message stored successfully:", message.id);

          // Check if we should auto-respond with AI
          try {
            // First, try to find an assistant associated with this tenant
            let agentResult = await query(`
              SELECT id, system_prompt, name, model, temperature, max_tokens, config FROM ai_assistants
              WHERE tenant_id = $1 AND is_default = true
              LIMIT 1
            `, [tenantId]);

            // Create a config object from the assistant data
            const assistantData = agentResult.length > 0 ? agentResult[0] : null;
            let agentConfig: any = null;

            if (assistantData) {
              agentConfig = {
                profile: {
                  agentName: assistantData.name,
                  systemPrompt: assistantData.system_prompt,
                  model: assistantData.model,
                  temperature: assistantData.temperature,
                  maxTokens: assistantData.max_tokens,
                },
                capabilities: {
                  autoRespond: true, // Assuming auto-respond is enabled for default assistants
                },
                // Include any additional config from the config field if it exists
                ...assistantData.config
              };
            }

            // Check if AI auto-respond is enabled and within business hours
            const isBusinessHours = await checkBusinessHours(tenantId, agentConfig?.profile?.timezone);
            const shouldAutoRespond =
              shouldUseAIResponse(agentConfig) && isBusinessHours && message.type === "text" && content;

            if (shouldAutoRespond) {
              console.log("Generating AI response for:", content);

              // Get recent conversation history (last 5 messages)
              const historyResult = await query(`
                SELECT direction, content
                FROM messages
                WHERE conversation_id = $1
                ORDER BY sent_at DESC
                LIMIT 5
              `, [conversationId]);

              const conversationHistory = historyResult
                .reverse()
                .map((msg: any) => ({
                  role: msg.direction === "outbound" ? "assistant" : "user",
                  content: msg.content,
                }));

              // Add current message
              conversationHistory.push({ role: "user", content });

              // Generate AI response
              const aiResponse = await generateAIResponse(content, conversationHistory, agentConfig || {});

              // Send response via WhatsApp
              const whatsappService = new WhatsAppService({
                phoneNumberId,
                accessToken: accountResult[0].access_token,
              });

              await whatsappService.sendTextMessage({
                to: senderPhone,
                text: aiResponse,
              });

              // Store the AI response in database
              await query(`
                INSERT INTO messages (
                  conversation_id,
                  direction,
                  type,
                  content,
                  status,
                  ai_generated,
                  sent_at
                )
                VALUES (
                  $1, 'outbound', 'text', $2, 'sent', true, NOW()
                )
              `, [conversationId, aiResponse]);

              // Update conversation with AI response
              await query(`
                UPDATE conversations
                SET
                  last_message = $1,
                  last_message_at = NOW(),
                  updated_at = NOW()
                WHERE id = $2
              `, [aiResponse, conversationId]);

              console.log("AI auto-response sent successfully");
              
              return NextResponse.json({ 
                success: true,
                message: "Test webhook processed successfully, AI response sent!",
                aiResponse: aiResponse
              });
            } else {
              console.log(
                "AI auto-response skipped - Config:",
                !!agentResult.length,
                "Business hours:",
                isBusinessHours,
                "Message type:",
                message.type,
                "Has content:",
                !!content
              );
              
              return NextResponse.json({ 
                success: true,
                message: "Test webhook processed, but AI auto-response was skipped based on configuration",
                reason: {
                  hasAgent: !!agentResult.length,
                  isBusinessHours,
                  messageType: message.type,
                  hasContent: !!content,
                  shouldUseAIResponse: agentConfig ? shouldUseAIResponse(agentConfig) : false
                }
              });
            }
          } catch (aiError) {
            console.error("Error in AI auto-response:", aiError);
            return NextResponse.json({ 
              success: true,
              message: "Test webhook processed but AI response failed",
              error: aiError instanceof Error ? aiError.message : String(aiError)
            });
          }
        }
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Test webhook processed successfully!"
    });
  } catch (error) {
    console.error("Test webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}