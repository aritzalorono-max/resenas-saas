import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostMeta, getPostBySlug, getStaticBlogParams, getBlogPostAllSlugs } from "@/content/blog-posts-data";
import { Clock, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { blogHreflangAlternates, buildUrl, APP_URL } from "@/lib/seo";
import { MarkdownContent } from "@/components/blog/MarkdownContent";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { CATEGORY_COLORS, formatPostDate } from "@/lib/blog-utils";

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

/**
 * Extrae pares pregunta/respuesta de los encabezados H2 en forma de pregunta.
 * La respuesta es el texto que sigue al encabezado hasta el siguiente encabezado.
 */
function extractFaq(content: string): Array<{ question: string; answer: string }> {
  const lines = content.split("\n");
  const faq: Array<{ question: string; answer: string }> = [];
  let current: { question: string; answer: string[] } | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) faq.push({ question: current.question, answer: current.answer.join(" ") });
      const heading = line.slice(3).trim();
      current = /[?？]$/.test(heading) ? { question: heading, answer: [] } : null;
    } else if (current && line.trim() !== "" && !line.startsWith("|")) {
      // Texto plano sin marcas de markdown para el schema
      current.answer.push(
        line.replace(/^[->]\s*/, "").replace(/\*\*(.+?)\*\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").trim()
      );
    }
  }
  if (current) faq.push({ question: current.question, answer: current.answer.join(" ") });

  return faq.filter((f) => f.answer.length > 0);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const { slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const allPosts = getBlogPostMeta(locale);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const relatedPosts = allPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const otherPosts = relatedPosts.length > 0 ? relatedPosts : allPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const prefix = locale === "es" ? "" : `/${locale}`;
  const postUrl = `${APP_URL}${prefix}/blog/${post.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: locale,
    url: postUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
    author: { "@type": "Organization", name: "ResenasYa", url: APP_URL },
    publisher: { "@type": "Organization", name: "ResenasYa", url: APP_URL },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ResenasYa", item: `${APP_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${APP_URL}${prefix}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  const faqItems = extractFaq(post.content);
  const faqSchema = faqItems.length >= 2
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}

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
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} {t("readTime")}
              </span>
              <span className="text-xs text-gray-500">{formatPostDate(post.date, locale)}</span>
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
                    <p className="text-xs text-gray-500 mb-1">{t("prevPost") || "Anterior"}</p>
                    <p className="text-sm font-semibold text-gray-800 group-hover:text-brand-700 transition leading-snug line-clamp-2">{prevPost.title}</p>
                  </div>
                </Link>
              ) : <div />}
              {nextPost && (
                <Link href={`/blog/${nextPost.slug}`} className="group flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition sm:text-right sm:flex-row-reverse">
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 mb-1">{t("nextPost") || "Siguiente"}</p>
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
                        <p className="text-xs text-gray-500 flex items-center gap-2">
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
