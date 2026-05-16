"use client";

import { useState } from "react";
import { Printer, Star, MessageCircle, QrCode } from "lucide-react";

interface PosterClientProps {
  businessName: string;
  platformName: string;
  reviewUrl: string;
  reviewQrDataUrl: string;
  whatsappQrDataUrl: string;
  logoUrl: string | null;
  incentiveEnabled: boolean;
  incentiveDescription: string | null;
  whatsappNumber: string;
}

type PosterType = "qr" | "incentivo" | "whatsapp";

const POSTER_TYPES: { id: PosterType; label: string; icon: React.ReactNode }[] = [
  { id: "qr",        label: "Cartel QR",          icon: <QrCode size={15} /> },
  { id: "incentivo", label: "Cartel incentivo ★",  icon: <Star size={15} /> },
  { id: "whatsapp",  label: "Cartel WhatsApp",     icon: <MessageCircle size={15} /> },
];

export function PosterClient({
  businessName,
  platformName,
  reviewUrl,
  reviewQrDataUrl,
  whatsappQrDataUrl,
  logoUrl,
  incentiveEnabled,
  incentiveDescription,
  whatsappNumber,
}: PosterClientProps) {
  const [selected, setSelected] = useState<PosterType>("qr");

  return (
    <div>
      {/* Controles — se ocultan al imprimir */}
      <div className="print:hidden mb-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Carteles para imprimir</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Elige el modelo y colócalo en tu negocio.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          aria-label="Imprimir o guardar cartel como PDF"
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-700 active:bg-gray-800
                     text-white text-sm font-medium px-5 py-3 rounded-xl transition w-full sm:w-auto shrink-0"
        >
          <Printer size={16} aria-hidden="true" />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* Selector de tipo */}
      <div className="print:hidden flex gap-2 mb-6 flex-wrap">
        {POSTER_TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition border ${
              selected === t.id
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Cartel 1: QR estándar ── */}
      {selected === "qr" && (
        <div
          id="poster"
          className="bg-white rounded-2xl shadow-md border border-gray-100 mx-auto
                     w-full max-w-sm print:shadow-none print:border-none print:rounded-none
                     print:max-w-full print:w-full overflow-hidden"
        >
          <div className="bg-brand-600 px-8 pt-10 pb-8 text-center">
            {logoUrl && (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo de ${businessName}`}
                  className="h-14 w-auto object-contain bg-white rounded-xl p-2" />
              </div>
            )}
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={22} className="text-yellow-300 fill-yellow-300" />
              ))}
            </div>
            <h2 className="text-white text-2xl font-extrabold leading-tight">
              ¿Qué tal fue<br />tu visita?
            </h2>
            <p className="text-green-100 text-sm mt-2 font-medium">
              Tu opinión nos ayuda a mejorar
            </p>
          </div>

          <div className="px-8 py-7 text-center">
            <p className="text-gray-600 text-sm font-medium mb-5">
              Escanea el código y deja tu reseña en<br />
              <span className="font-bold text-gray-900">{platformName}</span>
            </p>
            <div className="inline-block p-3 border-2 border-gray-100 rounded-2xl bg-white shadow-sm mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reviewQrDataUrl} alt="QR reseña" width={200} height={200} className="block" />
            </div>
            <p className="text-xs text-gray-400 font-mono break-all mb-6">{reviewUrl}</p>
            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Negocio</p>
              <p className="text-base font-bold text-gray-900">{businessName}</p>
            </div>
            {incentiveEnabled && incentiveDescription && (
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-left">
                <p className="text-amber-800 text-xs font-bold uppercase tracking-wide mb-1.5">
                  🎁 ¿Dejaste una reseña de 5 estrellas?
                </p>
                <p className="text-amber-900 text-sm leading-snug">
                  Envíanos una captura de pantalla al WhatsApp{" "}
                  <span className="font-bold">{whatsappNumber}</span> y consigue:
                </p>
                <p className="text-amber-900 text-sm font-bold mt-1.5">{incentiveDescription}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Cartel 2: Incentivo 5★ + pantallazo ── */}
      {selected === "incentivo" && (
        <div
          id="poster"
          className="bg-white rounded-2xl shadow-md border border-gray-100 mx-auto
                     w-full max-w-sm print:shadow-none print:border-none print:rounded-none
                     print:max-w-full print:w-full overflow-hidden"
        >
          {/* Cabecera amarilla/dorada */}
          <div className="bg-amber-400 px-8 pt-10 pb-8 text-center">
            {logoUrl && (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo de ${businessName}`}
                  className="h-14 w-auto object-contain bg-white rounded-xl p-2" />
              </div>
            )}
            <div className="flex justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={28} className="text-white fill-white drop-shadow" />
              ))}
            </div>
            <h2 className="text-amber-900 text-2xl font-extrabold leading-tight">
              ¡Deja 5 estrellas<br />y gana un regalo!
            </h2>
            <p className="text-amber-800 text-sm mt-2 font-semibold">
              Solo te llevará 1 minuto
            </p>
          </div>

          <div className="px-8 py-7 text-center">
            <p className="text-gray-600 text-sm font-medium mb-5">
              Escanea el código y deja tu reseña de<br />
              <span className="font-bold text-gray-900">5 estrellas en {platformName}</span>
            </p>
            <div className="inline-block p-3 border-2 border-amber-100 rounded-2xl bg-white shadow-sm mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={reviewQrDataUrl} alt="QR reseña" width={200} height={200} className="block" />
            </div>
            <p className="text-xs text-gray-400 font-mono break-all mb-6">{reviewUrl}</p>

            {/* Pasos */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-5 text-left space-y-3">
              <p className="text-amber-900 text-xs font-bold uppercase tracking-wide">Cómo conseguir tu regalo</p>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-900 text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
                <p className="text-amber-900 text-sm leading-snug">Escanea el QR y escribe tu reseña de <strong>5 estrellas</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-900 text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
                <p className="text-amber-900 text-sm leading-snug">Haz una <strong>captura de pantalla</strong> de tu reseña publicada</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-900 text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
                <p className="text-amber-900 text-sm leading-snug">
                  Envíanosla al WhatsApp{" "}
                  <strong>{whatsappNumber}</strong> y recibe automáticamente:
                </p>
              </div>
              {incentiveDescription && (
                <p className="text-amber-900 text-base font-extrabold text-center pt-1">
                  🎁 {incentiveDescription}
                </p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-5 mt-5">
              <p className="text-base font-bold text-gray-900">{businessName}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Cartel 3: WhatsApp opinión ── */}
      {selected === "whatsapp" && (
        <div
          id="poster"
          className="bg-white rounded-2xl shadow-md border border-gray-100 mx-auto
                     w-full max-w-sm print:shadow-none print:border-none print:rounded-none
                     print:max-w-full print:w-full overflow-hidden"
        >
          {/* Cabecera verde WhatsApp */}
          <div className="bg-[#25D366] px-8 pt-10 pb-8 text-center">
            {logoUrl && (
              <div className="flex justify-center mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt={`Logo de ${businessName}`}
                  className="h-14 w-auto object-contain bg-white rounded-xl p-2" />
              </div>
            )}
            {/* WhatsApp icon */}
            <div className="flex justify-center mb-3">
              <svg viewBox="0 0 24 24" className="w-14 h-14 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <h2 className="text-white text-2xl font-extrabold leading-tight">
              ¿Qué te ha parecido<br />tu visita?
            </h2>
            <p className="text-green-100 text-sm mt-2 font-medium">
              Cuéntanoslo por WhatsApp
            </p>
          </div>

          <div className="px-8 py-7 text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">
              Escanea el código o escríbenos al
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mb-5 tracking-wide">
              {whatsappNumber}
            </p>

            {whatsappQrDataUrl && (
              <div className="inline-block p-3 border-2 border-gray-100 rounded-2xl bg-white shadow-sm mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={whatsappQrDataUrl} alt="QR WhatsApp" width={200} height={200} className="block" />
              </div>
            )}

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Tu opinión es muy importante para nosotros.<br />
              <strong className="text-gray-700">¡Te respondemos personalmente!</strong>
            </p>

            <div className="border-t border-gray-100 pt-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Negocio</p>
              <p className="text-base font-bold text-gray-900">{businessName}</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #poster, #poster * { visibility: visible; }
          #poster {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
