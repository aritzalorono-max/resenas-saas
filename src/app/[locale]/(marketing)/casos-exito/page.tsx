import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { TrendingUp, Utensils, Dumbbell, ShoppingBag, Stethoscope, Smartphone, Coffee } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Casos de éxito | ReseñasYa",
  description: "Descubre cómo restaurantes, clínicas, gimnasios y e-commerce han multiplicado sus reseñas en Google Maps, Trustpilot y App Store con ReseñasYa.",
  alternates: { canonical: "/casos-exito" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Casos de éxito | ReseñasYa",
    description: "Descubre cómo restaurantes, clínicas, gimnasios y e-commerce han multiplicado sus reseñas en Google Maps, Trustpilot y App Store con ReseñasYa.",
    url: "/casos-exito",
    type: "website",
  },
};

const cases = [
  {
    Icon: Utensils,
    sector: "Restauración",
    platform: "Google Maps",
    name: "Pizzería Napoli",
    location: "Sevilla",
    challenge: "Llevaban 2 años con solo 23 reseñas en Google Maps. La mayoría habían llegado en momentos de queja, lo que hacía que su media fuera de 3.8★ y que no apareciesen en las búsquedas locales.",
    solution: "Implementaron ReseñasYa para enviar un WhatsApp automático a cada cliente 30 minutos después de pagar. La IA filtraba las respuestas: los satisfechos recibían el enlace directo a Google Maps, los insatisfechos una respuesta empática para gestionar el problema en privado.",
    result: "En 2 meses pasaron de 23 a 97 reseñas, con una media de 4.7★. Aparecieron en el top 3 de restaurantes italianos en Sevilla y llenaron la lista de espera los fines de semana por primera vez en su historia.",
    quote: "Antes nadie dejaba reseñas aunque estuvieran contentos. Ahora nos llegan solos. Ha cambiado por completo cómo nos ven en Google.",
    quoteName: "Giuseppe M., propietario",
    stats: [
      { label: "Reseñas nuevas", value: "+74" },
      { label: "Media Google", value: "4.7★" },
      { label: "Tiempo", value: "2 meses" },
    ],
    color: "from-orange-50 to-amber-50",
    accent: "text-orange-600",
  },
  {
    Icon: Dumbbell,
    sector: "Fitness",
    platform: "Google Maps + Incentivo",
    name: "FitBody Gym",
    location: "Valencia",
    challenge: "Con 58 reseñas en 4 años y un NPS de 72, los socios estaban muy satisfechos pero nadie dejaba valoraciones. El equipo había probado pedir reseñas en persona, pero era incómodo y poco escalable.",
    solution: "Activaron el plan Pro con incentivos: cualquier socio que dejara una reseña de 5★ y enviara la captura de pantalla recibía un 10% de descuento en la siguiente cuota. La IA verificaba automáticamente las 5 estrellas en la captura y enviaba el código al instante.",
    result: "En solo 6 semanas consiguieron 134 reseñas nuevas con una media de 4.9★. El 62% de los socios que recibieron el WhatsApp con incentivo acabaron dejando la reseña y reclamando su descuento.",
    quote: "El sistema de incentivos fue una revelación. Los socios lo veían como un win-win: dejaban una reseña honesta y se llevaban un descuento real. Sin fricciones.",
    quoteName: "Laura P., directora",
    stats: [
      { label: "Reseñas nuevas", value: "+134" },
      { label: "Media Google", value: "4.9★" },
      { label: "Conversión incentivo", value: "62%" },
    ],
    color: "from-blue-50 to-indigo-50",
    accent: "text-blue-600",
  },
  {
    Icon: ShoppingBag,
    sector: "E-commerce",
    platform: "Trustpilot",
    name: "ModaTrend",
    location: "Barcelona",
    challenge: "Alta satisfacción de clientes (NPS 78) pero cero presencia en Trustpilot, donde sus potenciales compradores tomaban la decisión final de compra. Sus competidores tenían cientos de valoraciones y ellos solo 12.",
    solution: "Configuraron un WhatsApp automático 48 horas después de la entrega del pedido, cuando el cliente ya había tenido tiempo de probar el producto. El enlace apuntaba directamente a su perfil de Trustpilot.",
    result: "En 4 meses acumularon 289 valoraciones con 4.7★ en Trustpilot. La tasa de conversión de su tienda online subió un 22% al mostrar el widget de Trustpilot en las páginas de producto.",
    quote: "El impacto en conversión fue inmediato. Cuando los visitantes ven 289 reseñas reales de 4.7★, la decisión de compra se toma sola.",
    quoteName: "Marta S., directora de marketing",
    stats: [
      { label: "Reseñas Trustpilot", value: "289" },
      { label: "Media", value: "4.7★" },
      { label: "Conversión web", value: "+22%" },
    ],
    color: "from-green-50 to-emerald-50",
    accent: "text-green-600",
  },
  {
    Icon: Stethoscope,
    sector: "Salud",
    platform: "Google Maps",
    name: "Clínica Dental Ortiz",
    location: "Zaragoza",
    challenge: "Sector con alta sensibilidad: necesitaban captar opiniones positivas de forma natural, pero les preocupaba que los casos complicados o dolorosos acabaran en reseñas negativas públicas que dañaran su reputación.",
    solution: "El filtro de sentimiento de la IA fue la clave. Solo los pacientes con respuestas claramente positivas recibían el enlace a Google Maps. Los que expresaban incomodidad o queja recibían un mensaje empático de la clínica invitándoles a llamar para hablar directamente.",
    result: "62 reseñas nuevas en 4 meses, todas por encima de 4 estrellas. Ninguna respuesta negativa llegó a publicarse: todas se gestionaron en privado. La satisfacción percibida por los pacientes mejoró por la propia atención del seguimiento.",
    quote: "Lo que más valoramos no son las reseñas nuevas, sino que ninguna negativa ha llegado a publicarse. Gestionamos los casos delicados antes de que se conviertan en un problema.",
    quoteName: "Dr. Ortiz, propietario",
    stats: [
      { label: "Reseñas nuevas", value: "+62" },
      { label: "Reseñas negativas públicas", value: "0" },
      { label: "Satisfacción", value: "94%" },
    ],
    color: "from-purple-50 to-violet-50",
    accent: "text-purple-600",
  },
  {
    Icon: Smartphone,
    sector: "App móvil",
    platform: "App Store + Play Store",
    name: "RecetApp",
    location: "Madrid",
    challenge: "18.000 usuarios activos mensuales pero solo 312 valoraciones en total entre App Store y Play Store. El ratio bajo lastraba su posición en el ranking de la categoría y frenaba las descargas orgánicas.",
    solution: "Segmentaron sus usuarios por dispositivo: los de iOS recibían el WhatsApp con el enlace de App Store, los de Android con el de Play Store. El mensaje se enviaba a los usuarios que habían abierto la app al menos 5 veces en el último mes (usuarios activos comprometidos).",
    result: "En 3 meses consiguieron +520 valoraciones distribuidas entre ambas plataformas. Su posición en el ranking de la categoría Gastronomía pasó del top 40 al top 10, con un incremento del 35% en descargas orgánicas.",
    quote: "El truco de segmentar por dispositivo fue brillante. Cada usuario recibía exactamente el enlace que le correspondía. La tasa de respuesta fue del 28%, muy superior a cualquier pop-up in-app.",
    quoteName: "Álvaro R., founder",
    stats: [
      { label: "Valoraciones nuevas", value: "+520" },
      { label: "Plataformas", value: "2" },
      { label: "Posición ranking", value: "Top 10" },
    ],
    color: "from-rose-50 to-pink-50",
    accent: "text-rose-600",
  },
  {
    Icon: Coffee,
    sector: "Cafetería",
    platform: "Google Maps + Incentivo",
    name: "Bloom Coffee",
    location: "Zaragoza",
    challenge: "31 reseñas y 4.2★ mientras la competencia de enfrente tenía 180 reseñas y 4.8★. Siempre aparecían segundos en las búsquedas locales de Google Maps. Los clientes habituales los adoraban pero nunca lo ponían en Google.",
    solution: "Lanzaron el incentivo definitivo para una cafetería: deja una reseña de 5★, envía la captura y te invitamos a un café. La IA verificaba automáticamente las 5 estrellas y enviaba el mensaje de confirmación al instante, sin intervención humana.",
    result: "De 31 a 97 reseñas en 3 semanas y media de 4.8★. Superaron a la competencia y pasaron a aparecer primeros en búsquedas como 'cafetería Zaragoza centro'. El coste del incentivo (un café) se amortizó en los primeros días.",
    quote: "En 3 semanas teníamos más reseñas que la competencia que llevaba años. Y lo mejor: el café de cortesía nos costaba 30 céntimos y nos traía nuevos clientes que venían por el ranking de Google.",
    quoteName: "Ana C., propietaria",
    stats: [
      { label: "Reseñas nuevas", value: "+66" },
      { label: "Media Google", value: "4.8★" },
      { label: "Tiempo", value: "3 semanas" },
    ],
    color: "from-yellow-50 to-orange-50",
    accent: "text-yellow-700",
  },
];

export default async function CasosExitoPage() {
  const t = await getTranslations("casosExito");
  return (
    <>
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
              <p className="text-3xl font-extrabold text-brand-600">+750</p>
              <p className="text-sm text-gray-500 mt-1">{t("stat1")}</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-brand-600">6</p>
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
          <p className="text-brand-200 text-sm mt-4">Sin permanencia · Cancela cuando quieras</p>
        </div>
      </section>
    </>
  );
}
