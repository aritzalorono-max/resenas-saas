import Link from "next/link";
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  alternates: { canonical: "/" },
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
      screenshot: "/og-image.png",
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
  ],
};

// ── Contenido ─────────────────────────────────────────────────────────────────


const steps = [
  {
    number: "01",
    title: "El cliente visita tu negocio",
    desc: "Introduces su nombre y teléfono en el panel de ReseñasYa.",
  },
  {
    number: "02",
    title: "Le llega un WhatsApp",
    desc: "Automáticamente recibe un mensaje personalizado preguntando por su experiencia.",
  },
  {
    number: "03",
    title: "Responde con su opinión",
    desc: "El cliente escribe lo que piensa. Claude AI analiza el sentimiento al instante.",
  },
  {
    number: "04",
    title: "Respuesta inteligente",
    desc: "Si es positiva → enlace a Google Maps, App Store o Play Store. Si es negativa → mensaje empático sin enlace.",
  },
];

const sectors = [
  {
    Icon: Utensils,
    name: "Restaurantes",
    headline: "Más reseñas Google Maps para restaurantes",
    desc: "Envía el WhatsApp justo cuando el cliente pide la cuenta — el momento de mayor satisfacción. Funciona para restaurantes, bares, hamburgueserías, sushi, pizzerías y cualquier tipo de cocina.",
    keywords: ["restaurante", "bar", "fast food", "sushi", "pizzería"],
  },
  {
    Icon: Coffee,
    name: "Cafeterías y brunch",
    headline: "Reseñas Google para cafeterías",
    desc: "Convierte cada café de la mañana en una reseña. El volumen de clientes diarios hace que los resultados se noten desde la primera semana.",
    keywords: ["cafetería", "brunch", "pastelería", "panadería"],
  },
  {
    Icon: Scissors,
    name: "Peluquerías y estética",
    headline: "Reseñas Google para peluquerías",
    desc: "El cliente sale con un look espectacular. Aprovecha ese momento de satisfacción para pedirle que comparta su experiencia en Google Maps.",
    keywords: ["peluquería", "barbería", "uñas", "estética"],
  },
  {
    Icon: Brain,
    name: "Psicólogos y terapeutas",
    headline: "Reseñas de psicólogos en Google Maps",
    desc: "La reputación online es clave para que nuevos pacientes te encuentren. Automatiza la captación de valoraciones con máxima discreción y respeto.",
    keywords: ["psicólogo", "terapeuta", "coach", "bienestar"],
  },
  {
    Icon: Stethoscope,
    name: "Clínicas y salud",
    headline: "Reseñas Google Maps para clínicas",
    desc: "Cada paciente satisfecho puede atraer a nuevos. El filtro de sentimiento gestiona los casos delicados en privado, sin exposición pública.",
    keywords: ["dentista", "clínica", "fisio", "médico"],
  },
  {
    Icon: Scale,
    name: "Abogados y despachos",
    headline: "Reseñas Google para abogados",
    desc: "En un sector donde la confianza lo es todo, las reseñas positivas marcan la diferencia. Automatiza la captación sin que parezca forzado.",
    keywords: ["abogado", "notaría", "procurador", "legal"],
  },
  {
    Icon: Briefcase,
    name: "Gestorías y asesorías",
    headline: "Reseñas para gestorías y asesorías",
    desc: "Tus clientes te recomiendan en persona, pero pocos lo hacen en Google. Un WhatsApp en el momento justo cambia esa dinámica.",
    keywords: ["gestoría", "asesoría", "contabilidad", "fiscal"],
  },
  {
    Icon: BedDouble,
    name: "Hoteles y alojamientos",
    headline: "Automatiza reseñas para hoteles",
    desc: "Contacta con el huésped justo al salir del check-out. Maximiza las positivas en Google y gestiona las negativas antes de que lleguen a TripAdvisor.",
    keywords: ["hotel", "hostal", "apartamento turístico"],
  },
  {
    Icon: ShoppingBag,
    name: "E-commerce",
    headline: "Reseñas para tiendas online",
    desc: "Tras cada pedido entregado, envía un WhatsApp automático. Consigue reseñas en Google Maps de tu empresa, en Trustpilot o en tu plataforma favorita.",
    keywords: ["tienda online", "e-commerce", "envío", "pedidos"],
  },
  {
    Icon: Smartphone,
    name: "Apps móviles",
    headline: "Más valoraciones en App Store y Play Store",
    desc: "Pide la valoración a tus usuarios activos por WhatsApp en el momento de máximo engagement. Consigue más estrellas en App Store y Play Store sin depender de los pop-ups in-app.",
    keywords: ["App Store", "Play Store", "iOS", "Android"],
  },
  {
    Icon: Dumbbell,
    name: "Gimnasios y deporte",
    headline: "Reseñas Google para gimnasios",
    desc: "Aumenta tu visibilidad local y atrae más socios. Automatiza las peticiones de reseña tras cada clase o entrenamiento personal.",
    keywords: ["gimnasio", "crossfit", "yoga", "pilates"],
  },
  {
    Icon: GraduationCap,
    name: "Academias y formación",
    headline: "Reseñas Google para academias y centros de formación",
    desc: "Al terminar el curso o el taller es el momento ideal. Consigue que tus alumnos compartan su experiencia y atraigan a nuevos estudiantes.",
    keywords: ["academia", "autoescuela", "idiomas", "formación"],
  },
];



