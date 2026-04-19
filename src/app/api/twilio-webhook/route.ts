import { createServiceClient } from "@/lib/supabase/server";
import {
  analyzeSentiment,
  buildPositiveFollowUp,
  buildNegativeFollowUp,
  buildNeutralFollowUp,
} from "@/lib/claude";
import { twilioClient, TWILIO_WHATSAPP_NUMBER, formatWhatsAppNumber } from "@/lib/twilio";
import { NextResponse } from "next/server";
import twilio from "twilio";

// Validate Twilio webhook signature
function validateTwilioSignature(request: Request, body: string): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN!;
  const signature = request.headers.get("x-twilio-signature") ?? "";
  const url = request.url;

  return twilio.validateRequest(authToken, signature, url, Object.fromEntries(
    new URLSearchParams(body)
  ));
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Validate in production
    if (process.env.NODE_ENV === "production") {
      const isValid = validateTwilioSignature(request, rawBody);
      if (!isValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    const params = new URLSearchParams(rawBody);
    const fromNumber = params.get("From") ?? "";
    const messageBody = params.get("Body") ?? "";

    if (!fromNumber || !messageBody) {
      return new Response("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Normalize phone: extract digits from "whatsapp:+34612345678"
    const normalizedPhone = fromNumber.replace("whatsapp:", "").replace(/\s/g, "");
    const phoneVariants = [
      normalizedPhone,
      normalizedPhone.replace("+34", ""),
      normalizedPhone.replace("+", ""),
    ];

    const supabase = await createServiceClient();

    // Find the most recent pending request for this phone
    const { data: reviewRequest } = await supabase
      .from("review_requests")
      .select("*, businesses(*)")
      .in("customer_phone", phoneVariants)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!reviewRequest) {
      return new Response("<Response/>", {
        headers: { "Content-Type": "text/xml" },
      });
    }

    const business = reviewRequest.businesses as {
      name: string;
      google_maps_url: string | null;
    };

    // Analyze sentiment with Claude
    const sentiment = await analyzeSentiment(messageBody);

    // Update the review request
    await supabase
      .from("review_requests")
      .update({
        status: sentiment.sentiment,
        customer_response: messageBody,
        sentiment_score: sentiment.score,
        responded_at: new Date().toISOString(),
        follow_up_sent: true,
      })
      .eq("id", reviewRequest.id);

    // Build follow-up message
    let followUpMessage: string;

    if (sentiment.sentiment === "positive" && business.google_maps_url) {
      followUpMessage = buildPositiveFollowUp(
        reviewRequest.customer_name,
        business.name,
        business.google_maps_url
      );
    } else if (sentiment.sentiment === "negative") {
      followUpMessage = buildNegativeFollowUp(
        reviewRequest.customer_name,
        business.name
      );
    } else if (business.google_maps_url) {
      followUpMessage = buildNeutralFollowUp(
        reviewRequest.customer_name,
        business.name,
        business.google_maps_url
      );
    } else {
      followUpMessage = `¡Gracias por tu respuesta, ${reviewRequest.customer_name}! 😊 Tu opinión es muy importante para ${business.name}.`;
    }

    // Send follow-up via Twilio
    await twilioClient.messages.create({
      from: TWILIO_WHATSAPP_NUMBER,
      to: formatWhatsAppNumber(reviewRequest.customer_phone),
      body: followUpMessage,
    });

    return new Response("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Twilio webhook error:", error);
    return new Response("<Response/>", {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
