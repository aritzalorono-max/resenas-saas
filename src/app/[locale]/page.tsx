import { NextIntlClientProvider } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations, getMessages } from "next-intl/server";
import { localizedPath } from "@/lib/localized-paths";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";
import { YoutubeEmbed } from "@/components/landing/YoutubeEmbed";
import dynamic from "next/dynamic";
import { hreflangAlternates, buildUrl } from "@/lib/seo";

const ConversationTabs = dynamic(
  () => import("@/components/landing/ConversationTabs").then((m) => m.ConversationTabs),
  { loading: () => <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" /> }
);
const PricingPlans = dynamic(
  () => import("@/components/landing/PricingPlans").then((m) => m.PricingPlans),
  { loading: () => <div className="h-96 rounded-2xl bg-gray-100 animate-pulse" /> }
);
const TestimonialsCarousel = dynamic(
  () => import("@/components/landing/TestimonialsCarousel").then((m) => m.TestimonialsCarousel),
  { loading: () => <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" /> }
);
const CaseStudiesCarousel = dynamic(
  () => import("@/components/landing/CaseStudiesCarousel").then((m) => m.CaseStudiesCarousel),
  { loading: () => <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" /> }
);
import {
  Zap,
  Utensils,
  Scissors,
  Stethoscope,
  BedDouble,
  ShoppingBag,
  Dumbbell,
  TrendingUp,
  Brain,
  Scale,
  Briefcase,
  Smartphone,
  Coffee,
  GraduationCap,
} from "lucide-react";

// Landing page is fully static content — regenerate at most once per hour
// so CDN edge nodes serve cached HTML globally without hitting the origin.
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const url = buildUrl("/", locale);
  const title = "ResenasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp";
  const description =
    "Envía WhatsApps a clientes, analiza su opinión con IA y dirige a los satisfechos a dejar reseña en Google Maps, App Store o Play Store. Para negocios locales y apps.";
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/") },
    openGraph: { url, title, description },
  };
}

// ── Datos estructurados Schema.org ────────────────────────────────────────────

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ResenasYa",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        description: "Plan gratuito disponible",
      },
      description:
        "Plataforma SaaS que automatiza la captación de reseñas en Google Maps, App Store y Play Store mediante WhatsApp e inteligencia artificial. Para negocios locales, apps móviles y e-commerce.",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com",
      featureList: [
        "Envío automático de WhatsApp a clientes",
        "Análisis de sentimiento con IA",
        "Redirección a Google Maps, App Store o Play Store solo para clientes satisfechos",
        "Panel de métricas en tiempo real",
        "Configuración en menos de 5 minutos",
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Cómo conseguir más reseñas en Google Maps para un restaurante?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Con ResenasYa puedes enviar un WhatsApp automático a cada cliente tras su visita pidiéndole su opinión. Si la experiencia fue positiva, la IA les anima a dejar reseña en Google Maps con el enlace directo a tu ficha. Si fue negativa, responde con empatía sin dirigirles al perfil público.",
          },
        },
        {
          "@type": "Question",
          name: "¿Funciona para peluquerías y centros de estética?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. ResenasYa está diseñado para cualquier negocio local. Muchas peluquerías y centros de estética lo usan para pedir opinión al cliente justo cuando termina el servicio, aprovechando el momento de máxima satisfacción.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué necesito para empezar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Solo necesitas una cuenta de Twilio (WhatsApp Business Sandbox gratuita para empezar), el enlace de Google Maps de tu negocio y registrarte en ResenasYa. La configuración completa lleva menos de 5 minutos.",
          },
        },
        {
          "@type": "Question",
          name: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. En el contexto de una visita reciente a tu negocio y usando números que el cliente te ha proporcionado voluntariamente, el envío es legal bajo el RGPD. Recomendamos informar al cliente en el momento de la visita.",
          },
        },
        {
          "@type": "Question",
          name: "¿Puedo personalizar los mensajes de WhatsApp?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Puedes personalizar el mensaje inicial de bienvenida y elegir entre tres tonos de comunicación: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se generan automáticamente adaptados al tono elegido.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo funciona el análisis de sentimiento?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cuando el cliente responde al WhatsApp, Claude AI (de Anthropic) analiza el texto al instante y lo clasifica como positivo, negativo o neutral. En función del resultado, el sistema envía un mensaje de seguimiento diferente: si es positivo, le invita a dejar reseña en Google Maps, App Store o Play Store; si es negativo, responde con empatía sin darle el enlace.",
          },
        },
        {
          "@type": "Question",
          name: "¿Se puede usar para conseguir reseñas en App Store y Play Store?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. ResenasYa funciona para cualquier plataforma de reseñas: Google Maps, App Store (Apple) y Play Store (Google). Los desarrolladores de apps lo usan para pedir valoraciones a sus usuarios activos por WhatsApp. Solo tienes que configurar el enlace de tu app en lugar del de Google Maps.",
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      name: "ResenasYa",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com",
    },
    {
      "@type": "Organization",
      name: "ResenasYa",
      legalName: "Buy & Click, SL",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com",
      logo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com"}/icon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "info@resenasya.com",
        telephone: "+34613640396",
        contactType: "customer support",
        availableLanguage: ["Spanish", "English", "French", "German", "Italian", "Portuguese"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Avda. Ribera de Axpe 11 2D-202",
        addressLocality: "Erandio",
        addressRegion: "Bizkaia",
        postalCode: "48950",
        addressCountry: "ES",
      },
    },
  ],
};

