import type { NextConfig } from "next";

/** Cabeceras de seguridad aplicadas a todas las respuestas HTTP */
const securityHeaders = [
  // Impide que navegadores detecten el Content-Type de forma incorrecta
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prohíbe que la app se cargue dentro de un iframe (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Activa el filtro XSS del navegador (legacy, pero sin coste)
  { key: "X-XSS-Protection", value: "1; mode=block" },
  // Controla qué información de referrer se envía al navegar
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deshabilita APIs sensibles del navegador que no usa la app
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  // Fuerza HTTPS durante 1 año (solo efectivo en producción con HTTPS)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "",
      ].filter(Boolean),
    },
  },

  async headers() {
    return [
      {
        // Aplica las cabeceras de seguridad a todas las rutas
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
