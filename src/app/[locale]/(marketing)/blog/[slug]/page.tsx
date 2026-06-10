import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPosts, getPostBySlug, getStaticBlogParams, getBlogPostAllSlugs } from "@/content/blog-posts-data";
import { Clock, ArrowLeft, Tag } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { blogHreflangAlternates, buildUrl, APP_URL } from "@/lib/seo";

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

function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-lg font-bold text-gray-900 mt-6 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      elements.push(<p key={i} className="font-semibold text-gray-900 mt-4 mb-1">{line.slice(2, -2)}</p>);
    } else if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1.5 my-4 text-gray-600">
          {listItems.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          ))}
        </ul>
      );
      continue;
    } else if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={i} className="border-l-4 border-brand-300 bg-brand-50 pl-4 py-3 pr-4 my-4 rounded-r-xl">
          <p className="text-gray-700 italic text-sm leading-relaxed">{line.slice(2)}</p>
        </blockquote>
      );
    } else if (line.startsWith("| ")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("| ")) {
        if (!lines[i].includes("---")) tableLines.push(lines[i]);
        i++;
      }
      if (tableLines.length > 0) {
        const headers = tableLines[0].split("|").filter(Boolean).map(s => s.trim());
        const rows = tableLines.slice(1).map(row => row.split("|").filter(Boolean).map(s => s.trim()));
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-6">
            <table className="w-full text-sm border border-gray-100 rounded-xl overflow-hidden">
              <thead className="bg-gray-50">
                <tr>{headers.map((h, j) => <th key={j} className="text-left px-4 py-2.5 font-semibold text-gray-700 border-b border-gray-100">{h}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((row, j) => (
                  <tr key={j} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    {row.map((cell, k) => <td key={k} className="px-4 py-2.5 text-gray-600">{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }
    } else if (line.trim() !== "") {
      const html = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
      elements.push(<p key={i} className="text-gray-600 leading-relaxed my-3" dangerouslySetInnerHTML={{ __html: html }} />);
    }

    i++;
  }

  return elements;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const t = await getTranslations("blog");
  const locale = await getLocale();
  const { slug } = await params;
  const post = getPostBySlug(slug, locale);
  if (!post) notFound();

  const allPosts = getBlogPosts(locale);
  const otherPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 3);

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
            <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-brand-200 pl-4">{post.description}</p>
          </header>

          {/* Content */}
          <div className="min-h-[400px]">
            {renderContent(post.content)}
          </div>

          {/* CTA inline */}
          <div className="mt-14 bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">{t("ctaTitle")}</h2>
            <p className="text-brand-100 text-sm mb-5">{t("ctaDesc")}</p>
            <Link href="/register" className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition inline-block text-sm">
              {t("ctaBtn")}
            </Link>
          </div>

          {/* Related posts */}
          {otherPosts.length > 0 && (
            <div className="mt-14">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{t("relatedTitle")}</h2>
              <div className="space-y-4">
                {otherPosts.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                    <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/30 transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-brand-700 transition leading-snug mb-1">{p.title}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {p.readTime} · {p.category}
                        </p>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-brand-400 transition rotate-180 shrink-0 mt-0.5" />
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
