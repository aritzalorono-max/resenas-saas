import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | ResenasYa",
  description:
    "Resuelve tus dudas sobre ResenasYa: cómo funciona, qué plataformas soporta, si es legal, cómo cancelar la suscripción y cómo personalizar los mensajes de WhatsApp.",
  alternates: { canonical: "/faq" },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    category: "Funcionamiento",
    items: [
      {
        q: "¿Cómo funciona exactamente?",
        a: "Introduces el nombre y teléfono de tu cliente en el panel. Le llega un WhatsApp personalizado preguntando por su experiencia. La IA analiza la respuesta al instante: si es positiva, le anima a dejar reseña con el enlace directo a la plataforma que elijas; si es negativa, responde con empatía sin enviarle al perfil público.",
      },
      {
        q: "¿Para qué plataformas funciona?",
        a: "Para cualquiera: Google Maps, App Store, Play Store, Trustpilot o cualquier otra URL de reseñas. Solo tienes que configurar el enlace de destino en tu perfil y ResenasYa lo envía automáticamente a los clientes satisfechos.",
      },
      {
        q: "¿Se puede usar para varias plataformas a la vez?",
        a: "Sí. Puedes configurar varias plataformas en tu perfil y elegir cuál está activa en cada momento. Algunos negocios envían a Google Maps de lunes a jueves y a Trustpilot el resto de la semana.",
      },
      {
        q: "¿Qué necesito para empezar?",
        a: "Solo registrarte en ResenasYa y añadir el enlace de tu perfil de reseñas (Google Maps, App Store, etc.). La configuración completa lleva menos de 1 minuto.",
      },
      {
        q: "¿Cuántas solicitudes puedo enviar al mes?",
        a: "Depende del plan: Starter (9,9€/mes) incluye 50 contactos, y Pro (29,9€/mes) incluye 250 contactos. Puedes cambiar de plan o cancelar en cualquier momento desde la sección de Facturación.",
      },
      {
        q: "¿Qué pasa si un cliente deja una valoración negativa?",
        a: "La IA detecta el sentimiento negativo y responde con un mensaje empático invitando al cliente a contar qué pasó, sin enviarle a ningún perfil público. Tú recibes el feedback en el panel para gestionarlo de forma interna antes de que se convierta en una reseña negativa.",
      },
      {
        q: "¿Puedo personalizar los mensajes de WhatsApp?",
        a: "Sí. Puedes personalizar el mensaje inicial con el nombre del cliente y el nombre de tu negocio, y elegir entre tres tonos de comunicación: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido.",
      },
      {
        q: "¿Funciona para abogados, psicólogos y otros sectores sensibles?",
        a: "Sí. Sectores con alta sensibilidad lo usan con el tono «usted» para mantener la formalidad. El filtro de sentimiento es especialmente valioso aquí: gestiona los casos delicados en privado, sin exposición pública.",
      },
    ],
  },
  {
    category: "Inteligencia artificial y mensajes",
    items: [
      {
        q: "¿Qué papel juega la IA en el servicio?",
        a: "La inteligencia artificial (Claude de Anthropic) hace dos cosas: analiza el sentimiento de la respuesta del cliente (positivo, negativo o neutro) y genera automáticamente el mensaje de seguimiento que se le envía. Todo el proceso es automático y no hay revisión humana antes del envío.",
      },
      {
        q: "¿ResenasYa es responsable de lo que dice la IA en los mensajes?",
        a: "No. Los mensajes generados por la IA no son revisados por ResenasYa antes de enviarse. Si bien la IA está entrenada para responder de forma adecuada, puede cometer errores o generar respuestas que no se ajusten exactamente a lo esperado. ResenasYa no asume responsabilidad por el contenido de los mensajes generados automáticamente. Si prefieres tener control total sobre los mensajes, puedes configurar plantillas personalizadas en la medida en que el plan contratado lo permita.",
      },
      {
        q: "¿La IA siempre clasifica bien el sentimiento de una respuesta?",
        a: "La IA acierta en la gran mayoría de los casos, pero no es infalible. Puede clasificar erróneamente una respuesta ambigua o irónica. En ese caso, podría enviarse un mensaje de seguimiento inadecuado para el contexto. ResenasYa no se hace responsable de estos errores de clasificación. Si detectas un error, puedes reportarlo desde el panel en el detalle de la solicitud.",
      },
      {
        q: "¿Qué pasa si un cliente me responde algo inapropiado u ofensivo?",
        a: "ResenasYa no tiene control sobre lo que los clientes responden. Si recibes una respuesta inapropiada, ofensiva o que consideres que constituye un ilícito, deberás gestionarla directamente con el cliente y, si procede, con las autoridades. La respuesta quedará registrada en tu panel para que puedas revisarla. ResenasYa no asume ninguna responsabilidad por el contenido de las respuestas de los clientes finales.",
      },
    ],
  },
  {
    category: "Reseñas y plataformas",
    items: [
      {
        q: "¿ResenasYa garantiza que los clientes dejen reseñas positivas?",
        a: "No. ResenasYa facilita el contacto con clientes satisfechos y les proporciona el enlace para dejar reseña, pero no puede garantizar ni el número de reseñas que se publicarán, ni su contenido, ni su puntuación. Los resultados dependen exclusivamente de la experiencia real del cliente con tu negocio.",
      },
      {
        q: "¿Es ResenasYa responsable de las reseñas que dejan los clientes?",
        a: "No. Una vez que el cliente accede a Google Maps, Trustpilot u otra plataforma, lo que escriba es responsabilidad suya. ResenasYa no tiene ningún control sobre el contenido de las reseñas publicadas. Si un cliente deja una reseña negativa, falsa o que consideras injusta, deberás gestionarlo directamente con la plataforma correspondiente (Google, Trustpilot, etc.).",
      },
      {
        q: "¿Qué pasa si Google Maps elimina mis reseñas o penaliza mi perfil?",
        a: "ResenasYa no tiene ningún control sobre las decisiones de Google Maps, Trustpilot u otras plataformas. Dichas plataformas pueden eliminar reseñas, modificar algoritmos o adoptar cualquier otra medida de forma unilateral. ResenasYa no asume responsabilidad por estas situaciones. Recomendamos revisar las políticas de cada plataforma antes de activar funcionalidades como la solicitud selectiva de reseñas o el sistema de incentivos.",
      },
      {
        q: "¿Cómo funcionan los incentivos y códigos de descuento?",
        a: "Disponible en el plan Pro. Puedes activar un incentivo: el cliente recibe un mensaje invitándole a dejar una reseña de 5★ y enviar la captura de pantalla. La IA verifica automáticamente que la reseña tiene 5 estrellas y le responde con el código de descuento o recompensa al instante, sin intervención humana. Ten en cuenta que el uso de incentivos puede estar sujeto a las políticas de algunas plataformas de reseñas; es tu responsabilidad verificarlo.",
      },
    ],
  },
  {
    category: "Suscripción y facturación",
    items: [
      {
        q: "¿La suscripción se cobra automáticamente cada mes?",
        a: "Sí. La suscripción es mensual y se renueva automáticamente. Cada mes, en la misma fecha en que te suscribiste, se cargará automáticamente el importe de tu plan al método de pago registrado (tarjeta de crédito/débito), sin que tengas que hacer nada. Recibirás una factura por correo electrónico tras cada cobro.",
      },
      {
        q: "¿Cómo cancelo mi suscripción?",
        a: "Puedes cancelar en cualquier momento desde tu panel: ve a Facturación → haz clic en «Gestionar suscripción» → en el portal de Stripe, selecciona «Cancelar plan» y confirma. La cancelación debe hacerse antes de que finalice tu período de facturación actual para evitar el cargo del siguiente mes. Tras cancelar, mantendrás el acceso hasta el final del período ya pagado. No se realizan reembolsos por períodos ya cobrados.",
      },
      {
        q: "¿Puedo cancelar a mitad de mes y que me devuelvan el dinero?",
        a: "No. La política de ResenasYa no contempla reembolsos por períodos de facturación ya cobrados. Si cancelas, mantendrás el acceso al servicio hasta el final del período pagado, pero no recibirás ningún reembolso proporcional por los días no utilizados.",
      },
      {
        q: "¿Qué ocurre si no cancelo antes del siguiente cobro?",
        a: "Si no cancelas antes de que finalice tu período de facturación, la suscripción se renovará automáticamente y se cargará el importe del siguiente mes. Una vez realizado el cargo, no se tramitarán reembolsos. Por eso es importante cancelar con suficiente antelación si no deseas continuar.",
      },
      {
        q: "¿Puedo cambiar de plan?",
        a: "Sí. Puedes cambiar de plan (superior o inferior) en cualquier momento desde la sección de Facturación de tu panel. Los cambios se aplicarán en el siguiente período de facturación.",
      },
      {
        q: "¿Subirán los precios?",
        a: "ResenasYa se reserva el derecho a modificar los precios con un preaviso mínimo de 30 días por correo electrónico. Si no estás de acuerdo con el nuevo precio, puedes cancelar tu suscripción antes de que entre en vigor el cambio.",
      },
    ],
  },
  {
    category: "Legal y privacidad",
    items: [
      {
        q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?",
        a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informarle durante la visita o en el proceso de compra, y contar con su número de teléfono facilitado voluntariamente. El envío cumple con el RGPD bajo base legitimadora de interés legítimo o consentimiento. El usuario (negocio) es el único responsable de obtener y documentar el consentimiento de sus clientes.",
      },
      {
        q: "¿Los datos de mis clientes están seguros?",
        a: "Sí. Los datos se almacenan en Supabase con cifrado en tránsito (HTTPS/TLS) y Row Level Security activo: cada negocio solo accede a sus propios datos. Los datos de pago son gestionados íntegramente por Stripe y nunca se almacenan en nuestros servidores.",
      },
      {
        q: "¿Qué pasa con mis datos si cancelo la cuenta?",
        a: "Tras la cancelación de la cuenta, los datos se conservarán durante el período de retención establecido en nuestra Política de Privacidad, tras el cual serán eliminados permanentemente. Puedes solicitar la eliminación anticipada de tus datos contactando con nosotros en contacto.resenasya@gmail.com.",
      },
    ],
  },
];

const allFaqs = faqs.flatMap((cat) => cat.items);

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: allFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Preguntas frecuentes</h1>
        <p className="text-gray-500 text-lg">
          Todo lo que necesitas saber antes de empezar con ResenasYa.
        </p>
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