export default function LandingPage() {
  return (
    <>
      {/* Datos estructurados Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="min-h-screen bg-white">
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
                Precios
              </a>
              <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium hidden sm:block">
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition"
              >
                Empezar gratis
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-b from-brand-50 via-white to-white py-20 lg:py-28 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5" strokeWidth={2} />
              Automatiza tus reseñas — en cualquier plataforma
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Consigue más reseñas de{" "}
              <span className="text-brand-600">5★</span>
              <br />
              automáticamente por{" "}
              <span className="text-brand-600">WhatsApp</span>
            </h1>

            {/* Platform strip */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
              <span className="text-xs text-gray-400 mr-1">En</span>
              {["Google Maps", "App Store", "Play Store", "Trustpilot"].map((p) => (
                <span
                  key={p}
                  className="text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {p}
                </span>
              ))}
              <span className="text-xs text-gray-400 ml-1">y más</span>
            </div>

            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y consigue
              que los satisfechos dejen reseña donde más te importa.
              Para negocios locales, apps, webs, servicios y e-commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition shadow-lg shadow-brand-200"
              >
                Crear cuenta gratis →
              </Link>
              <Link
                href="/login"
                className="border-2 border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg hover:border-brand-300 transition"
              >
                Ya tengo cuenta
              </Link>
            </div>
            <p className="text-sm text-gray-400 mt-5">Sin tarjeta de crédito · Configuración en 5 minutos</p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 lg:py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
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
          </div>
        </section>

        {/* Example conversation */}
        <section className="py-12 lg:py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                La conversación que consigue reseñas
              </h2>
              <p className="text-gray-500 text-lg">Completamente automática, personalizada y válida para cualquier plataforma de reseñas</p>
            </div>
            <ConversationTabs />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 lg:py-24 px-6 bg-white" id="opiniones">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Negocios que ya lo están usando
              </h2>
              <p className="text-gray-500 text-lg">Lo que dicen quienes llevan semanas generando reseñas con ReseñasYa</p>
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
                Casos de éxito
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Resultados reales de negocios reales
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                De 23 reseñas a 97 en 2 meses. De ser invisible en Google a aparecer en el top 3 local.
              </p>
            </div>

            <CaseStudiesCarousel />

            <div className="text-center mt-8">
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition shadow-lg shadow-brand-200 inline-block"
              >
                Empieza gratis y escribe tu caso de éxito →
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-12 lg:py-24 px-6 bg-white" id="precios">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 lg:mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Simple y sin sorpresas
              </h2>
              <p className="text-gray-500 text-lg">
                Sin permanencia · Cancela cuando quieras
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
                Restaurantes, apps, abogados, e-commerce y más
              </h2>
              <p className="text-gray-500 text-lg">
                Si tienes clientes y quieres más reseñas en Google, App Store o Play Store, ReseñasYa es para ti
              </p>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-6 px-6
                            [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sectors.map(({ Icon, name, headline }) => (
                <div
                  key={name}
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
              Empieza a conseguir reseñas hoy
            </h2>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              Únete a los negocios que ya automatizan su reputación online con ReseñasYa.
              Sin permanencia, cancela cuando quieras.
            </p>
            <Link
              href="/register"
              className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition inline-block shadow-lg"
            >
              Crear mi cuenta →
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
                  Consigue más reseñas en Google Maps, App Store, Play Store, Trustpilot o cualquier otra plataforma mediante WhatsApp e inteligencia artificial.
                </p>
                {/* RRSS */}
                <div className="flex items-center gap-2">
                  <a
                    href="https://twitter.com/resenasya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ReseñasYa en Twitter"
                    className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/resenasya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ReseñasYa en LinkedIn"
                    className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com/resenasya"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="ReseñasYa en Instagram"
                    className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Nav columns */}
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Producto</p>
                  <ul className="space-y-2">
                    <li><a href="#precios" className="text-sm text-gray-500 hover:text-gray-800 transition">Precios</a></li>
                    <li><a href="#sectores" className="text-sm text-gray-500 hover:text-gray-800 transition">Sectores</a></li>
                    <li><Link href="/faq" className="text-sm text-gray-500 hover:text-gray-800 transition">Preguntas frecuentes</Link></li>
                    <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-800 transition">Crear cuenta</Link></li>
                    <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition">Iniciar sesión</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Soporte</p>
                  <ul className="space-y-2">
                    <li><Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-800 transition">Contacto</Link></li>
                    <li>
                      <a href="mailto:prueba@gmail.com" className="text-sm text-gray-500 hover:text-gray-800 transition">
                        prueba@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Legal</p>
                  <ul className="space-y-2">
                    <li><Link href="/terminos" className="text-sm text-gray-500 hover:text-gray-800 transition">Términos y condiciones</Link></li>
                    <li><Link href="/privacidad" className="text-sm text-gray-500 hover:text-gray-800 transition">Privacidad y aviso legal</Link></li>
                    <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-800 transition">Política de cookies</Link></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                © {new Date().getFullYear()} ReseñasYa S.L. Todos los derechos reservados.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400 items-center">
                <Link href="/privacidad" className="hover:text-gray-600 transition">Privacidad</Link>
                <Link href="/terminos" className="hover:text-gray-600 transition">Términos</Link>
                <Link href="/cookies" className="hover:text-gray-600 transition">Cookies</Link>
                <ManageCookiesButton />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
