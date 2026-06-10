import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { ChevronDown } from "lucide-react";
import { getFaqData, getFaqPageMeta, getFaqPageHeading } from "@/content/faq-data";
import { hreflangAlternates, buildUrl } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const { title, description } = getFaqPageMeta(locale);
  const url = buildUrl("/faq", locale);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/faq") },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function FaqPage() {
  const locale = await getLocale();
  const faqs = getFaqData(locale);
  const { title, subtitle } = getFaqPageHeading(locale);

  const allFaqs = faqs.flatMap((cat) => cat.items);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com";
  const faqSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: allFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: appUrl },
          { "@type": "ListItem", position: 2, name: "FAQ", item: `${appUrl}/faq` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 text-lg">{subtitle}</p>
      </div>

      <div className="space-y-10">
        {faqs.map((category) => (
          <div key={category.category}>
            <h2 className="text-base font-bold text-brand-600 uppercase tracking-widest mb-4 pb-2 border-b border-gray-100">
              {category.category}
            </h2>
            <dl className="space-y-3">
              {category.items.map((faq) => (
                <details
                  key={faq.q}
                  className="group bg-gray-50 rounded-2xl border border-gray-100 hover:border-brand-200 transition-colors open:border-brand-200 open:bg-white open:shadow-sm"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden select-none">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.q}</span>
                    <ChevronDown className="w-4 h-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{faq.a}</p>
                  </div>
                </details>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
