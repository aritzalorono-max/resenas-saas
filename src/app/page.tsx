import Link from "next/link";
import type { Metadata } from "next";

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
        "Plataforma SaaS para negocios locales que automatiza la captación de reseñas de Google Maps mediante WhatsApp e inteligencia artificial.",
      url: process.env.NEXT_PUBLIC_APP_URL ?? "https://resenasya.com",
      screenshot: "/og-image.png",
      featureList: [
        "Envío automático de WhatsApp a clientes",
        "Análisis de sentimiento con IA",
        "Redirección a Google Maps solo para clientes satisfechos",
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
            text: "Cuando el cliente responde al WhatsApp, Claude AI (de Anthropic) analiza el texto al instante y lo clasifica como positivo, negativo o neutral. En función del resultado, el sistema envía un mensaje de seguimiento diferente: si es positivo, le invita a dejar reseña en Google Maps; si es negativo, responde con empatía sin darle el enlace.",
          },
        },
      ],
    },
  ],
};

// ── Contenido ─────────────────────────────────────────────────────────────────

const features = [
  {
    icon: "💬",
    title: "WhatsApp automático",
    desc: "En segundos, tu cliente recibe un mensaje personalizado en WhatsApp pidiendo su opinión.",
  },
  {
    icon: "🤖",
    title: "IA que analiza opiniones",
    desc: "Claude AI evalúa si la respuesta es positiva, negativa o neutral de forma precisa.",
  },
  {
    icon: "⭐",
    title: "Más reseñas en Google",
    desc: "Si el cliente está satisfecho, la IA le anima a dejar reseña con el enlace directo.",
  },
  {
    icon: "🛡️",
    title: "Protege tu reputación",
    desc: "Si la experiencia fue mala, respondemos con empatía sin enviarle al perfil público.",
  },
  {
    icon: "📊",
    title: "Panel en tiempo real",
    desc: "Ve todas las solicitudes, respuestas y métricas de satisfacción en un solo lugar.",
  },
  {
    icon: "⚡",
    title: "Listo en 5 minutos",
    desc: "Regístrate, conecta tu cuenta de Twilio y empieza a recopilar reseñas hoy mismo.",
  },
];

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
    desc: "Si es positiva → enlace a Google Maps. Si es negativa → mensaje empático sin enlace.",
  },
];

const sectors = [
  {
    icon: "🍽️",
    name: "Restaurantes y bares",
    headline: "Más reseñas Google Maps para restaurantes",
    desc: "Convierte cada visita en una reseña. Envía el WhatsApp justo cuando el cliente pide la cuenta — el momento de mayor satisfacción.",
    keywords: ["restaurante", "bar", "cafetería", "comida"],
  },
  {
    icon: "✂️",
    name: "Peluquerías y estética",
    headline: "Reseñas Google para peluquerías",
    desc: "El cliente sale con un look espectacular. Aprovecha ese momento para pedirle que comparta su experiencia en Google Maps.",
    keywords: ["peluquería", "barbería", "uñas", "estética"],
  },
  {
    icon: "🦷",
    name: "Clínicas dentales",
    headline: "Reseñas Google Maps para clínicas",
    desc: "Construye una reputación online sólida. Cada paciente satisfecho puede convertirse en una reseña positiva que atrae a nuevos pacientes.",
    keywords: ["dentista", "clínica dental", "ortodoncia"],
  },
  {
    icon: "🏨",
    name: "Hoteles y alojamientos",
    headline: "Automatiza reseñas para hoteles",
    desc: "Contacta con el huésped justo al salir del check-out. Maximiza las reseñas positivas y gestiona las negativas antes de que lleguen a Google.",
    keywords: ["hotel", "hostal", "apartamento turístico"],
  },
  {
    icon: "🛒",
    name: "Tiendas y comercio",
    headline: "Google Maps reviews para tiendas",
    desc: "Cada compra es una oportunidad. Fideliza al cliente y consigue que recomiende tu tienda a otros con solo un WhatsApp.",
    keywords: ["tienda", "comercio", "retail"],
  },
  {
    icon: "🏋️",
    name: "Gimnasios y deporte",
    headline: "Reseñas Google para gimnasios",
    desc: "Aumenta tu visibilidad local y atrae más socios. Automatiza las peticiones de reseña tras cada clase o entrenamiento.",
    keywords: ["gimnasio", "crossfit", "yoga", "pilates"],
  },
];

