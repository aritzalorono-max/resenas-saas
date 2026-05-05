import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Condiciones generales de uso del servicio ReseñasYa.",
  alternates: { canonical: "/terminos" },
  robots: { index: false },
};

const LAST_UPDATED = "5 de mayo de 2026";
const COMPANY      = "ReseñasYa S.L.";
const EMAIL        = "legal@resenasya.com";
const APP_URL      = "https://resenasya.com";

export default function TerminosPage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-p:text-gray-600 prose-p:leading-relaxed prose-li:text-gray-600">
      <header className="not-prose mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Documento legal</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Términos y Condiciones de Uso</h1>
        <p className="text-sm text-gray-400">Última actualización: {LAST_UPDATED}</p>
      </header>

      <Section title="1. Información general">
        <p>
          El presente documento establece los Términos y Condiciones de uso (en adelante, "las Condiciones") que
          regulan el acceso y la utilización del servicio <strong>ReseñasYa</strong>, disponible en{" "}
          <a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (en adelante, "la Plataforma"),
          titularidad de <strong>{COMPANY}</strong>, empresa debidamente constituida conforme a la legislación española,
          con domicilio social en España y correo electrónico de contacto:{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
        </p>
        <p>
          Al registrarte y utilizar la Plataforma, aceptas íntegramente estas Condiciones. Si no estás de acuerdo con
          alguno de sus términos, deberás abstenerte de usar el servicio.
        </p>
      </Section>

      <Section title="2. Descripción del servicio">
        <p>
          ReseñasYa es una plataforma SaaS (Software as a Service) que permite a negocios locales automatizar la
          captación de reseñas en Google Maps mediante el envío de mensajes de WhatsApp a sus clientes. El servicio
          incluye:
        </p>
        <ul>
          <li>Envío de mensajes de WhatsApp personalizados a clientes a través de la API de Twilio.</li>
          <li>Análisis automático del sentimiento de las respuestas de los clientes mediante inteligencia artificial (Claude AI de Anthropic).</li>
          <li>Redireccionamiento de clientes satisfechos al perfil de Google Maps del negocio para facilitar la publicación de reseñas.</li>
          <li>Panel de gestión con estadísticas y métricas de satisfacción de clientes.</li>
          <li>Personalización del tono y los mensajes de comunicación con clientes.</li>
        </ul>
      </Section>

      <Section title="3. Condiciones de acceso y registro">
        <p>
          Para utilizar la Plataforma es necesario completar el proceso de registro proporcionando una dirección de
          correo electrónico válida y una contraseña. Al registrarte, garantizas que:
        </p>
        <ul>
          <li>Eres mayor de 18 años o cuentas con la capacidad legal suficiente para contratar.</li>
          <li>Actúas en nombre propio o tienes autorización expresa para representar a la empresa u organización que registras.</li>
          <li>Los datos facilitados son verídicos, exactos y completos.</li>
          <li>Mantendrás actualizada la información de tu cuenta.</li>
        </ul>
        <p>
          Eres responsable de mantener la confidencialidad de tus credenciales de acceso. Deberás notificarnos
          inmediatamente ante cualquier uso no autorizado de tu cuenta a través de{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
        </p>
      </Section>

      <Section title="4. Uso aceptable del servicio">
        <p>
          El usuario se compromete a utilizar la Plataforma de conformidad con la ley, la moral, el orden público,
          estas Condiciones y las políticas de uso de los servicios de terceros integrados (Twilio, Anthropic, Supabase,
          Google Maps).
        </p>
        <p>Queda expresamente prohibido:</p>
        <ul>
          <li>Enviar mensajes de WhatsApp a personas que no hayan dado su consentimiento para recibir comunicaciones comerciales del negocio, conforme al RGPD y la LSSICE.</li>
          <li>Utilizar la Plataforma para enviar spam, mensajes fraudulentos, engañosos o con contenido ilícito.</li>
          <li>Usar el servicio para actividades que infrinjan derechos de terceros, incluidos derechos de propiedad intelectual, privacidad o protección de datos.</li>
          <li>Intentar acceder a datos de otros usuarios o negocios registrados en la Plataforma.</li>
          <li>Realizar ingeniería inversa, descompilar o desensamblar cualquier componente del software.</li>
          <li>Sobrecargar los sistemas de la Plataforma mediante ataques automatizados o cualquier otro medio.</li>
          <li>Revender o sublicenciar el acceso al servicio a terceros sin autorización expresa.</li>
        </ul>
      </Section>

      <Section title="5. Consentimiento de los clientes finales y cumplimiento con plataformas de reseñas">
        <p>
          El usuario de ReseñasYa (el negocio) es exclusivamente responsable de obtener el consentimiento previo,
          informado y libre de sus clientes antes de enviarles mensajes de WhatsApp a través de la Plataforma.
          Este consentimiento debe cumplir con:
        </p>
        <ul>
          <li>El Reglamento (UE) 2016/679 (RGPD) en materia de comunicaciones comerciales electrónicas.</li>
          <li>La Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSICE).</li>
          <li>Las políticas de uso aceptable de Twilio y WhatsApp Business.</li>
        </ul>
        <p>
          <strong>{COMPANY}</strong> no asume ninguna responsabilidad por el envío de mensajes a personas que no hayan
          prestado su consentimiento. El incumplimiento de esta obligación puede suponer la suspensión inmediata de
          la cuenta del usuario.
        </p>
        <p>
          Adicionalmente, la Plataforma ofrece funcionalidades como la <strong>solicitud selectiva de reseñas</strong>{" "}
          (dirigir el enlace de la plataforma de reseñas únicamente a clientes con experiencias positivas) y el{" "}
          <strong>sistema de incentivos</strong> (ofrecer recompensas a cambio de una reseña). El usuario reconoce y
          acepta expresamente que:
        </p>
        <ul>
          <li>Estas funcionalidades pueden estar sujetas a las políticas de contenido y uso aceptable de las plataformas
              de reseñas donde el negocio esté presente (incluyendo, sin carácter limitativo, Google Maps / Google Business
              Profile, Trustpilot, App Store, Google Play y Yelp).</li>
          <li>Es <strong>su exclusiva responsabilidad</strong> conocer, revisar y cumplir con las políticas vigentes de
              cada plataforma de reseñas antes de activar y hacer uso de dichas funcionalidades.</li>
          <li><strong>{COMPANY} no garantiza ni declara</strong> que el uso de estas funcionalidades sea conforme con
              las políticas de ninguna plataforma de reseñas de terceros, y <strong>no asume ninguna responsabilidad</strong>{" "}
              por sanciones, eliminación de reseñas, penalizaciones en el posicionamiento, suspensión de perfiles de
              negocio u otras consecuencias derivadas del uso de estas funcionalidades por parte del usuario.</li>
          <li>El usuario mantendrá indemne a {COMPANY} frente a cualquier reclamación, sanción o daño derivado del
              uso que el usuario haga de la solicitud selectiva de reseñas o del sistema de incentivos.</li>
        </ul>
      </Section>

      <Section title="6. Servicios de terceros">
        <p>
          La Plataforma integra servicios de terceros para su funcionamiento. El uso de estos servicios está sujeto
          a sus propios términos y condiciones:
        </p>
        <ul>
          <li><strong>Twilio:</strong> proveedor del servicio de mensajería WhatsApp. El usuario deberá disponer de una cuenta activa en Twilio y cumplir con sus políticas de uso aceptable.</li>
          <li><strong>Anthropic (Claude AI):</strong> proveedor del servicio de análisis de sentimiento mediante inteligencia artificial.</li>
          <li><strong>Supabase:</strong> proveedor de la infraestructura de base de datos y autenticación.</li>
          <li><strong>Stripe:</strong> proveedor del servicio de procesamiento de pagos y gestión de suscripciones. Los datos de tarjeta son gestionados directamente por Stripe y no son almacenados por {COMPANY}.</li>
          <li><strong>Google Maps:</strong> el usuario es responsable de disponer del enlace correcto a su perfil de Google My Business.</li>
        </ul>
        <p>
          {COMPANY} no garantiza la disponibilidad continuada de los servicios de terceros y no será responsable
          por interrupciones causadas por estos proveedores.
        </p>
      </Section>

      <Section title="7. Propiedad intelectual e industrial">
        <p>
          Todos los derechos de propiedad intelectual e industrial sobre la Plataforma, incluyendo pero no limitado
          a: código fuente, diseño, logotipos, marcas, textos, imágenes y funcionalidades, son titularidad exclusiva
          de {COMPANY} o de sus licenciantes.
        </p>
        <p>
          Se concede al usuario una licencia de uso limitada, no exclusiva, no transferible y revocable para acceder
          y utilizar la Plataforma conforme a estas Condiciones. Esta licencia no implica la cesión de ningún derecho
          de propiedad intelectual.
        </p>
        <p>
          El usuario conserva la propiedad de los datos de sus clientes introducidos en la Plataforma, otorgando a
          {COMPANY} únicamente las licencias necesarias para prestar el servicio contratado.
        </p>
      </Section>

      <Section title="8. Disponibilidad y calidad del servicio">
        <p>
          {COMPANY} realizará sus mejores esfuerzos para mantener la Plataforma disponible de forma continua,
          pero no garantiza una disponibilidad del 100%. El servicio puede interrumpirse temporalmente por:
        </p>
        <ul>
          <li>Tareas de mantenimiento programado o no programado.</li>
          <li>Fallos en los servicios de terceros integrados.</li>
          <li>Causas de fuerza mayor o caso fortuito.</li>
          <li>Interrupciones en los servicios de infraestructura (servidores, red, electricidad).</li>
        </ul>
        <p>
          {COMPANY} no garantiza que los resultados obtenidos mediante el uso del servicio (aumento de reseñas,
          mejora de la reputación online) sean específicos ni predecibles.
        </p>
      </Section>

      <Section title="9. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la legislación aplicable, {COMPANY} no será responsable de:
        </p>
        <ul>
          <li>Daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del servicio.</li>
          <li>Pérdida de beneficios, ingresos, datos o reputación comercial.</li>
          <li>El contenido de los mensajes enviados por el usuario a sus clientes.</li>
          <li>Las reseñas publicadas por los clientes en Google Maps u otras plataformas.</li>
          <li>Las acciones u omisiones de los clientes finales del usuario.</li>
          <li>El incumplimiento por parte del usuario de sus obligaciones legales en materia de protección de datos.</li>
          <li>Sanciones, penalizaciones, eliminación de reseñas, suspensión de perfiles de negocio o cualquier otra
              medida adoptada por plataformas de reseñas de terceros (Google Maps, Trustpilot, App Store, Google Play,
              Yelp u otras) como consecuencia del uso por parte del usuario de la funcionalidad de solicitud selectiva
              de reseñas, del sistema de incentivos o de cualquier otra funcionalidad de la Plataforma.</li>
          <li>El incumplimiento por parte del usuario de las políticas de contenido o uso aceptable de cualquier
              plataforma de reseñas de terceros.</li>
        </ul>
        <p>
          La responsabilidad máxima de {COMPANY} frente al usuario, por cualquier concepto y en conjunto, no superará
          el importe total abonado por el usuario a {COMPANY} durante los tres (3) meses anteriores al evento que
          origine la reclamación.
        </p>
      </Section>

      <Section title="10. Precios, facturación y cancelación">
        <p>
          Las condiciones económicas del servicio (planes, precios, períodos de facturación y políticas de
          reembolso) se especifican en la página de precios de la Plataforma y en el contrato de suscripción
          correspondiente. {COMPANY} se reserva el derecho a modificar los precios con un preaviso de 30 días.
        </p>
        <p>
          El usuario puede cancelar su suscripción en cualquier momento desde el panel de configuración de su
          cuenta. La cancelación tendrá efecto al término del período de facturación en curso. No se realizarán
          reembolsos por los períodos ya facturados, salvo que la ley aplicable lo exija.
        </p>
      </Section>

      <Section title="11. Suspensión y cancelación de la cuenta">
        <p>
          {COMPANY} se reserva el derecho a suspender o cancelar la cuenta de un usuario, con o sin previo aviso,
          en los siguientes supuestos:
        </p>
        <ul>
          <li>Incumplimiento de estas Condiciones o de las políticas de uso de los servicios de terceros integrados.</li>
          <li>Falta de pago de las cuotas de suscripción.</li>
          <li>Uso fraudulento, abusivo o ilícito del servicio.</li>
          <li>Solicitud de la autoridad competente.</li>
        </ul>
        <p>
          Tras la cancelación de la cuenta, {COMPANY} podrá eliminar de forma permanente todos los datos asociados
          una vez transcurrido el período de retención establecido en la Política de Privacidad.
        </p>
      </Section>

      <Section title="12. Tratamiento de datos por cuenta del usuario (Art. 28 RGPD)">
        <p>
          En el marco de la prestación del servicio, {COMPANY} actúa como <strong>encargado del tratamiento</strong>{" "}
          por cuenta del usuario (negocio), que actúa como <strong>responsable del tratamiento</strong>, respecto a
          los datos personales de los clientes finales (nombre y número de teléfono) introducidos en la Plataforma
          para el envío de solicitudes de reseña.
        </p>
        <p>
          En virtud de lo dispuesto en el artículo 28 del Reglamento (UE) 2016/679 (RGPD), {COMPANY} se compromete a:
        </p>
        <ul>
          <li>Tratar los datos personales de los clientes finales únicamente siguiendo las instrucciones documentadas del responsable del tratamiento (el usuario).</li>
          <li>Garantizar que las personas autorizadas para tratar los datos personales se hayan comprometido a respetar la confidencialidad.</li>
          <li>Aplicar todas las medidas de seguridad técnicas y organizativas apropiadas conforme al artículo 32 RGPD.</li>
          <li>No recurrir a otro encargado del tratamiento sin autorización previa del responsable, salvo los subencargados necesarios para la prestación del servicio (Twilio, Anthropic, Supabase, Vercel), cuya utilización el usuario acepta mediante el uso de la Plataforma.</li>
          <li>Asistir al responsable del tratamiento en la atención de solicitudes de ejercicio de derechos de los interesados.</li>
          <li>Suprimir o devolver todos los datos personales al responsable del tratamiento una vez finalizada la prestación del servicio, salvo que el derecho de la Unión o de los Estados miembros exija la conservación de los datos personales.</li>
          <li>Poner a disposición del responsable del tratamiento toda la información necesaria para demostrar el cumplimiento de las obligaciones establecidas en el artículo 28 RGPD.</li>
        </ul>
        <p>
          El usuario, como responsable del tratamiento, garantiza que cuenta con base jurídica suficiente para tratar
          los datos de sus clientes y para encargar dicho tratamiento a {COMPANY}.
        </p>
      </Section>

      <Section title="13. Modificación de las Condiciones">
        <p>
          {COMPANY} se reserva el derecho de modificar estas Condiciones en cualquier momento. Las modificaciones
          serán comunicadas al usuario mediante correo electrónico o aviso en la Plataforma con un mínimo de 15 días
          de antelación a su entrada en vigor. El uso continuado del servicio tras la entrada en vigor de los cambios
          implica la aceptación de las nuevas Condiciones.
        </p>
      </Section>

      <Section title="14. Legislación aplicable y jurisdicción">
        <p>
          Estas Condiciones se rigen por la legislación española. Para la resolución de cualquier controversia
          derivada de la interpretación o el cumplimiento de estas Condiciones, las partes se someten, con renuncia
          expresa a cualquier otro fuero, a la jurisdicción de los Juzgados y Tribunales de España.
        </p>
        <p>
          Para reclamaciones de consumidores de la Unión Europea, también está disponible la plataforma de resolución
          de litigios en línea de la UE:{" "}
          <a href="https://ec.europa.eu/consumers/odr" className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">
            https://ec.europa.eu/consumers/odr
          </a>.
        </p>
      </Section>

      <Section title="15. Contacto">
        <p>
          Para cualquier consulta relacionada con estas Condiciones, puedes contactarnos en:{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> o a través de{" "}
          <a href="/contacto" className="text-brand-600 hover:underline">nuestro formulario de contacto</a>.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 leading-relaxed text-sm">{children}</div>
    </section>
  );
}
