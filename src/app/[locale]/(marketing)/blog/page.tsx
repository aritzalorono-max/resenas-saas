import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getBlogPosts } from "@/content/blog-posts-data";
import { BookOpen, Clock, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  return {
    title: `${t("title")} | ResenasYa`,
    description: t("subtitle"),
    alternates: { canonical: "/blog" },
    robots: { index: true, follow: true },
    openGraph: {
      title: `${t("title")} | ResenasYa`,
      description: t("subtitle"),
      url: "/blog",
      type: "website",
    },
  };
}

const categoryColors: Record<string, string> = {
  "Google Maps": "bg-blue-50 text-blue-700",
  // ES
  "Estrategia": "bg-purple-50 text-purple-700",
  "Reputación": "bg-red-50 text-red-700",
  "SEO Local": "bg-green-50 text-green-700",
  "Legal": "bg-gray-100 text-gray-700",
  // EN
  "Strategy": "bg-purple-50 text-purple-700",
  "Reputation": "bg-red-50 text-red-700",
  "Local SEO": "bg-green-50 text-green-700",
  // FR
  "Stratégie": "bg-purple-50 text-purple-700",
  "Réputation": "bg-red-50 text-red-700",
  "Légal": "bg-gray-100 text-gray-700",
  // DE (Reputation same as EN, already covered above)
  "Strategie": "bg-purple-50 text-purple-700",
  "Lokales SEO": "bg-green-50 text-green-700",
  "Rechtliches": "bg-gray-100 text-gray-700",
  // IT
  "Strategia": "bg-purple-50 text-purple-700",
  "Reputazione": "bg-red-50 text-red-700",
  "SEO Locale": "bg-green-50 text-green-700",
  "Legale": "bg-gray-100 text-gray-700",
  // PT
  "Estratégia": "bg-purple-50 text-purple-700",
  "Reputação": "bg-red-50 text-red-700",
};

const localeToDateFormat: Record<string, string> = {
  es: "es-ES",
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
};

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(localeToDateFormat[locale] ?? "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const posts = getBlogPosts(locale);
  const [featured, ...rest] = posts;

  return (
    <div className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            {t("title")}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
            <article className="bg-gradient-to-br from-brand-50 to-white rounded-3xl border border-brand-100 p-8 hover:border-brand-300 transition-all hover:shadow-md">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-100 px-3 py-1 rounded-full">
                  {t("featured")}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
                  {featured.category}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-gray-600 mb-5 leading-relaxed">{featured.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featured.readTime} {t("readTime")}
                </span>
                <span>{formatDate(featured.date, locale)}</span>
              </div>
            </article>
          </Link>
        )}

        {/* Rest of posts */}
        <div className="grid sm:grid-cols-2 gap-6">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <article className="bg-white rounded-2xl border border-gray-100 p-6 hover:border-brand-200 hover:shadow-sm transition-all h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors leading-snug text-sm md:text-base flex-1">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  <span>{formatDate(post.date, locale)}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-gray-900 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t("ctaTitle")}</h2>
          <p className="text-gray-400 mb-6">{t("ctaDesc")}</p>
          <Link
            href="/register"
            className="bg-brand-600 hover:bg-brand-500 text-white font-bold px-7 py-3.5 rounded-xl transition inline-block"
          >
            {t("ctaBtn")}
          </Link>
        </div>
      </div>
    </div>
  );
}
