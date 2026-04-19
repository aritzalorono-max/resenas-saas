import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;

export const twilioClient = twilio(accountSid, authToken);

export const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER!;

export function formatWhatsAppNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return `whatsapp:+34${cleaned.slice(1)}`;
  }
  if (!cleaned.startsWith("+")) {
    return `whatsapp:+${cleaned}`;
  }
  return `whatsapp:${cleaned}`;
}

export async function sendWhatsAppMessage(
  to: string,
  body: string
): Promise<string> {
  const message = await twilioClient.messages.create({
    from: TWILIO_WHATSAPP_NUMBER,
    to: formatWhatsAppNumber(to),
    body,
  });
  return message.sid;
}
