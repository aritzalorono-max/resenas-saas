import Link from "next/link";

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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xl font-bold text-brand-700">ReseñasYa</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
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
      <section className="bg-gradient-to-br from-brand-50 via-white to-brand-50 py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span>🚀</span> Automatiza tus reseñas de Google Maps
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Más reseñas positivas,{" "}
            <span className="text-brand-600">menos trabajo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Envía WhatsApps automáticos a tus clientes, analiza su opinión con IA y
            consigue que los satisfechos dejen reseña en Google Maps — sin esfuerzo.
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
          <p className="text-sm text-gray-400 mt-4">Sin tarjeta de crédito • Configuración en 5 minutos</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Cómo funciona?</h2>
            <p className="text-gray-500 text-lg">4 pasos simples para conseguir más reseñas</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="text-4xl font-extrabold text-brand-200 mb-3">{step.number}</div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Todo lo que necesitas</h2>
            <p className="text-gray-500 text-lg">Una plataforma completa para gestionar tu reputación online</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-brand-200 transition hover:shadow-md"
              >
                <div className="text-3xl mb-4">{feat.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example conversation */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Así es la conversación con tu cliente
            </h2>
            <p className="text-gray-500">Completamente automática y personalizada</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Positive example */}
            <div>
              <p className="text-sm font-semibold text-green-600 mb-3 uppercase tracking-wide">
                ✅ Respuesta positiva
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

            {/* Negative example */}
            <div>
              <p className="text-sm font-semibold text-red-500 mb-3 uppercase tracking-wide">
                🛡️ Respuesta negativa
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

      {/* CTA */}
      <section className="py-24 px-6 bg-brand-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Empieza a conseguir reseñas hoy
          </h2>
          <p className="text-brand-100 text-lg mb-10">
            Únete a negocios que ya automatizan su reputación online con ReseñasYa
          </p>
          <Link
            href="/register"
            className="bg-white text-brand-700 font-bold px-8 py-4 rounded-xl text-lg hover:bg-brand-50 transition inline-block"
          >
            Crear cuenta gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>⭐</span>
            <span className="font-semibold text-gray-600">ReseñasYa</span>
          </div>
          <p>© {new Date().getFullYear()} ReseñasYa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
