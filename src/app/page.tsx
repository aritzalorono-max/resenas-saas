import Link from "next/link";
import type { Metadata } from "next";
import {
  MessageSquare,
  Sparkles,
  Star,
  Shield,
  BarChart2,
  Zap,
  Utensils,
  Scissors,
  Stethoscope,
  BedDouble,
  ShoppingBag,
  Dumbbell,
  Check,
  CheckCircle2,
  Quote,
  TrendingUp,
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
    Icon: MessageSquare,
    title: "WhatsApp automático",
    desc: "En segundos, tu cliente recibe un mensaje personalizado en WhatsApp pidiendo su opinión.",
  },
  {
    Icon: Sparkles,
    title: "IA que analiza opiniones",
    desc: "Claude AI evalúa si la respuesta es positiva, negativa o neutral de forma precisa.",
  },
  {
    Icon: Star,
    title: "Más reseñas en Google",
    desc: "Si el cliente está satisfecho, la IA le anima a dejar reseña con el enlace directo.",
  },
  {
    Icon: Shield,
    title: "Protege tu reputación",
    desc: "Si la experiencia fue mala, respondemos con empatía sin enviarle al perfil público.",
  },
  {
    Icon: BarChart2,
    title: "Panel en tiempo real",
    desc: "Ve todas las solicitudes, respuestas y métricas de satisfacción en un solo lugar.",
  },
  {
    Icon: Zap,
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
    Icon: Utensils,
    name: "Restaurantes y bares",
    headline: "Más reseñas Google Maps para restaurantes",
    desc: "Convierte cada visita en una reseña. Envía el WhatsApp justo cuando el cliente pide la cuenta — el momento de mayor satisfacción.",
    keywords: ["restaurante", "bar", "cafetería", "comida"],
  },
  {
    Icon: Scissors,
    name: "Peluquerías y estética",
    headline: "Reseñas Google para peluquerías",
    desc: "El cliente sale con un look espectacular. Aprovecha ese momento para pedirle que comparta su experiencia en Google Maps.",
    keywords: ["peluquería", "barbería", "uñas", "estética"],
  },
  {
    Icon: Stethoscope,
    name: "Clínicas dentales",
    headline: "Reseñas Google Maps para clínicas",
    desc: "Construye una reputación online sólida. Cada paciente satisfecho puede convertirse en una reseña positiva que atrae a nuevos pacientes.",
    keywords: ["dentista", "clínica dental", "ortodoncia"],
  },
  {
    Icon: BedDouble,
    name: "Hoteles y alojamientos",
    headline: "Automatiza reseñas para hoteles",
    desc: "Contacta con el huésped justo al salir del check-out. Maximiza las reseñas positivas y gestiona las negativas antes de que lleguen a Google.",
    keywords: ["hotel", "hostal", "apartamento turístico"],
  },
  {
    Icon: ShoppingBag,
    name: "Tiendas y comercio",
    headline: "Google Maps reviews para tiendas",
    desc: "Cada compra es una oportunidad. Fideliza al cliente y consigue que recomiende tu tienda a otros con solo un WhatsApp.",
    keywords: ["tienda", "comercio", "retail"],
  },
  {
    Icon: Dumbbell,
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

const trustItems = [
  "Funciona con WhatsApp Business",
  "IA de Claude (Anthropic)",
  "100% RGPD compliant",
  "Sin tarjeta de crédito",
];

const testimonials = [
  {
    quote: "En solo 3 semanas pasamos de 47 a 89 reseñas en Google Maps. Lo mejor es que nos avisa si un cliente no está satisfecho antes de que lo publique.",
    name: "Ana Martínez",
    role: "Propietaria",
    business: "La Taberna del Sol · Madrid",
    metric: "+42 reseñas en 3 semanas",
  },
  {
    quote: "Lo puse a funcionar en una tarde. Mis clientes responden al WhatsApp y los que están contentos van directos a Google. Ha sido un antes y un después.",
    name: "Carlos Ruiz",
    role: "Gerente",
    business: "Barbería Styles · Barcelona",
    metric: "4.8★ media en Google",
  },
  {
    quote: "Tenía miedo de parecer invasivo, pero el tono es tan natural que los clientes responden encantados. Hemos multiplicado por 3 las reseñas mensuales.",
    name: "Laura Sánchez",
    role: "Directora",
    business: "Clínica Dental Sánchez · Valencia",
    metric: "×3 reseñas al mes",
  },
  {
    quote: "El filtro de sentimiento es lo que más me gusta. Si un huésped no está satisfecho, gestionamos el problema internamente. Las malas reseñas han caído un 80%.",
    name: "Miguel Fernández",
    role: "Director",
    business: "Hotel Boutique Costa · Málaga",
    metric: "−80% reseñas negativas",
  },
  {
    quote: "Llevaba años con la misma puntuación en Google. En 6 semanas subí de 3.9 a 4.6 estrellas. Ahora aparezco en los primeros resultados cuando buscan barbería en mi zona.",
    name: "Roberto Iglesias",
    role: "Propietario",
    business: "Barbería El Fígaro · Sevilla",
    metric: "3.9→4.6★ en 6 semanas",
  },
  {
    quote: "Mis clientes son mayores y me preguntaba si responderían al WhatsApp. La sorpresa fue que el 70% contesta. Y casi todos están muy contentos, así que las reseñas se disparan.",
    name: "Carmen López",
    role: "Gerente",
    business: "Farmacia López · Zaragoza",
    metric: "70% tasa de respuesta",
  },
];

const caseStudies = [
  {
    Icon: Utensils,
    sector: "Restauración",
    name: "Pizzería Napoli · Sevilla",
    before: "23 reseñas en 2 años de actividad. Los propietarios no tenían tiempo de pedirlas manualmente.",
    after: "En 2 meses llegaron a 97 reseñas con una media de 4.7★ y llenaron la lista de espera los fines de semana.",
    stats: [
      { label: "Reseñas nuevas", value: "+74" },
      { label: "Media Google", value: "4.7 ★" },
      { label: "Tiempo para lograrlo", value: "2 meses" },
    ],
  },
  {
    Icon: Scissors,
    sector: "Belleza",
    name: "Studio Hair · Bilbao",
    before: "Competían con peluquerías con más de 200 reseñas. Su perfil de Google Maps tenía solo 31.",
    after: "Superaron las 160 reseñas en 3 meses y aparecen en el top 3 local cuando alguien busca peluquería.",
    stats: [
      { label: "Reseñas totales", value: "160+" },
      { label: "Posición local", value: "Top 3" },
      { label: "Tasa de respuesta", value: "68%" },
    ],
  },
  {
    Icon: Stethoscope,
    sector: "Salud",
    name: "Clínica Dental Ortiz · Zaragoza",
    before: "Sector sensible donde las malas reseñas tienen un gran impacto. Necesitaban captar las positivas sin arriesgar las negativas.",
    after: "En 4 meses consiguieron 62 reseñas nuevas. Las opiniones negativas se gestionaron de forma privada, sin llegar a publicarse.",
    stats: [
      { label: "Reseñas nuevas", value: "+62" },
      { label: "Reseñas negativas públicas", value: "0" },
      { label: "Tasa de satisfacción", value: "94%" },
    ],
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
              Automatiza tus reseñas de Google Maps
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
            {trustItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-brand-600 shrink-0" strokeWidth={2.5} />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 lg:py-24 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
              <p className="text-gray-500 text-lg">4 pasos para conseguir más reseñas de Google Maps</p>
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

        {/* Features */}
        <section className="py-20 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas</h2>
              <p className="text-gray-500 text-lg">Una plataforma completa para gestionar tu reputación online</p>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {features.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all"
                >
                  <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
                <p className="flex items-center gap-2 text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={2} />
                  Cliente satisfecho → reseña en Google Maps
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
                <p className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-3 uppercase tracking-wide">
                  <Shield className="w-4 h-4 shrink-0" strokeWidth={2} />
                  Cliente insatisfecho → respuesta empática, sin enlace
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

            {/* Incentive flow */}
            <div className="mt-8">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 mb-3 uppercase tracking-wide">
                <Star className="w-4 h-4 shrink-0 fill-amber-400 text-amber-400" strokeWidth={2} />
                Incentivo activo → reseña 5★ verificada y recompensa enviada
              </p>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <div className="space-y-3 max-w-sm mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-x-10 md:space-y-0">
                  {/* Columna izquierda */}
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-amber-100">
                        ¡Hola Sara! Soy el equipo de Barbería Styles. ¿Cómo fue tu visita hoy? 😊
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm">
                        ¡Genial! Muy contenta con el corte, quedó perfecto 🥰
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-amber-100">
                        ¡Nos alegra mucho, Sara! 🌟 Si dejas una reseña de 5★ en Google Maps y nos envías una captura de pantalla al WhatsApp, te regalamos un <strong>20% de descuento</strong> en tu próxima visita. 👉 maps.google.com/...
                      </div>
                    </div>
                  </div>
                  {/* Columna derecha */}
                  <div className="space-y-3 pt-3 border-t border-amber-200 md:pt-0 md:border-t-0">
                    <div className="flex justify-end">
                      <div className="bg-brand-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm flex items-center gap-2">
                        <span className="text-lg">📸</span>
                        <span>¡Aquí la captura!</span>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-xs text-sm shadow-sm border border-amber-100">
                        ✅ <strong>¡Captura verificada!</strong> Tu 20% de descuento está reservado. Muéstranos este mensaje en tu próxima visita. ¡Hasta pronto, Sara! 🎉
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-amber-600 font-medium mt-4 text-center">
                  La IA verifica automáticamente que la reseña sea de 5★ antes de enviar la recompensa
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 lg:py-24 px-6 bg-gray-50" id="opiniones">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Negocios que ya lo están usando
              </h2>
              <p className="text-gray-500 text-lg">Lo que dicen quienes llevan semanas generando reseñas con ReseñasYa</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map(({ quote, name, role, business, metric }) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all flex flex-col"
                >
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <Quote size={18} className="text-brand-200 mb-2 shrink-0" strokeWidth={1.5} />
                  <p className="text-gray-700 text-sm leading-relaxed flex-1 mb-5">
                    {quote}
                  </p>
                  {/* Metric pill */}
                  <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 w-fit">
                    <TrendingUp size={12} strokeWidth={2.5} />
                    {metric}
                  </div>
                  {/* Author */}
                  <div className="border-t border-gray-100 pt-4">
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{role} · {business}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case studies */}
        <section className="py-20 lg:py-24 px-6 bg-white" id="casos-exito">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
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

            <div className="space-y-6">
              {caseStudies.map(({ Icon, sector, name, before, after, stats }, idx) => (
                <div
                  key={name}
                  className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-200 transition-all"
                >
                  <div className="grid lg:grid-cols-[1fr_auto] gap-0">
                    <div className="p-7 lg:p-8">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0">
                          <Icon size={18} className="text-gray-600" strokeWidth={1.75} />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">{sector}</span>
                          <p className="text-sm font-bold text-gray-900">{name}</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        {/* Before */}
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">La situación</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{before}</p>
                        </div>
                        {/* After */}
                        <div>
                          <p className="text-xs font-bold text-brand-600 uppercase tracking-wide mb-2">El resultado</p>
                          <p className="text-sm text-gray-700 leading-relaxed font-medium">{after}</p>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="bg-white border-t lg:border-t-0 lg:border-l border-gray-100 p-6 lg:p-8 flex lg:flex-col justify-around lg:justify-center gap-4 lg:gap-6 lg:min-w-[220px]">
                      {stats.map(({ label, value }) => (
                        <div key={label} className="text-center lg:text-left">
                          <p className="text-2xl lg:text-3xl font-extrabold text-gray-900">{value}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/register"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-7 py-3.5 rounded-xl text-base transition shadow-lg shadow-brand-200 inline-block"
              >
                Empieza gratis y escribe tu caso de éxito →
              </Link>
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
              {sectors.map(({ Icon, name, headline, desc, keywords }) => (
                <div
                  key={name}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 hover:shadow-card-hover transition-all"
                >
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gray-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{headline}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3">{desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((kw) => (
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
                  Automatiza la captación de reseñas de Google Maps mediante WhatsApp e inteligencia artificial.
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
                    <li><a href="#sectores" className="text-sm text-gray-500 hover:text-gray-800 transition">Sectores</a></li>
                    <li><a href="#faq" className="text-sm text-gray-500 hover:text-gray-800 transition">Preguntas frecuentes</a></li>
                    <li><Link href="/register" className="text-sm text-gray-500 hover:text-gray-800 transition">Crear cuenta</Link></li>
                    <li><Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 transition">Iniciar sesión</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Soporte</p>
                  <ul className="space-y-2">
                    <li><Link href="/contacto" className="text-sm text-gray-500 hover:text-gray-800 transition">Contacto</Link></li>
                    <li>
                      <a href="mailto:hola@resenasya.com" className="text-sm text-gray-500 hover:text-gray-800 transition">
                        hola@resenasya.com
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
              <div className="flex gap-4 text-xs text-gray-400">
                <Link href="/privacidad" className="hover:text-gray-600 transition">Privacidad</Link>
                <Link href="/terminos" className="hover:text-gray-600 transition">Términos</Link>
                <Link href="/cookies" className="hover:text-gray-600 transition">Cookies</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
