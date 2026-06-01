import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates, buildUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("contact"), getLocale()]);
  const title = `${t("title")} | ResenasYa`;
  const description = t("subtitle");
  const url = buildUrl("/contacto", locale);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/contacto") },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
