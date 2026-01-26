import { NextRequest, NextResponse } from "next/server";
import { WhatsAppService } from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json({ 
        error: "Missing 'to' (phone number) or 'message' in request body" 
      }, { status: 400 });
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    
    if (!phoneNumberId || !accessToken) {
      return NextResponse.json({ 
        error: "WhatsApp credentials not configured in environment variables" 
      }, { status: 500 });
    }

    try {
      // Create WhatsApp service instance
      const whatsappService = new WhatsAppService({
        phoneNumberId,
        accessToken,
      });

      // Send test message
      const result = await whatsappService.sendTextMessage({
        to: to.startsWith('+') ? to.substring(1) : to, // Remove + if present (WhatsApp API doesn't expect it)
        text: message,
      });

      return NextResponse.json({ 
        success: true,
        message: "Test message sent successfully!",
        messageId: result.messageId
      });
    } catch (apiError) {
      console.error("Error sending test message:", apiError);
      return NextResponse.json({ 
        success: false, 
        error: "Error sending message via WhatsApp API",
        details: apiError instanceof Error ? apiError.message : String(apiError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in send test message API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}