import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_URL,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_URL}/faq`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${APP_URL}/contacto`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${APP_URL}/register`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${APP_URL}/login`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${APP_URL}/terminos`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/privacidad`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/cookies`,
      lastModified: new Date("2026-05-16"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
