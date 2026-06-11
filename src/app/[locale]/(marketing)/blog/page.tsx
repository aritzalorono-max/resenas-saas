import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { getBlogPosts } from "@/content/blog-posts-data";
import { BookOpen, Clock, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates, buildUrl, APP_URL } from "@/lib/seo";
import { CATEGORY_COLORS, formatPostDate } from "@/lib/blog-utils";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
  const title = `${t("title")} | ResenasYa`;
  const description = t("subtitle");
  const url = buildUrl("/blog", locale);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/blog") },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPage() {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const posts = getBlogPosts(locale);
  const [featured, ...rest] = posts;

  const prefix = locale === "es" ? "" : `/${locale}`;
  const blogSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: t("title"),
        description: t("subtitle"),
        url: buildUrl("/blog", locale),
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          url: `${APP_URL}${prefix}/blog/${post.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ResenasYa", item: `${APP_URL}${prefix || "/"}` },
          { "@type": "ListItem", position: 2, name: t("title"), item: buildUrl("/blog", locale) },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }} />
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
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] ?? "bg-gray-100 text-gray-600"}`}>
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
                <span>{formatPostDate(featured.date, locale)}</span>
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
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors leading-snug text-base md:text-lg flex-1">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{post.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-auto">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  <span>{formatPostDate(post.date, locale)}</span>
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
    </>
  );
}
