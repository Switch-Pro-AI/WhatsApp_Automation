import { NextRequest, NextResponse } from "next/server";
import { generateAIResponse } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ 
        error: "Missing 'message' in request body" 
      }, { status: 400 });
    }

    try {
      // Test AI response generation with a basic config
      const config = {
        agentName: "Test Assistant",
        agentRole: "a helpful assistant",
        businessDescription: "A test business",
        tone: "friendly",
        language: "en",
        capabilities: {
          autoRespond: true,
          leadCapture: false,
          appointmentBooking: false
        }
      };

      const response = await generateAIResponse(message, [], config);

      return NextResponse.json({ 
        success: true,
        message: "AI response generated successfully!",
        response: response
      });
    } catch (aiError) {
      console.error("Error generating AI response:", aiError);
      return NextResponse.json({ 
        success: false, 
        error: "Error generating AI response",
        details: aiError instanceof Error ? aiError.message : String(aiError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in AI test API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}