const faqs = [
  {
    q: "¿Cómo conseguir más reseñas en Google Maps para un restaurante?",
    a: "Con ReseñasYa envías un WhatsApp automático a cada cliente tras su visita. Si la experiencia fue positiva, la IA le anima a dejar reseña en Google Maps con el enlace directo. Si fue negativa, responde con empatía sin dirigirle al perfil público.",
  },
  {
    q: "¿Funciona para peluquerías y centros de estética?",
    a: "Sí. ReseñasYa está diseñado para cualquier negocio local. Muchas peluquerías y centros de estética lo usan para pedir opinión al cliente justo cuando termina el servicio, aprovechando el momento de máxima satisfacción.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Solo necesitas una cuenta de Twilio (WhatsApp Business Sandbox gratuita para comenzar), el enlace de Google Maps de tu negocio y registrarte en ReseñasYa. La configuración completa lleva menos de 5 minutos.",
  },
  {
    q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
    a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informar al cliente durante la visita y contar con su número de teléfono proporcionado voluntariamente.",
  },
  {
    q: "¿Puedo personalizar los mensajes de WhatsApp?",
    a: "Sí. Puedes personalizar el mensaje inicial y elegir entre tres tonos: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido.",
  },
  {
    q: "¿Cómo funciona el análisis de sentimiento con IA?",
    a: "Cuando el cliente responde al WhatsApp, Claude AI analiza el texto al instante y lo clasifica como positivo, negativo o neutral. En función del resultado, el sistema envía un mensaje diferente: si es positivo, invita a dejar reseña; si es negativo, responde con empatía.",
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
              <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-brand-700">ReseñasYa</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden sm:block">
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
              <span aria-hidden="true">🚀</span> Automatiza tus reseñas de Google Maps
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Consigue más reseñas{" "}
              <span className="text-brand-600 whitespace-nowrap">Google Maps</span>
              <br />
              automáticamente por WhatsApp
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y
              consigue que los satisfechos dejen reseña en Google Maps — sin esfuerzo.
              Ideal para restaurantes, peluquerías y cualquier negocio local.
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

        {/* Social proof / trust bar */}
        <section className="py-8 px-6 bg-gray-50 border-y border-gray-100">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg" aria-hidden="true">✓</span> Funciona con WhatsApp Business
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg" aria-hidden="true">✓</span> IA de Claude (Anthropic)
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg" aria-hidden="true">✓</span> 100% RGPD compliant
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500 text-lg" aria-hidden="true">✓</span> Sin tarjeta de crédito
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
              <p className="text-gray-500 text-lg">4 pasos para conseguir más reseñas de Google Maps</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="text-4xl font-extrabold text-brand-200 mb-3">{step.number}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas</h2>
              <p className="text-gray-500 text-lg">Una plataforma completa para gestionar tu reputación online</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {features.map((feat) => (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all"
                >
                  <div className="text-3xl mb-4" aria-hidden="true">{feat.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Example conversation */}
        <section className="py-20 lg:py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                La conversación que consigue reseñas
              </h2>
              <p className="text-gray-500 text-lg">Completamente automática y personalizada para tu negocio</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
                  ✅ Cliente satisfecho → reseña en Google Maps
                </p>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-gray-100">
                      ¡Hola María! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia con nosotros hoy? Tu opinión nos ayuda a mejorar 😊
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm">
                      ¡Muy buena! El café estaba riquísimo y el personal súper amable 😍
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-gray-100">
                      ¡Qué alegría saber eso, María! 🙌 ¿Te animarías a dejar tu opinión en Google Maps? 👉 maps.google.com/...
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-red-500 mb-3 uppercase tracking-wide">
                  🛡️ Cliente insatisfecho → respuesta empática, sin enlace
                </p>
                <div className="bg-gray-50 rounded-2xl p-5 space-y-3 border border-gray-100">
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-gray-100">
                      ¡Hola Carlos! Soy el equipo de Cafetería El Sol. ¿Cómo fue tu experiencia hoy? 😊
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm">
                      La verdad no muy bien, tardaron mucho y el pedido llegó frío...
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-gray-100">
                      Gracias por tu honestidad, Carlos. Lamentamos que tu experiencia no haya sido la esperada 😔 Tu opinión es muy valiosa para mejorar. ¡Esperamos poder verte pronto! 🙏
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors — local SEO */}
        <section className="py-20 lg:py-24 px-6 bg-gray-50" id="sectores">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Para todo tipo de negocios locales
              </h2>
              <p className="text-gray-500 text-lg">
                Cualquier negocio que quiera más reseñas positivas en Google Maps puede usar ReseñasYa
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sectors.map((sector) => (
                <div
                  key={sector.name}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all"
                >
                  <div className="text-3xl mb-3" aria-hidden="true">{sector.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{sector.headline}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{sector.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sector.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ — long-tail SEO */}
        <section className="py-20 lg:py-24 px-6 bg-white" id="faq">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Preguntas frecuentes
              </h2>
              <p className="text-gray-500 text-lg">
                Todo lo que necesitas saber sobre cómo conseguir más reseñas de Google Maps
              </p>
            </div>
            <dl className="space-y-4">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                >
                  <dt className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">{faq.q}</dt>
                  <dd className="text-gray-600 text-sm leading-relaxed">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* CTA final */}
        <section className="py-20 lg:py-24 px-6 bg-gradient-to-br from-brand-600 to-brand-700">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-4">
              Empieza a conseguir reseñas hoy
            </h2>
            <p className="text-brand-100 text-lg mb-10 leading-relaxed">
              Únete a negocios locales que ya automatizan su reputación online con ReseñasYa.
              Gratis para empezar, sin tarjeta de crédito.
            </p>
            <Link
              href="/register"
              className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition inline-block shadow-lg"
            >
              Crear cuenta gratis →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-10 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="font-semibold text-gray-600">ReseñasYa</span>
              </div>
              <nav className="flex gap-6 text-xs">
                <a href="#sectores" className="hover:text-gray-700">Sectores</a>
                <a href="#faq" className="hover:text-gray-700">FAQ</a>
                <Link href="/login" className="hover:text-gray-700">Iniciar sesión</Link>
                <Link href="/register" className="hover:text-gray-700">Registro</Link>
              </nav>
              <p>© {new Date().getFullYear()} ReseñasYa. Todos los derechos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
