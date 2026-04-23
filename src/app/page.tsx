import Link from "next/link";
import type { Metadata } from "next";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";
import { ConversationTabs } from "@/components/landing/ConversationTabs";
import { PricingPlans } from "@/components/landing/PricingPlans";
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
  Quote,
  TrendingUp,
  Brain,
  Scale,
  Briefcase,
  Smartphone,
  Coffee,
  GraduationCap,
  ChevronDown,
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
    title: "Google, App Store y Play Store",
    desc: "Si el cliente está satisfecho, la IA le anima a dejar reseña con el enlace directo a la plataforma que elijas.",
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


const faqs = [
  {
    q: "¿Cómo funciona exactamente?",
    a: "Introduces el nombre y teléfono de tu cliente en el panel. Le llega un WhatsApp personalizado preguntando por su experiencia. Claude AI analiza la respuesta al instante: si es positiva, le anima a dejar reseña con el enlace directo; si es negativa, responde con empatía sin enviarle al perfil público.",
  },
  {
    q: "¿Funciona para Google Maps, App Store y Play Store?",
    a: "Sí. Solo tienes que configurar el enlace de destino en tu perfil: puede ser tu ficha de Google Maps, tu app en la App Store o en Play Store, o cualquier otra plataforma como Trustpilot. ReseñasYa envía ese enlace a los clientes satisfechos.",
  },
  {
    q: "¿Funciona para abogados, gestorías y psicólogos?",
    a: "Sí. Sectores sensibles como despachos de abogados, gestorías o psicólogos lo usan con el tono «usted» para mantener la formalidad. El filtro de sentimiento es especialmente valioso aquí: gestiona los casos delicados en privado, sin exposición pública.",
  },
  {
    q: "¿Qué necesito para empezar?",
    a: "Una cuenta de Twilio (WhatsApp Business Sandbox gratuita para empezar), el enlace de Google Maps, App Store o Play Store de tu negocio, y registrarte en ReseñasYa. La configuración completa lleva menos de 5 minutos.",
  },
  {
    q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
    a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informarle durante la visita o en el proceso de compra, y contar con su número facilitado voluntariamente.",
  },
  {
    q: "¿Puedo personalizar los mensajes?",
    a: "Sí. Puedes personalizar el mensaje inicial y elegir entre tres tonos: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido.",
  },
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
    quote: "Tenía miedo de parecer invasivo, pero el tono es tan natural que los clientes responden encantados. Hemos multiplicado por 3 las reseñas mensuales.",
    name: "Laura Sánchez",
    role: "Directora",
    business: "Clínica Dental Sánchez · Valencia",
    metric: "×3 reseñas al mes",
  },
  {
    quote: "Lo implantamos para nuestros usuarios más activos y en 5 semanas subimos de 3.8 a 4.6 estrellas en App Store. Los ratings son esenciales para el ASO y esto lo cambia todo.",
    name: "Javier Moreno",
    role: "CEO",
    business: "FinTrack App · Barcelona",
    metric: "3.8→4.6★ App Store",
  },
  {
    quote: "Como psicóloga, necesitaba algo discreto. El tono que usa la IA es tan cálido que los pacientes responden con naturalidad. Ya tengo 38 reseñas nuevas sin pedirlas a mano.",
    name: "Elena Domínguez",
    role: "Psicóloga",
    business: "Centro Psicología Domínguez · Bilbao",
    metric: "+38 reseñas en 2 meses",
  },
  {
    quote: "El filtro de sentimiento es lo que más me gusta. Si un huésped no está satisfecho, gestionamos el problema internamente. Las malas reseñas han caído un 80%.",
    name: "Miguel Fernández",
    role: "Director",
    business: "Hotel Boutique Costa · Málaga",
    metric: "−80% reseñas negativas",
  },
  {
    quote: "Somos una gestoría y nuestros clientes no suelen dejar reseñas espontáneamente. Con ReseñasYa conseguimos 51 reseñas en 3 meses. Ahora somos los más valorados de la zona.",
    name: "Ramón Vidal",
    role: "Socio Director",
    business: "Gestoría Vidal & Asociados · Valencia",
    metric: "51 reseñas en 3 meses",
  },
  {
    quote: "Nuestros clientes compran online y nunca coincidimos en persona. El WhatsApp post-envío funciona genial: 72% de respuesta y casi todos positivos. Las reseñas en Google se dispararon.",
    name: "Sofía Reyes",
    role: "Fundadora",
    business: "Tienda Naturalia · Murcia",
    metric: "72% tasa de respuesta",
  },
  {
    quote: "Llevaba años con la misma puntuación en Google. En 6 semanas subí de 3.9 a 4.6 estrellas. Ahora aparezco en los primeros resultados cuando buscan barbería en mi zona.",
    name: "Roberto Iglesias",
    role: "Propietario",
    business: "Barbería El Fígaro · Sevilla",
    metric: "3.9→4.6★ en 6 semanas",
  },
  {
    quote: "Como despacho de abogados, la reputación digital es fundamental para captar nuevos clientes. Ahora tenemos más de 90 reseñas en Google y el 96% son de 5 estrellas.",
    name: "Patricia Olmedo",
    role: "Socia fundadora",
    business: "Olmedo & Asociados Abogados · Sevilla",
    metric: "96% reseñas de 5★",
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
  {
    Icon: Smartphone,
    sector: "App móvil",
    name: "MiRutaApp · Madrid",
    before: "App de rutas de senderismo con 4.000 usuarios activos y solo 87 valoraciones en Play Store — insuficientes para aparecer en búsquedas.",
    after: "En 6 semanas enviaron WhatsApps a su base de usuarios activos. Consiguieron 340 valoraciones nuevas en Play Store y subieron a 4.7★.",
    stats: [
      { label: "Valoraciones nuevas", value: "+340" },
      { label: "Media Play Store", value: "4.7 ★" },
      { label: "Tasa de conversión", value: "23%" },
    ],
  },
  {
    Icon: ShoppingBag,
    sector: "E-commerce",
    name: "NaturalBox · Barcelona",
    before: "Tienda online de productos ecológicos con buen NPS interno pero muy pocas reseñas públicas. Sin social proof, la tasa de conversión era baja.",
    after: "Enviaron WhatsApps al día siguiente de cada entrega. En 3 meses acumularon 198 reseñas verificadas en Google y la conversión subió un 18%.",
    stats: [
      { label: "Reseñas en Google", value: "198" },
      { label: "Conversión web", value: "+18%" },
      { label: "Media de valoración", value: "4.8 ★" },
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
              Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y
              consigue que los satisfechos dejen reseña donde más te importa — sin esfuerzo.
              Para negocios locales, apps móviles y e-commerce.
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
        <section className="py-12 lg:py-24 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Todo lo que necesitas</h2>
              <p className="text-gray-500 text-lg">Una plataforma completa para gestionar tu reputación online</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {features.map(({ Icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-brand-200 transition-all"
                >
                  <div className="w-9 h-9 bg-brand-50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-4 h-4 text-brand-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">{title}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
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

        {/* E-commerce inbound screenshot flow */}
        <section className="py-12 lg:py-24 px-6 bg-gray-50" id="ecommerce">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide mb-4">
                <ShoppingBag className="w-3.5 h-3.5" />
                Para tiendas online
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                El cliente escribe primero.<br className="hidden sm:block" /> Tú solo verificas y recompensas.
              </h2>
              <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                Ideal para e-commerce: indica en tu tienda o en el email de confirmación de pedido
                que enviando la captura de una reseña de 5★ recibirán un código de descuento al instante.
                Sin llamadas, sin esperar, sin fricción.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-start">

              {/* Left — how to set it up */}
              <div className="space-y-6">

                {/* Sticker mockup — hidden on mobile */}
                <div className="hidden sm:block bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-6 shadow-sm">
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">
                    Lo que muestra tu tienda / embalaje
                  </p>
                  <div className="bg-indigo-600 rounded-xl p-5 text-white text-center">
                    <p className="text-2xl mb-1">⭐⭐⭐⭐⭐</p>
                    <p className="font-bold text-lg leading-snug mb-1">
                      ¿Te gustó tu compra?
                    </p>
                    <p className="text-indigo-200 text-sm mb-4">
                      Deja una reseña de 5★ en Google y envía la captura
                      de pantalla a nuestro WhatsApp. Te enviamos al momento un
                      código de <strong className="text-white">25% de descuento</strong> para tu próxima compra.
                    </p>
                    <div className="bg-white/15 rounded-lg px-4 py-2.5 inline-flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white shrink-0" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.532 5.85L0 24l6.302-1.515A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.844 0-3.576-.476-5.083-1.311L3 21.657l.99-3.819A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                      </svg>
                      <span className="font-bold text-sm tracking-wide">+34 612 345 678</span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "El cliente ve la oferta",
                      desc: "En tu tienda online, en el email de confirmación, en el packaging o en una tarjeta dentro del pedido.",
                      color: "bg-indigo-100 text-indigo-700",
                    },
                    {
                      step: "2",
                      title: "Deja la reseña y envía la captura",
                      desc: "El cliente publica su reseña de 5★ en Google y manda la captura directamente a tu WhatsApp de empresa.",
                      color: "bg-indigo-100 text-indigo-700",
                    },
                    {
                      step: "3",
                      title: "La IA verifica y responde al instante",
                      desc: "ReseñasYa analiza la imagen, confirma las 5 estrellas y envía el código de descuento automáticamente. Sin intervención humana.",
                      color: "bg-green-100 text-green-700",
                    },
                  ].map(({ step, title, desc, color }) => (
                    <div key={step} className="flex gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${color}`}>
                        {step}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{title}</p>
                        <p className="text-gray-500 text-sm leading-relaxed mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — WhatsApp conversation */}
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">
                  <Star className="w-4 h-4 shrink-0 fill-indigo-400 text-indigo-400" />
                  Lo que ve el cliente en WhatsApp
                </p>
                <div className="bg-[#e5ddd5] rounded-2xl p-5 space-y-3 shadow-inner">

                  {/* Customer sends screenshot */}
                  <div className="flex justify-end">
                    <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-none px-4 py-3 max-w-[260px] text-sm shadow-sm">
                      <div className="bg-white/60 rounded-xl p-3 flex items-center gap-3 mb-1.5">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-lg shrink-0">📸</div>
                        <div>
                          <p className="font-semibold text-xs text-gray-700">captura-reseña.jpg</p>
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-3 h-3 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">12:43 ✓✓</p>
                    </div>
                  </div>

                  {/* AI thinking indicator */}
                  <div className="flex justify-start items-center gap-2 px-2">
                    <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-xs text-gray-500 italic">IA verificando la reseña…</p>
                  </div>

                  {/* Bot response — verified */}
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 max-w-[280px] text-sm shadow-sm">
                      <p className="font-semibold text-green-600 mb-1">✅ ¡Reseña de 5★ confirmada!</p>
                      <p className="text-gray-700 leading-snug">
                        Muchas gracias por tu opinión en Google. Como prometimos, aquí tienes tu regalo:
                      </p>
                      <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-xl px-3 py-2.5 text-center">
                        <p className="text-xs text-indigo-500 font-medium uppercase tracking-wide">Código de descuento</p>
                        <p className="text-xl font-extrabold font-mono text-indigo-700 tracking-widest mt-0.5">GRACIAS25</p>
                        <p className="text-xs text-indigo-500 mt-0.5">25% dto. · Válido 30 días</p>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 text-right">12:43 ✓✓</p>
                    </div>
                  </div>

                  {/* Customer reaction */}
                  <div className="flex justify-end">
                    <div className="bg-[#dcf8c6] rounded-2xl rounded-tr-none px-4 py-3 max-w-xs text-sm shadow-sm">
                      ¡Wow, qué rápido! 😍 Muchas gracias 🙌
                      <p className="text-xs text-gray-500 mt-1 text-right">12:44 ✓✓</p>
                    </div>
                  </div>
                </div>

                {/* Caption */}
                <p className="text-xs text-gray-400 text-center mt-3">
                  Tiempo desde que el cliente envía la captura hasta recibir el código: <strong className="text-gray-600">&lt; 5 segundos</strong>
                </p>
              </div>
            </div>

            {/* Bottom CTA strip */}
            <div className="mt-14 bg-indigo-600 rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-white text-lg">¿Tienes una tienda online?</p>
                <p className="text-indigo-200 text-sm mt-0.5">
                  Conecta tu WhatsApp Business y empieza a conseguir reseñas con incentivos automáticos hoy.
                </p>
              </div>
              <Link
                href="/register"
                className="shrink-0 bg-white hover:bg-indigo-50 text-indigo-700 font-bold px-6 py-3 rounded-xl transition text-sm whitespace-nowrap"
              >
                Probar gratis →
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 lg:py-24 px-6 bg-white" id="opiniones">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 lg:mb-14">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Negocios que ya lo están usando
              </h2>
              <p className="text-gray-500 text-lg">Lo que dicen quienes llevan semanas generando reseñas con ReseñasYa</p>
            </div>
            {/* Mobile: snap-scroll carousel · Desktop: grid */}
            <div className="
              flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-5
              sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0
            ">
              {testimonials.map(({ quote, name, role, business, metric }) => (
                <div
                  key={name}
                  className="shrink-0 w-[80vw] snap-center sm:w-auto
                             bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 transition-all flex flex-col"
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

            {/* Mobile: snap-scroll carousel · Desktop: stacked */}
            <div className="
              flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              lg:flex-col lg:gap-6 lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0
            ">
              {caseStudies.map(({ Icon, sector, name, before, after, stats }, idx) => (
                <div
                  key={name}
                  className="shrink-0 w-[88vw] snap-center lg:w-auto
                             bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-200 transition-all"
                >
                  <div className="grid lg:grid-cols-[1fr_auto] gap-0">
                    <div className="p-5 lg:p-8">
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
                    <div className="border-t lg:border-t-0 lg:border-l border-gray-100 px-5 py-4 lg:p-8 flex lg:flex-col justify-around lg:justify-center gap-4 lg:gap-6 lg:min-w-[220px]">
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
            {/* Mobile: snap-scroll carousel · sm+: grid */}
            <div className="
              flex overflow-x-auto snap-x snap-mandatory gap-3 pb-3 -mx-6 px-6
              [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
              sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 lg:gap-5
              sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0
            ">
              {sectors.map(({ Icon, name, headline, desc, keywords }) => (
                <div
                  key={name}
                  className="shrink-0 w-[44vw] snap-center sm:w-auto
                             bg-white rounded-2xl p-4 sm:p-6 border border-gray-100 hover:border-brand-200 transition-all"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-2 sm:mb-3">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 text-xs sm:text-base leading-snug">{headline}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 hidden sm:block">{desc}</p>
                  <div className="hidden sm:flex flex-wrap gap-1.5">
                    {keywords.map((kw) => (
                      <span key={kw} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 lg:py-20 px-6 bg-white" id="faq">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Preguntas frecuentes
              </h2>
              <p className="text-gray-500 text-lg">
                Todo lo que necesitas saber antes de empezar
              </p>
            </div>
            <dl className="space-y-3">
              {faqs.map((faq) => (
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
                  Automatiza tus reseñas en Google Maps, App Store, Play Store y Trustpilot mediante WhatsApp e inteligencia artificial.
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
