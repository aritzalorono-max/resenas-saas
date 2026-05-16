import type { NextConfig } from "next";

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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev; unsafe-inline for RSC
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
    ];
  },
};

export default nextConfig;