// ── Contenido ─────────────────────────────────────────────────────────────────

const sectorIcons = [
  { Icon: Utensils,     key: "sectorRestaurants" as const },
  { Icon: Coffee,       key: "sectorCafes"        as const },
  { Icon: Scissors,     key: "sectorBeauty"       as const },
  { Icon: Brain,        key: "sectorPsychologists" as const },
  { Icon: Stethoscope,  key: "sectorClinics"      as const },
  { Icon: Scale,        key: "sectorLegal"        as const },
  { Icon: Briefcase,    key: "sectorAccountants"  as const },
  { Icon: BedDouble,    key: "sectorHotels"       as const },
  { Icon: ShoppingBag,  key: "sectorEcommerce"    as const },
  { Icon: Smartphone,   key: "sectorApps"         as const },
  { Icon: Dumbbell,     key: "sectorGyms"         as const },
  { Icon: GraduationCap, key: "sectorAcademies"   as const },
];

export default async function LandingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, nav, footer, all] = await Promise.all([
    getTranslations("home"),
    getTranslations("nav"),
    getTranslations("footer"),
    getMessages(),
  ]);
  // Dynamic client components (ConversationTabs, PricingPlans, etc.) need these
  // namespaces. The locale-level provider only ships universal namespaces, so we
  // add a page-scoped provider here.
  // Inner provider replaces (does not inherit) the locale-level outer provider.
  // Include all namespaces used by client components inside this page:
  // - home / precios: ConversationTabs, PricingPlans, TestimonialsCarousel, CaseStudiesCarousel
  // - common: LanguageSwitcher
  // - cookieBanner: ManageCookiesButton
  const pageMessages = {
    home: all.home,
    precios: all.precios,
    common: all.common,
    cookieBanner: all.cookieBanner,
  };

  const sectors = sectorIcons.map(({ Icon, key }) => ({ Icon, name: t(key), key }));

  const steps = [
    {
      number: "01",
      title: t("step1Title"),
      desc: t("step1Desc"),
    },
    {
      number: "02",
      title: t("step2Title"),
      desc: t("step2Desc"),
    },
    {
      number: "03",
      title: t("step3Title"),
      desc: t("step3Desc"),
    },
    {
      number: "04",
      title: "Respuesta inteligente",
      desc: "Si es positiva → enlace directo a la plataforma elegida. Si es negativa → respuesta empática en privado.",
    },
  ];

  return (
    <NextIntlClientProvider locale={locale} messages={pageMessages}>
      {/* Datos estructurados Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Navbar */}
        <nav aria-label="Navegación principal" className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
                <span className="text-[10px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
              </div>
              <span className="text-base font-bold text-gray-900">ResenasYa</span>
            </Link>
            <div className="flex items-center gap-4">
              <a href="#precios" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">
                {nav("pricing")}
              </a>
              <Link href="/blog" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">
                {nav("blog")}
              </Link>
              <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">
                {nav("login")}
              </Link>
              <LanguageSwitcher />
              <Link
                href="/register"
                className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                {nav("startFree")}
              </Link>
            </div>
          </div>
        </nav>

        <main id="main-content">
        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-50 via-white to-white py-20 lg:py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" strokeWidth={2} />
              {t("badge")}
            </div>
            <h1 className="text-3xl xs:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              {t.rich("heroTitle", {
                stars: (chunks) => <span className="text-brand-600">{chunks}</span>,
              })}
            </h1>

            {/* Platform strip */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
              <span className="text-xs text-gray-500 mr-1">En</span>
              {["Google Maps", "App Store", "Play Store", "Trustpilot"].map((p) => (
                <span
                  key={p}
                  className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {p}
                </span>
              ))}
              <span className="text-xs text-gray-500 ml-1">y más</span>
            </div>

            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-brand-200"
              >
                {t("startFree")}
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-5">{t("noCard")}</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 lg:py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("howItWorks")}</h2>
              <p className="text-gray-500 text-lg">{t("howSubtitle")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="text-4xl font-extrabold text-brand-600 mb-3">{step.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Vídeo demostrativo — solo en español */}
            {locale === "es" && (
              <div className="mt-14">
                <div className="relative w-full rounded-2xl overflow-hidden shadow-xl aspect-video bg-gray-900">
                  <YoutubeEmbed videoId="Hu52ipdFzjk" title="Demostración ResenasYa" />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Example conversation */}
        <section className="py-12 lg:py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("conversationTitle")}
              </h2>
              <p className="text-gray-500 text-lg">{t("conversationSubtitle")}</p>
            </div>
            <ConversationTabs />
          </div>
        </section>

        {/* Gestión de reputación: respuestas automáticas + eliminar negativas */}
        <section className="py-12 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("reputationTitle")}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {t("reputationSubtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Card 1: Respuestas automáticas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                      strokeLinejoin="round" className="text-brand-600">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      <path d="m10 7-3 3 3 3"/><path d="M17 13h-6"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">{t("replyCardBadge")}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-0.5">{t("replyCardTitle")}</h3>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">{t("replyCardDesc")}</p>

                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-yellow-400 text-xs">★★★★★</span>
                      <span className="text-xs font-semibold text-gray-900">{t("replyExampleName")}</span>
                    </div>
                    <p className="text-xs text-gray-600">{t("replyExampleReview")}</p>
                  </div>
                  <div className="border-l-2 border-brand-300 pl-3">
                    <p className="text-xs font-semibold text-brand-700 mb-0.5">{t("replyExampleLabel")}</p>
                    <p className="text-xs text-gray-600">{t("replyExampleResponse")}</p>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {([t("replyFeature1"), t("replyFeature2"), t("replyFeature3")] as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card 2: Eliminar reseñas negativas */}
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                      fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"
                      strokeLinejoin="round" className="text-red-500">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="m14.5 9-5 5"/><path d="m9.5 9 5 5"/>
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{t("removeCardBadge")}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-0.5">{t("removeCardTitle")}</h3>
                  </div>
                </div>

                <p className="text-gray-500 leading-relaxed">{t("removeCardDesc")}</p>

                <div className="bg-red-50 rounded-xl p-4 space-y-3 border border-red-100">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-red-400 text-xs">★☆☆☆☆</span>
                      <span className="text-xs font-semibold text-gray-900">{t("removeExampleName")}</span>
                    </div>
                    <p className="text-xs text-gray-600">{t("removeExampleReview")}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {t("removeExampleBadge")}
                    </span>
                    <span className="text-xs text-gray-500">{t("removeExampleMeta")}</span>
                  </div>
                  <div className="w-full bg-red-500 text-white text-xs font-semibold py-2 rounded-lg text-center">
                    {t("removeBtn")}
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {([t("removeFeature1"), t("removeFeature2"), t("removeFeature3")] as string[]).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 lg:py-24 px-6 bg-white" id="opiniones">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("testimonialsTitle")}
              </h2>
              <p className="text-gray-500 text-lg">{t("testimonialsSubtitle")}</p>
            </div>
            <TestimonialsCarousel />
          </div>
        </section>

        {/* Case studies */}
        <section className="py-12 lg:py-24 px-6 bg-gray-50" id="casos-exito">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 lg:mb-14">
              <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
                {t("casesTitle")}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("casesHeading")}
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {t("casesDesc")}
              </p>
            </div>

            <CaseStudiesCarousel />

            <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={localizedPath("/casos-exito", locale)}
                className="border-2 border-brand-600 text-brand-700 font-bold px-7 py-3.5 rounded-xl text-base hover:bg-brand-50 transition inline-block"
              >
                {t("casesBtn")}
              </Link>
              <Link
                href="/register"
                className="bg-brand-700 hover:bg-brand-800 text-white font-bold px-7 py-3.5 rounded-xl text-base transition shadow-lg shadow-brand-200 inline-block"
              >
                {t("startFree")}
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 lg:py-24 px-6 bg-white" id="precios">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {t("pricingTitle")}
              </h2>
              <p className="text-gray-500 text-lg">
                {t("pricingSubtitle")}
              </p>
            </div>
            <PricingPlans />
          </div>
        </section>

        {/* Sectors — local SEO */}
        <section className="py-12 lg:py-24 px-6 bg-gray-50" id="sectores">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 lg:mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t("sectorsTitle")}
              </h2>
              <p className="text-gray-500 text-lg">{t("sectorsSubtitle")}</p>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-6 px-6
                            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sectors.map(({ Icon, name, key }) => (
                <div
                  key={key}
                  className="shrink-0 snap-center w-[38vw] sm:w-[22vw] lg:w-[14vw]
                             bg-white rounded-2xl p-4 border border-gray-100 hover:border-brand-200
                             transition-all flex flex-col items-center text-center gap-2"
                >
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  </div>
                  <p className="font-semibold text-gray-900 text-xs leading-snug">{name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-12 lg:py-24 px-6 bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              {t("ctaTitle")}
            </h2>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              {t("ctaDesc")}
            </p>
            <Link
              href="/register"
              className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition inline-block shadow-lg"
            >
              {t("ctaBtn")}
            </Link>
          </div>
        </section>

        {/* Footer */}
        </main>
        <footer className="border-t border-gray-100 bg-gray-50 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Top row */}
            <div className="flex flex-col lg:flex-row gap-10 mb-10">
              {/* Brand */}
              <div className="lg:w-56 shrink-0">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
                  </div>
                  <span className="font-bold text-gray-800">ResenasYa</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">
                  {footer("tagline")}
                </p>
              </div>

              {/* Nav columns */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{footer("product")}</p>
                  <ul className="space-y-2">
                    <li><a href="#precios" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("pricing")}</a></li>
                    <li><a href="#sectores" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("sectors")}</a></li>
                    <li><Link href={localizedPath("/casos-exito", locale)} className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("successCases")}</Link></li>
                    <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("blog")}</Link></li>
                    <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("faq")}</Link></li>
                    <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("register")}</Link></li>
                    <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition">{nav("login")}</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{footer("support")}</p>
                  <ul className="space-y-2">
                    <li><Link href={localizedPath("/contacto", locale)} className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("contact")}</Link></li>
                    <li>
                      <a href="mailto:info@resenasya.com" className="text-sm text-gray-500 hover:text-gray-800 transition">
                        info@resenasya.com
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{footer("legal")}</p>
                  <ul className="space-y-2">
                    <li><Link href={localizedPath("/terminos", locale)} className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("terms")}</Link></li>
                    <li><Link href={localizedPath("/privacidad", locale)} className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("privacy")}</Link></li>
                    <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("cookies")}</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} ResenasYa S.L. {footer("rights")}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 items-center">
                <Link href={localizedPath("/privacidad", locale)} className="hover:text-gray-600 transition">{footer("privacy")}</Link>
                <Link href={localizedPath("/terminos", locale)} className="hover:text-gray-600 transition">{footer("terms")}</Link>
                <Link href="/cookies" className="hover:text-gray-600 transition">{footer("cookies")}</Link>
                <ManageCookiesButton />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
