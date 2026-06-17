import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByUserId } from "@/lib/business";
import { PosterClient } from "./PosterClient";
import QRCode from "qrcode";
import { getTranslations } from "next-intl/server";
import { logger } from "@/lib/logger";

export default async function CartelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [business, t] = await Promise.all([
    getBusinessByUserId(supabase, user.id),
    getTranslations("cartel"),
  ]);

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 text-sm">{t("noBusinessMsg")}</p>
      </div>
    );
  }

  const activeLink = business.review_links?.find(
    (l) => l.url === business.google_maps_url
  );
  const platformName = activeLink?.name ?? "Google Maps";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const reviewUrl = activeLink?.shortCode
    ? `${appUrl}/r/${activeLink.shortCode}`
    : (business.google_maps_url ?? appUrl);

  const rawTwilioNumber = process.env.TWILIO_WHATSAPP_NUMBER ?? "";
  const whatsappNumber = rawTwilioNumber.replace(/^whatsapp:/i, "");
  const whatsappNumberClean = whatsappNumber.replace(/\D/g, "");

  let reviewQrDataUrl = "";
  let whatsappQrDataUrl = "";
  try {
    [reviewQrDataUrl, whatsappQrDataUrl] = await Promise.all([
      reviewUrl
        ? QRCode.toDataURL(reviewUrl, {
            width: 400, margin: 1,
            color: { dark: "#111827", light: "#ffffff" },
            errorCorrectionLevel: "M",
          })
        : Promise.resolve(""),
      whatsappNumberClean
        ? QRCode.toDataURL(`https://wa.me/${whatsappNumberClean}`, {
            width: 400, margin: 1,
            color: { dark: "#111827", light: "#ffffff" },
            errorCorrectionLevel: "M",
          })
        : Promise.resolve(""),
    ]);
  } catch (err) {
    logger.error("Error generando códigos QR para el cartel", err);
  }

  return (
    <PosterClient
      businessName={business.name}
      platformName={platformName}
      reviewUrl={reviewUrl}
      reviewQrDataUrl={reviewQrDataUrl}
      whatsappQrDataUrl={whatsappQrDataUrl}
      logoUrl={business.logo_url ?? null}
      incentiveEnabled={business.incentive_enabled}
      incentiveDescription={business.incentive_description}
      whatsappNumber={whatsappNumber}
    />
  );
}
