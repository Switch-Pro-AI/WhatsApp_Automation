import { NextRequest, NextResponse } from "next/server";
import { WhatsAppService } from "@/lib/whatsapp";

export async function GET(request: NextRequest) {
  try {
    // Test WhatsApp API connectivity
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

      // Test API connectivity by fetching phone number info
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${phoneNumberId}?access_token=${accessToken}`
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        return NextResponse.json({ 
          success: false,
          error: `WhatsApp API test failed: ${errorData.error?.message || 'Unknown error'}`,
          details: errorData
        }, { status: 500 });
      }

      const phoneData = await response.json();
      
      return NextResponse.json({ 
        success: true,
        message: "WhatsApp API connection successful!",
        phoneData: {
          id: phoneData.id,
          name: phoneData.name,
          code_verification_status: phoneData.code_verification_status,
          display_phone_number: phoneData.display_phone_number,
          phone_number: phoneData.phone_number,
          verified_account: phoneData.verified_account,
          quality_rating: phoneData.quality_rating,
        }
      });
    } catch (apiError) {
      console.error("Error testing WhatsApp API:", apiError);
      return NextResponse.json({ 
        success: false, 
        error: "Error connecting to WhatsApp API",
        details: apiError instanceof Error ? apiError.message : String(apiError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in WhatsApp test API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}