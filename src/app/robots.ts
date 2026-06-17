import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/casos-exito",
          "/blog",
          "/blog/",
          "/faq",
          "/contacto",
          "/register",
          "/terminos",
          "/privacidad",
          "/cookies",
          "/llms.txt",
        ],
        disallow: [
          "/dashboard",
          "/clientes",
          "/resenas",
          "/configuracion",
          "/cuenta",
          "/cartel",
          "/incentivos",
          "/admin",
          "/r/",
          "/api/",
          "/onboarding",
          "/facturacion",
          "/informes",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
