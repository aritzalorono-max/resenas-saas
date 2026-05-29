import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getTranslations } from "next-intl/server";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";
import { ConversationTabs } from "@/components/landing/ConversationTabs";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { TestimonialsCarousel } from "@/components/landing/TestimonialsCarousel";
import { CaseStudiesCarousel } from "@/components/landing/CaseStudiesCarousel";
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

export const metadata: Metadata = {
  title: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
  description: "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Para negocios locales, apps y e-commerce.",
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: "ReseñasYa — Consigue más reseñas de 5★ automáticamente por WhatsApp",
    description: "Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue reseñas en Google Maps, App Store, Play Store o Trustpilot. Para negocios locales, apps y e-commerce.",
  },
};

// ── Datos estructurados Schema.org ────────────────────────────────────────────

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "ReseñasYa",
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
            text: "Con ReseñasYa puedes enviar un WhatsApp automático a cada cliente tras su visita pidiéndole su opinión. Si la experiencia fue positiva, la IA les anima a dejar reseña en Google Maps con el enlace directo a tu ficha. Si fue negativa, responde con empatía sin dirigirles al perfil público.",
          },
        },
        {
          "@type": "Question",
          name: "¿Funciona para peluquerías y centros de estética?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. ReseñasYa está diseñado para cualquier negocio local. Muchas peluquerías y centros de estética lo usan para pedir opinión al cliente justo cuando termina el servicio, aprovechando el momento de máxima satisfacción.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué necesito para empezar?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Solo necesitas una cuenta de Twilio (WhatsApp Business Sandbox gratuita para empezar), el enlace de Google Maps de tu negocio y registrarte en ReseñasYa. La configuración completa lleva menos de 5 minutos.",
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
            text: "Sí. ReseñasYa funciona para cualquier plataforma de reseñas: Google Maps, App Store (Apple) y Play Store (Google). Los desarrolladores de apps lo usan para pedir valoraciones a sus usuarios activos por WhatsApp. Solo tienes que configurar el enlace de tu app en lugar del de Google Maps.",
          },
        },
      ],
    },
    {
      "@type": "Organization",
      name: "ReseñasYa",
      legalName: "Buy & Click, SL",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com",
      logo: `${process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com"}/icon.svg`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "contacto.resenasya@gmail.com",
        contactType: "customer support",
        availableLanguage: "Spanish",
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

export default async function LandingPage() {
  const t = await getTranslations("home");
  const nav = await getTranslations("nav");
  const footer = await getTranslations("footer");

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
    <>
      {/* Datos estructurados Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="min-h-screen bg-white overflow-x-hidden">
        {/* Navbar */}
        <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gray-900 rounded-md flex items-center justify-center shrink-0">
                <span className="text-[10px] font-extrabold text-white tracking-tight leading-none select-none">RY</span>
              </div>
              <span className="text-base font-bold text-gray-900">ReseñasYa</span>
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
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                {nav("startFree")}
              </Link>
            </div>
          </div>
        </nav>

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
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-brand-200"
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
              <p className="text-gray-500 text-lg">4 pasos para conseguir más reseñas en Google Maps, Trustpilot, App Store y más</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="text-4xl font-extrabold text-brand-200 mb-3">{step.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* Vídeo demostrativo */}
            <div className="mt-14">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/Hu52ipdFzjk"
                  title="Demostración ReseñasYa"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
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
                Resultados reales de negocios reales
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                {t("casesDesc")}
              </p>
            </div>

            <CaseStudiesCarousel />

            <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/casos-exito"
                className="border-2 border-brand-600 text-brand-700 font-bold px-7 py-3.5 rounded-xl text-base hover:bg-brand-50 transition inline-block"
              >
                {t("casesBtn")}
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition shadow-lg shadow-brand-200 inline-block"
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
              <p className="text-gray-500 text-lg">
                Si tienes clientes y quieres más reseñas en Google, App Store, Play Store, Trustpilot… ReseñasYa es para ti
              </p>
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
                  <span className="font-bold text-gray-800">ReseñasYa</span>
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
                    <li><a href="#sectores" className="text-sm text-gray-500 hover:text-gray-800 transition">Sectores</a></li>
                    <li><Link href="/casos-exito" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("successCases")}</Link></li>
                    <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("blog")}</Link></li>
                    <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("faq")}</Link></li>
                    <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-800 transition">Crear cuenta</Link></li>
                    <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition">{nav("login")}</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Soporte</p>
                  <ul className="space-y-2">
                    <li><Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("contact")}</Link></li>
                    <li>
                      <a href="mailto:contacto.resenasya@gmail.com" className="text-sm text-gray-500 hover:text-gray-800 transition">
                        contacto.resenasya@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">{footer("legal")}</p>
                  <ul className="space-y-2">
                    <li><Link href="/terminos" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("terms")}</Link></li>
                    <li><Link href="/privacidad" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("privacy")}</Link></li>
                    <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-800 transition">{footer("cookies")}</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                © {new Date().getFullYear()} ReseñasYa S.L. {footer("rights")}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500 items-center">
                <Link href="/privacidad" className="hover:text-gray-600 transition">{footer("privacy")}</Link>
                <Link href="/terminos" className="hover:text-gray-600 transition">{footer("terms")}</Link>
                <Link href="/cookies" className="hover:text-gray-600 transition">{footer("cookies")}</Link>
                <ManageCookiesButton />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
