"use client";

/**
 * Carga scripts de terceros condicionalmente según el consentimiento del usuario.
 *
 * Se re-ejecuta automáticamente cuando el usuario cambia sus preferencias
 * durante la sesión (p. ej. acepta cookies desde el banner).
 *
 * Cómo añadir un nuevo servicio:
 * 1. Incrementa CONSENT_VERSION en /lib/cookie-consent.ts (añade entrada al historial).
 * 2. Actualiza las tablas de la política de cookies en /app/(legal)/cookies/page.tsx.
 * 3. Descomenta o añade el bloque correspondiente aquí.
 *
 * Servicios pendientes de activar (requieren clave/ID de cada plataforma):
 *   - Google Analytics 4    → consent.analytics
 *   - Vercel Analytics      → consent.analytics (privacy-friendly)
 *   - Meta Pixel            → consent.marketing
 *   - LinkedIn Insight Tag  → consent.marketing
 *   - Google Ads            → consent.marketing
 *   - TikTok Pixel          → consent.marketing
 */

import { useEffect } from "react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

export function ConditionalScripts() {
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (!consent) return;

    // ── Analítica ──────────────────────────────────────────────────────────
    if (consent.analytics) {
      // Google Analytics 4
      const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
      if (GA_ID && !document.getElementById("ga-script")) {
        const s = document.createElement("script");
        s.id = "ga-script";
        s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        s.async = true;
        document.head.appendChild(s);
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: unknown[]) { (window as any).dataLayer.push(args); }
        gtag("js", new Date());
        gtag("config", GA_ID, { anonymize_ip: true });
      }
    }

    // ── Marketing y RRSS ───────────────────────────────────────────────────
    if (consent.marketing) {
      // Meta Pixel
      // const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      // if (META_ID && !document.getElementById("fb-pixel")) { /* fbq init */ }

      // LinkedIn Insight Tag
      // const LI_ID = process.env.NEXT_PUBLIC_LI_PARTNER_ID;
      // if (LI_ID && !document.getElementById("li-script")) { /* _linkedin_partner_id init */ }
    }
  }, [consent]);

  return null;
}
