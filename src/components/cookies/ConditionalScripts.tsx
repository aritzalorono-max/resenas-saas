"use client";

/**
 * Carga scripts de terceros condicionalmente según el consentimiento del usuario.
 *
 * Cómo añadir un nuevo servicio:
 * 1. Incrementa CONSENT_VERSION en /lib/cookie-consent.ts (añade entrada al historial).
 * 2. Actualiza las tablas de la política de cookies en /app/(legal)/cookies/page.tsx.
 * 3. Descomenta o añade el bloque correspondiente aquí.
 *
 * Servicios pendientes de activar (requieren clave/ID de cada plataforma):
 *   - Google Analytics 4    → consent.analytics
 *   - Vercel Analytics      → consent.analytics (privacy-friendly, opcional)
 *   - Meta Pixel            → consent.marketing
 *   - LinkedIn Insight Tag  → consent.marketing
 *   - Google Ads            → consent.marketing
 *   - TikTok Pixel          → consent.marketing
 */

import { useEffect } from "react";
import { getStoredConsent } from "@/lib/cookie-consent";

export function ConditionalScripts() {
  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent) return;

    // ── Analítica ──────────────────────────────────────────────────────────
    if (consent.analytics) {
      // Google Analytics 4
      // const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
      // if (GA_ID) {
      //   const s1 = document.createElement("script");
      //   s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      //   s1.async = true;
      //   document.head.appendChild(s1);
      //   window.dataLayer = window.dataLayer || [];
      //   function gtag(...args: unknown[]) { window.dataLayer.push(args); }
      //   gtag("js", new Date());
      //   gtag("config", GA_ID, { anonymize_ip: true });
      // }
    }

    // ── Marketing y RRSS ───────────────────────────────────────────────────
    if (consent.marketing) {
      // Meta Pixel
      // const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      // if (META_PIXEL_ID) { /* fbq init */ }

      // LinkedIn Insight Tag
      // const LI_PARTNER_ID = process.env.NEXT_PUBLIC_LI_PARTNER_ID;
      // if (LI_PARTNER_ID) { /* _linkedin_partner_id init */ }
    }
  }, []);

  return null;
}
