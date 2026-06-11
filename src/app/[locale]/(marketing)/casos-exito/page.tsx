import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { getCaseStudies } from "@/content/case-studies-data";
import { hreflangAlternates, buildUrl } from "@/lib/seo";
import { BREADCRUMB_HOME } from "@/lib/blog-utils";

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("casosExito"), getLocale()]);
  const title = `${t("title")} | ResenasYa`;
  const description = t("subtitle");
  const url = buildUrl("/casos-exito", locale);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/casos-exito") },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
const casosLabels: Record<string, string> = {
  es: "Casos de Éxito", en: "Case Studies", fr: "Cas Clients", de: "Erfolgsgeschichten", it: "Casi di Successo", pt: "Casos de Sucesso",
};

export default async function CasosExitoPage() {
  const t = await getTranslations("casosExito");
  const locale = await getLocale();
  const cases = getCaseStudies(locale);

  const casosUrl = buildUrl("/casos-exito", locale);
  const casosSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[locale] ?? "Home", item: buildUrl("/", locale) },
      { "@type": "ListItem", position: 2, name: casosLabels[locale] ?? "Case Studies", item: casosUrl },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(casosSchema) }} />
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 via-white to-white py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
            {t("badge")}
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Summary strip */}
      <section className="py-8 px-6 bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold text-brand-600">+1.200.000</p>
              <p className="text-sm text-gray-500 mt-1">{t("stat1")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-600">+5.800</p>
              <p className="text-sm text-gray-500 mt-1">{t("stat3")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-600">4.8★</p>
              <p className="text-sm text-gray-500 mt-1">{t("stat2")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          {cases.map(({ Icon, sector, platform, name, location, challenge, solution, result, quote, quoteName, stats, color, accent }) => (
            <article key={name} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Header */}
              <div className={`bg-gradient-to-r ${color} px-8 py-6 border-b border-gray-100`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <Icon className={`w-5 h-5 ${accent}`} strokeWidth={1.75} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold uppercase tracking-wider ${accent}`}>{sector}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-xs font-semibold text-gray-500 bg-white/70 px-2 py-0.5 rounded-full">{platform}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mt-0.5">
                      {name} <span className="text-gray-400 font-normal">· {location}</span>
                    </h2>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{t("challenge")}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">{t("solution")}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{solution}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-brand-600 mb-2">{t("result")}</p>
                    <p className="text-sm text-gray-700 font-medium leading-relaxed">{result}</p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-brand-200 pl-4 mb-8">
                  <p className="text-sm text-gray-600 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
                  <p className="text-xs text-gray-400 mt-2 font-medium">— {quoteName}</p>
                </blockquote>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {stats.map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
                      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-400 mt-1 leading-tight">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-br from-brand-600 to-brand-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            {t("ctaTitle")}
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            {t("ctaDesc")}
          </p>
          <Link
            href="/register"
            className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition inline-block shadow-lg"
          >
            {t("ctaBtn")}
          </Link>
          <p className="text-brand-200 text-sm mt-4">{t("noContract")}</p>
        </div>
      </section>
    </>
  );
}
