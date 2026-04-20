import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/register"],
        disallow: [
          "/dashboard",
          "/clientes",
          "/resenas",
          "/configuracion",
          "/api/",
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
