import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts, getPostBySlug, getStaticBlogParams, getBlogPostAllSlugs } from "@/content/blog-posts-data";
import { Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { blogHreflangAlternates, buildUrl, APP_URL } from "@/lib/seo";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { ShareButtons } from "@/components/blog/ShareButtons";

export const revalidate = 86400;

export function generateStaticParams() {
  return getStaticBlogParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const post = getPostBySlug(slug, locale);
  if (!post) return {};

  const prefix = locale === "es" ? "" : `/${locale}`;
  const url = `${APP_URL}${prefix}/blog/${post.slug}`;
  const slugsByLocale = getBlogPostAllSlugs(slug, locale);
  const title = `${post.title} | ResenasYa Blog`;

  return {
    title,
    description: post.description,
    alternates: {
      canonical: url,
      languages: blogHreflangAlternates(slugsByLocale),
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: ["ResenasYa"],
      locale: locale === "es" ? "es_ES" : locale === "en" ? "en_GB" : `${locale}_${locale.toUpperCase()}`,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

const categoryColors: Record<string, string> = {
  "Google Maps": "bg-blue-50 text-blue-700",
  "Estrategia": "bg-purple-50 text-purple-700",
  "Reputación": "bg-red-50 text-red-700",
  "SEO Local": "bg-green-50 text-green-700",
  "Legal": "bg-gray-100 text-gray-700",
  "Strategy": "bg-purple-50 text-purple-700",
  "Reputation": "bg-red-50 text-red-700",
  "Local SEO": "bg-green-50 text-green-700",
  "Stratégie": "bg-purple-50 text-purple-700",
  "Réputation": "bg-red-50 text-red-700",
  "Légal": "bg-gray-100 text-gray-700",
  "Strategie": "bg-purple-50 text-purple-700",
  "Lokales SEO": "bg-green-50 text-green-700",
  "Rechtliches": "bg-gray-100 text-gray-700",
  "Strategia": "bg-purple-50 text-purple-700",
  "Reputazione": "bg-red-50 text-red-700",
  "SEO Locale": "bg-green-50 text-green-700",
  "Legale": "bg-gray-100 text-gray-700",
  "Estratégia": "bg-purple-50 text-purple-700",
  "Reputação": "bg-red-50 text-red-700",
};

const localeToDateFormat: Record<string, string> = {
  es: "es-ES", en: "en-GB", fr: "fr-FR", de: "de-DE", it: "it-IT", pt: "pt-PT",
};

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(localeToDateFormat[locale] ?? "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const { slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const allPosts = getBlogPosts(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const otherPosts = relatedPosts.length > 0 ? relatedPosts : allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";
  const prefix = locale === "es" ? "" : `/${locale}`;
  const postUrl = `${appUrl}${prefix}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        author: { "@type": "Organization", name: "ResenasYa" },
        publisher: { "@type": "Organization", name: "ResenasYa", url: appUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: appUrl },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${appUrl}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="py-10 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition mb-8">
            <ArrowLeft className="w-4 h-4" />
            {t("backToBlog")}
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} {t("readTime")}
              </span>
              <span className="text-xs text-gray-400">{formatDate(post.date, locale)}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-4">{post.title}</h1>
            <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-brand-300 pl-4">{post.description}</p>
          </header>

          {/* Content */}
          <div className="min-h-[400px]">
            <MarkdownContent content={post.content} />
          </div>

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">{t("shareTitle") || "Compartir"}</p>
            <ShareButtons url={postUrl} title={post.title} />
          </div>

          {/* CTA */}
          <div className="mt-10 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t("ctaTitle")}</h2>
            <p className="text-brand-100 text-sm mb-5">{t("ctaDesc")}</p>
            <Link href="/register" className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition inline-block text-sm">
              {t("ctaBtn")}
            </Link>
          </div>

          {/* Prev / Next */}
          {(prevPost || nextPost) && (
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {prevPost ? (
                <Link href={`/blog/${prevPost.slug}`} className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition">
                  <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{t("prevPost") || "Anterior"}</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition leading-snug line-clamp-2">{prevPost.title}</p>
                  </div>
                </Link>
              ) : <div />}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition sm:text-right sm:flex-row-reverse">
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">{t("nextPost") || "Siguiente"}</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition leading-snug line-clamp-2">{nextPost.title}</p>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* Related posts */}
          {otherPosts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{t("relatedTitle")}</h2>
              <div className="space-y-3">
                {otherPosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition leading-snug mb-1">{p.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {p.readTime} · {p.category}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
