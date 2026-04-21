import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getBusinessByUserId } from "@/lib/business";
import { PosterClient } from "./PosterClient";
import QRCode from "qrcode";

export default async function CartelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const business = await getBusinessByUserId(supabase, user.id);

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 text-sm">
          Primero completa la configuración de tu negocio.
        </p>
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

  if (!reviewUrl) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-gray-500 text-sm">
          Añade el enlace de tu plataforma de reseñas en la{" "}
          <a href="/configuracion" className="underline text-brand-600">configuración</a>{" "}
          para generar el cartel.
        </p>
      </div>
    );
  }

  const qrDataUrl = await QRCode.toDataURL(reviewUrl, {
    width: 400,
    margin: 1,
    color: { dark: "#111827", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });

  const rawTwilioNumber = process.env.TWILIO_WHATSAPP_NUMBER ?? "";
  const whatsappNumber = rawTwilioNumber.replace(/^whatsapp:/i, "");

  return (
    <PosterClient
      businessName={business.name}
      platformName={platformName}
      reviewUrl={reviewUrl}
      qrDataUrl={qrDataUrl}
      incentiveEnabled={business.incentive_enabled}
      incentiveDescription={business.incentive_description}
      whatsappNumber={whatsappNumber}
    />
  );
}
