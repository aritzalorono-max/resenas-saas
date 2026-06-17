import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug } from "@/lib/blog-posts";
import { Clock, ArrowLeft, Tag } from "lucide-react";

export const revalidate = 86400;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | ReseñasYa Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const categoryColors: Record<string, string> = {
  "Google Maps": "bg-blue-50 text-blue-700",
  "Estrategia": "bg-purple-50 text-purple-700",
  "Reputación": "bg-red-50 text-red-700",
  "SEO Local": "bg-green-50 text-green-700",
  "Legal": "bg-gray-100 text-gray-700",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
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
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "ReseñasYa" },
    publisher: { "@type": "Organization", name: "ReseñasYa", url: "https://resenasya.com" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-600 transition mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${categoryColors[post.category] ?? "bg-gray-100 text-gray-600"}`}>
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3.5 h-3.5" /> {post.readTime} de lectura
              </span>
              <span className="text-xs text-gray-400">{formatDate(post.date)}</span>
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
            <h2 className="text-xl font-bold text-white mb-2">¿Listo para ponerlo en práctica?</h2>
            <p className="text-brand-100 text-sm mb-5">Automatiza la captación de reseñas en menos de 1 minuto.</p>
            <Link href="/register" className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-brand-50 transition inline-block text-sm">
              Empezar gratis →
            </Link>
          </div>

          {/* Related posts */}
          {otherPosts.length > 0 && (
            <div className="mt-14">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Más artículos</h2>
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
