import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

/** Cabeceras de seguridad aplicadas a todas las respuestas HTTP */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // unsafe-eval only in dev (Next.js HMR requires it); removed in production
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://www.youtube.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Elimina la cabecera X-Powered-By (seguridad + limpieza de headers)
  poweredByHeader: false,

  experimental: {
    // Tree-shaking agresivo de lucide-react: pasa de importar ~1500 iconos
    // a importar solo los usados. Reducción de bundle ~200-400 KB en prod.
    optimizePackageImports: ["lucide-react"],
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "",
      ].filter(Boolean),
    },
  },

  // Dominios permitidos para next/image (logos de negocios en Supabase Storage)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Formatos modernos — Vercel los sirve automáticamente según Accept header
    formats: ["image/avif", "image/webp"],
  },

  async redirects() {
    return [
      // Redirect internal Spanish paths to locale-specific URLs (permanent)
      // EN
      { source: "/en/casos-exito", destination: "/en/case-studies",  permanent: true },
      { source: "/en/contacto",    destination: "/en/contact",        permanent: true },
      { source: "/en/privacidad",  destination: "/en/privacy",        permanent: true },
      { source: "/en/terminos",    destination: "/en/terms",          permanent: true },
      // FR
      { source: "/fr/casos-exito", destination: "/fr/cas-clients",      permanent: true },
      { source: "/fr/contacto",    destination: "/fr/contact",           permanent: true },
      { source: "/fr/privacidad",  destination: "/fr/confidentialite",   permanent: true },
      { source: "/fr/terminos",    destination: "/fr/conditions",        permanent: true },
      // DE
      { source: "/de/casos-exito", destination: "/de/erfolgsgeschichten", permanent: true },
      { source: "/de/contacto",    destination: "/de/kontakt",            permanent: true },
      { source: "/de/privacidad",  destination: "/de/datenschutz",        permanent: true },
      { source: "/de/terminos",    destination: "/de/agb",               permanent: true },
      // IT
      { source: "/it/casos-exito", destination: "/it/casi-di-successo", permanent: true },
      { source: "/it/contacto",    destination: "/it/contatto",          permanent: true },
      { source: "/it/privacidad",  destination: "/it/privacy",           permanent: true },
      { source: "/it/terminos",    destination: "/it/termini",           permanent: true },
      // PT
      { source: "/pt/casos-exito", destination: "/pt/casos-de-sucesso", permanent: true },
      { source: "/pt/contacto",    destination: "/pt/contacto",          permanent: true },
      { source: "/pt/privacidad",  destination: "/pt/privacidade",       permanent: true },
      { source: "/pt/terminos",    destination: "/pt/termos",            permanent: true },

      // Blog: redirect Spanish slugs to locale-specific slugs
      // EN
      { source: "/en/blog/como-conseguir-mas-resenas-google-maps",        destination: "/en/blog/how-to-get-more-google-maps-reviews",                   permanent: true },
      { source: "/en/blog/por-que-clientes-no-dejan-resenas-whatsapp",    destination: "/en/blog/why-customers-dont-leave-whatsapp-reviews",             permanent: true },
      { source: "/en/blog/gestionar-resenas-negativas",                    destination: "/en/blog/how-to-handle-negative-reviews",                        permanent: true },
      { source: "/en/blog/algoritmo-google-maps-reputacion-local",        destination: "/en/blog/google-maps-algorithm-local-seo-reputation",            permanent: true },
      { source: "/en/blog/legal-pedir-resenas-whatsapp-rgpd",             destination: "/en/blog/legal-asking-reviews-whatsapp-gdpr",                    permanent: true },
      // FR
      { source: "/fr/blog/como-conseguir-mas-resenas-google-maps",        destination: "/fr/blog/comment-obtenir-plus-avis-google-maps",                 permanent: true },
      { source: "/fr/blog/por-que-clientes-no-dejan-resenas-whatsapp",    destination: "/fr/blog/pourquoi-clients-ne-laissent-pas-avis-whatsapp",        permanent: true },
      { source: "/fr/blog/gestionar-resenas-negativas",                    destination: "/fr/blog/comment-gerer-les-avis-negatifs",                       permanent: true },
      { source: "/fr/blog/algoritmo-google-maps-reputacion-local",        destination: "/fr/blog/algorithme-google-maps-referencement-local",            permanent: true },
      { source: "/fr/blog/legal-pedir-resenas-whatsapp-rgpd",             destination: "/fr/blog/legal-demander-avis-whatsapp-rgpd",                     permanent: true },
      // DE
      { source: "/de/blog/como-conseguir-mas-resenas-google-maps",        destination: "/de/blog/mehr-google-maps-bewertungen-bekommen",                 permanent: true },
      { source: "/de/blog/por-que-clientes-no-dejan-resenas-whatsapp",    destination: "/de/blog/warum-kunden-keine-bewertungen-per-whatsapp-hinterlassen", permanent: true },
      { source: "/de/blog/gestionar-resenas-negativas",                    destination: "/de/blog/negative-bewertungen-richtig-handhaben",                permanent: true },
      { source: "/de/blog/algoritmo-google-maps-reputacion-local",        destination: "/de/blog/google-maps-algorithmus-lokale-seo",                    permanent: true },
      { source: "/de/blog/legal-pedir-resenas-whatsapp-rgpd",             destination: "/de/blog/recht-bewertungen-per-whatsapp-anfragen-dsgvo",         permanent: true },
      // IT
      { source: "/it/blog/como-conseguir-mas-resenas-google-maps",        destination: "/it/blog/come-ottenere-piu-recensioni-google-maps",              permanent: true },
      { source: "/it/blog/por-que-clientes-no-dejan-resenas-whatsapp",    destination: "/it/blog/perche-i-clienti-non-lasciano-recensioni-whatsapp",     permanent: true },
      { source: "/it/blog/gestionar-resenas-negativas",                    destination: "/it/blog/come-gestire-recensioni-negative",                      permanent: true },
      { source: "/it/blog/algoritmo-google-maps-reputacion-local",        destination: "/it/blog/algoritmo-google-maps-seo-locale",                      permanent: true },
      { source: "/it/blog/legal-pedir-resenas-whatsapp-rgpd",             destination: "/it/blog/legale-chiedere-recensioni-whatsapp-gdpr",              permanent: true },
      // PT
      { source: "/pt/blog/como-conseguir-mas-resenas-google-maps",        destination: "/pt/blog/como-obter-mais-avaliacoes-google-maps",                permanent: true },
      { source: "/pt/blog/por-que-clientes-no-dejan-resenas-whatsapp",    destination: "/pt/blog/por-que-clientes-nao-deixam-avaliacoes-whatsapp",       permanent: true },
      { source: "/pt/blog/gestionar-resenas-negativas",                    destination: "/pt/blog/como-gerir-avaliacoes-negativas",                       permanent: true },
      { source: "/pt/blog/algoritmo-google-maps-reputacion-local",        destination: "/pt/blog/algoritmo-google-maps-seo-local",                       permanent: true },
      { source: "/pt/blog/legal-pedir-resenas-whatsapp-rgpd",             destination: "/pt/blog/legal-pedir-avaliacoes-whatsapp-rgpd",                  permanent: true },
    ];
  },

  async rewrites() {
    return [
      // Serve localized URLs from the internal Spanish page paths
      // EN
      { source: "/en/privacy",       destination: "/en/privacidad" },
      { source: "/en/terms",         destination: "/en/terminos" },
      { source: "/en/contact",       destination: "/en/contacto" },
      { source: "/en/case-studies",  destination: "/en/casos-exito" },
      // FR
      { source: "/fr/confidentialite", destination: "/fr/privacidad" },
      { source: "/fr/conditions",      destination: "/fr/terminos" },
      { source: "/fr/contact",         destination: "/fr/contacto" },
      { source: "/fr/cas-clients",     destination: "/fr/casos-exito" },
      // DE
      { source: "/de/datenschutz",         destination: "/de/privacidad" },
      { source: "/de/agb",                 destination: "/de/terminos" },
      { source: "/de/kontakt",             destination: "/de/contacto" },
      { source: "/de/erfolgsgeschichten",  destination: "/de/casos-exito" },
      // IT
      { source: "/it/privacy",           destination: "/it/privacidad" },
      { source: "/it/termini",           destination: "/it/terminos" },
      { source: "/it/contatto",          destination: "/it/contacto" },
      { source: "/it/casi-di-successo",  destination: "/it/casos-exito" },
      // PT
      { source: "/pt/privacidade",       destination: "/pt/privacidad" },
      { source: "/pt/termos",            destination: "/pt/terminos" },
      { source: "/pt/contacto",          destination: "/pt/contacto" },
      { source: "/pt/casos-de-sucesso",  destination: "/pt/casos-exito" },
    ];
  },

  async headers() {
    return [
      {
        // Cabeceras de seguridad a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        // Cache largo para assets estáticos inmutables (JS/CSS con hash en nombre)
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache moderado para archivos públicos (iconos, manifest)
        source: "/(favicon\\.ico|icon\\.svg|manifest\\.json)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        // Preconnect a YouTube para reducir latencia del iframe de la landing
        source: "/es",
        headers: [
          { key: "Link", value: "<https://www.youtube.com>; rel=preconnect, <https://i.ytimg.com>; rel=preconnect" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);

