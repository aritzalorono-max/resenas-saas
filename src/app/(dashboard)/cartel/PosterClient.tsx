"use client";

import { Printer, Star } from "lucide-react";

interface PosterClientProps {
  businessName: string;
  platformName: string;
  reviewUrl: string;
  qrDataUrl: string;
  incentiveEnabled: boolean;
  incentiveDescription: string | null;
  whatsappNumber: string;
}

export function PosterClient({
  businessName,
  platformName,
  reviewUrl,
  qrDataUrl,
  incentiveEnabled,
  incentiveDescription,
  whatsappNumber,
}: PosterClientProps) {
  return (
    <div>
      {/* Botón de impresión — se oculta al imprimir */}
      <div className="print:hidden mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cartel para imprimir</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Imprímelo y colócalo en tu negocio para que los clientes puedan dejar su reseña.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white
                     text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Printer size={16} />
          Imprimir / Guardar PDF
        </button>
      </div>

      {/* Poster — área imprimible */}
      <div
        id="poster"
        className="bg-white rounded-2xl shadow-md border border-gray-100 mx-auto
                   w-full max-w-sm print:shadow-none print:border-none print:rounded-none
                   print:max-w-full print:w-full overflow-hidden"
      >
        {/* Cabecera verde */}
        <div className="bg-brand-600 px-8 pt-10 pb-8 text-center">
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

        {/* Cuerpo */}
        <div className="px-8 py-7 text-center">
          <p className="text-gray-600 text-sm font-medium mb-5">
            Escanea el código y deja tu reseña en<br />
            <span className="font-bold text-gray-900">{platformName}</span>
          </p>

          {/* QR */}
          <div className="inline-block p-3 border-2 border-gray-100 rounded-2xl bg-white shadow-sm mb-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrDataUrl}
              alt={`QR código para ${platformName}`}
              width={200}
              height={200}
              className="block"
            />
          </div>

          {/* URL corta visible */}
          <p className="text-xs text-gray-400 font-mono break-all mb-6">
            {reviewUrl}
          </p>

          {/* Nombre del negocio */}
          <div className="border-t border-gray-100 pt-5">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Negocio</p>
            <p className="text-base font-bold text-gray-900">{businessName}</p>
          </div>

          {/* Incentivo */}
          {incentiveEnabled && incentiveDescription && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-left">
              <p className="text-amber-800 text-xs font-bold uppercase tracking-wide mb-1.5">
                🎁 ¿Dejaste una reseña de 5 estrellas?
              </p>
              <p className="text-amber-900 text-sm leading-snug">
                Envíanos una captura de pantalla al WhatsApp{" "}
                <span className="font-bold">{whatsappNumber}</span> y consigue:
              </p>
              <p className="text-amber-900 text-sm font-bold mt-1.5">
                {incentiveDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #poster, #poster * { visibility: visible; }
          #poster {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
          }
        }
      `}</style>
    </div>
  );
}
