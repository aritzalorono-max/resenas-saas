import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | ReseñasYa",
  description: "Condiciones generales de uso del servicio ReseñasYa.",
  alternates: { canonical: "/terminos" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "28 de mayo de 2026";
const COMPANY      = "Buy & Click, SL";
const EMAIL        = "contacto.resenasya@gmail.com";
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
          con CIF <strong>B-95612958</strong>, domicilio social en <strong>Avda. Ribera de Axpe 11, 2D&nbsp;-&nbsp;202,
          48950 Erandio (Bizkaia)</strong>, inscrita en el Registro Mercantil de Vizcaya, Tomo 5138, Folio 19,
          Inscripción 1.ª, Hoja BI-56789, y correo electrónico de contacto:{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
        </p>
        <p>
          La marca <strong>ReseñasYa</strong> es titularidad de <strong>{COMPANY}</strong>, registrada en la Oficina
          Española de Patentes y Marcas bajo la denominación <em>Buy &amp; Click</em>.
        </p>
        <p>
          Al registrarte y utilizar la Plataforma, aceptas íntegramente estas Condiciones. Si no estás de acuerdo con
          alguno de sus términos, deberás abstenerte de usar el servicio.
        </p>
      </Section>

      <Section title="2. Descripción del servicio">
        <p>
          ReseñasYa es una plataforma SaaS (Software as a Service) que permite a negocios locales automatizar la
          captación de reseñas en Google Maps y otras plataformas mediante el envío de mensajes de WhatsApp a sus
          clientes. El servicio incluye:
        </p>
        <ul>
          <li>Envío de mensajes de WhatsApp personalizados a clientes a través de la API de Twilio.</li>
          <li>Análisis automático del sentimiento de las respuestas de los clientes mediante inteligencia artificial (Claude AI de Anthropic).</li>
          <li>Generación automática de mensajes de seguimiento mediante inteligencia artificial, sin revisión humana previa al envío.</li>
          <li>Redireccionamiento de clientes satisfechos al perfil de Google Maps u otras plataformas de reseñas del negocio.</li>
          <li>Panel de gestión con estadísticas y métricas de satisfacción de clientes.</li>
          <li>Personalización del tono y los mensajes de comunicación con clientes.</li>
          <li>Sistema de incentivos opcional (plan Pro) para fomentar la publicación de reseñas.</li>
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

      <Section title="5. Inteligencia artificial: funcionamiento, limitaciones y exención de responsabilidad">
        <p>
          La Plataforma utiliza tecnología de inteligencia artificial (Claude AI, de Anthropic) para dos funciones principales:
          (i) analizar el sentimiento de las respuestas recibidas de los clientes finales del usuario, y (ii) generar
          automáticamente mensajes de seguimiento que se envían a dichos clientes a través de WhatsApp.
        </p>
        <p>
          El usuario reconoce y acepta expresamente los siguientes puntos en relación con el uso de inteligencia
          artificial en la Plataforma:
        </p>
        <ul>
          <li>
            <strong>Los mensajes generados por la IA no son revisados por {COMPANY} antes de su envío.</strong>{" "}
            El proceso es completamente automático. {COMPANY} no supervisa, no valida ni aprueba individualmente
            el contenido de ningún mensaje generado por la IA antes de que sea enviado al cliente final.
          </li>
          <li>
            <strong>{COMPANY} no es responsable del contenido de los mensajes generados por la IA.</strong>{" "}
            La inteligencia artificial puede cometer errores, malinterpretar el contexto, generar respuestas inexactas,
            inadecuadas o que no se ajusten a las expectativas del usuario o del cliente final. {COMPANY} no asume
            ninguna responsabilidad por el contenido, tono, exactitud, idoneidad o cualquier efecto derivado de
            los mensajes generados automáticamente por la IA.
          </li>
          <li>
            <strong>La IA puede fallar en la clasificación del sentimiento.</strong>{" "}
            El análisis de sentimiento es una estimación estadística. La IA puede clasificar erróneamente una respuesta
            positiva como negativa o viceversa, lo que puede provocar que se envíe un mensaje de seguimiento inadecuado.
            {COMPANY} no asume responsabilidad alguna por estos errores de clasificación ni por sus consecuencias.
          </li>
          <li>
            <strong>El usuario asume la responsabilidad del impacto de los mensajes generados por la IA.</strong>{" "}
            Si el usuario considera que los mensajes automáticos no son adecuados para su negocio, sector o público
            objetivo, debe abstenerse de usar esta funcionalidad o configurar mensajes personalizados en la medida
            en que la Plataforma lo permita.
          </li>
          <li>
            <strong>La disponibilidad del servicio de IA depende de Anthropic.</strong>{" "}
            {COMPANY} no garantiza la disponibilidad continua del servicio de análisis e IA, y no asume responsabilidad
            por interrupciones causadas por Anthropic o por el proveedor de IA.
          </li>
        </ul>
      </Section>

      <Section title="6. Respuestas de clientes finales y contenido de reseñas">
        <p>
          El uso de la Plataforma implica la comunicación con clientes finales del usuario a través de WhatsApp.
          {COMPANY} no tiene ningún control sobre las respuestas que dichos clientes puedan enviar ni sobre las
          reseñas que puedan publicar. En consecuencia:
        </p>
        <ul>
          <li>
            <strong>{COMPANY} no es responsable del contenido de las respuestas de los clientes finales.</strong>{" "}
            Los clientes pueden responder con mensajes ofensivos, inapropiados, falsos, difamatorios o de cualquier
            otro tipo. {COMPANY} no asume ninguna responsabilidad por dichas respuestas, por su contenido ni por
            las consecuencias que puedan derivarse de las mismas para el usuario o para terceros.
          </li>
          <li>
            <strong>{COMPANY} no es responsable de las reseñas publicadas en plataformas de terceros.</strong>{" "}
            Una vez que el cliente final accede a Google Maps, Trustpilot, App Store, Google Play, Yelp u otra
            plataforma, el contenido que publique escapa completamente del control de {COMPANY}. {COMPANY} no
            asume ninguna responsabilidad por el contenido de dichas reseñas, su veracidad, su impacto en la
            reputación del negocio ni por la puntuación que el cliente decida otorgar.
          </li>
          <li>
            <strong>{COMPANY} no garantiza que los clientes dejen reseñas positivas.</strong>{" "}
            La Plataforma facilita el contacto con los clientes, pero no puede garantizar ni el número, ni el
            contenido, ni la puntuación de las reseñas que estos publiquen. Los resultados dependen exclusivamente
            de la experiencia real del cliente con el negocio del usuario.
          </li>
          <li>
            <strong>El usuario es responsable de gestionar las comunicaciones con sus clientes.</strong>{" "}
            Si el usuario recibe respuestas inadecuadas, amenazadoras o que puedan constituir un ilícito, deberá
            gestionarlas directamente con el cliente y, si procede, con las autoridades competentes. {COMPANY} no
            intermediará ni asumirá responsabilidad en dichos supuestos.
          </li>
        </ul>
      </Section>

      <Section title="7. Plataformas de reseñas de terceros: exención de responsabilidad">
        <p>
          La Plataforma facilita el enlace a perfiles de reseñas en Google Maps, Trustpilot, App Store, Google Play,
          Yelp y otras plataformas de terceros. {COMPANY} no tiene ninguna relación comercial, afiliación ni acuerdo
          con dichas plataformas en el contexto del uso de ReseñasYa. En consecuencia:
        </p>
        <ul>
          <li>
            <strong>{COMPANY} no es responsable de las decisiones de Google Maps, Trustpilot ni de ninguna otra plataforma de reseñas.</strong>{" "}
            Esto incluye, sin carácter limitativo: eliminación de reseñas, suspensión o penalización de perfiles de
            negocio, cambios en los algoritmos de posicionamiento, modificaciones en las políticas de uso, o cualquier
            otra acción que dichas plataformas puedan adoptar de forma unilateral.
          </li>
          <li>
            <strong>{COMPANY} no es responsable de los problemas técnicos de las plataformas de terceros.</strong>{" "}
            Caídas del servicio, errores en la carga de perfiles, problemas con los enlaces de reseñas u otros
            fallos técnicos en Google Maps, Trustpilot o cualquier otra plataforma son responsabilidad exclusiva
            de dichas plataformas.
          </li>
          <li>
            <strong>El usuario es responsable de cumplir con las políticas de cada plataforma de reseñas.</strong>{" "}
            La solicitud selectiva de reseñas y el sistema de incentivos pueden estar sujetos a las políticas de
            contenido de cada plataforma. El usuario debe revisar y cumplir dichas políticas antes de usar estas
            funcionalidades. {COMPANY} no garantiza la conformidad del servicio con las políticas de ninguna
            plataforma de reseñas de terceros.
          </li>
          <li>
            El usuario mantendrá indemne a {COMPANY} frente a cualquier reclamación, sanción o daño derivado de
            actuaciones de plataformas de reseñas de terceros como consecuencia del uso que el usuario haga de
            la Plataforma.
          </li>
        </ul>
      </Section>

      <Section title="8. Servicios de terceros">
        <p>
          La Plataforma integra servicios de terceros para su funcionamiento. El uso de estos servicios está sujeto
          a sus propios términos y condiciones:
        </p>
        <ul>
          <li><strong>Twilio:</strong> proveedor del servicio de mensajería WhatsApp. El usuario deberá cumplir con sus políticas de uso aceptable.</li>
          <li><strong>Anthropic (Claude AI):</strong> proveedor del servicio de análisis de sentimiento y generación de mensajes mediante inteligencia artificial. Ver Sección 5.</li>
          <li><strong>Supabase:</strong> proveedor de la infraestructura de base de datos y autenticación.</li>
          <li><strong>Stripe:</strong> proveedor del servicio de procesamiento de pagos y gestión de suscripciones. Los datos de tarjeta son gestionados directamente por Stripe y no son almacenados por {COMPANY}.</li>
          <li><strong>Vercel:</strong> proveedor de la infraestructura de hospedaje y despliegue de la aplicación.</li>
          <li><strong>Google Maps / Google Business Profile:</strong> plataforma de reseñas de terceros. Ver Sección 7.</li>
        </ul>
        <p>
          {COMPANY} no garantiza la disponibilidad continuada de los servicios de terceros y no será responsable
          por interrupciones, cambios o cese de dichos servicios.
        </p>
      </Section>

      <Section title="9. Propiedad intelectual e industrial">
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

      <Section title="10. Disponibilidad y calidad del servicio">
        <p>
          {COMPANY} realizará sus mejores esfuerzos para mantener la Plataforma disponible de forma continua,
          pero no garantiza una disponibilidad del 100%. El servicio puede interrumpirse temporalmente por:
        </p>
        <ul>
          <li>Tareas de mantenimiento programado o no programado.</li>
          <li>Fallos en los servicios de terceros integrados (Twilio, Anthropic, Supabase, Stripe, Vercel).</li>
          <li>Causas de fuerza mayor o caso fortuito.</li>
          <li>Interrupciones en los servicios de infraestructura (servidores, red, electricidad).</li>
        </ul>
        <p>
          {COMPANY} no garantiza que los resultados obtenidos mediante el uso del servicio (aumento de reseñas,
          mejora de la reputación online, incremento de la puntuación media) sean específicos ni predecibles.
          Los resultados dependen de factores ajenos al control de {COMPANY}, como la experiencia real del cliente
          con el negocio y las decisiones de las plataformas de reseñas de terceros.
        </p>
      </Section>

      <Section title="11. Limitación de responsabilidad">
        <p>
          En la máxima medida permitida por la legislación aplicable, {COMPANY} no será responsable de:
        </p>
        <ul>
          <li>Daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del servicio.</li>
          <li>Pérdida de beneficios, ingresos, datos o reputación comercial.</li>
          <li>El contenido de los mensajes generados por la inteligencia artificial (ver Sección 5).</li>
          <li>El contenido de los mensajes enviados por los clientes finales del usuario a través de WhatsApp.</li>
          <li>Las reseñas publicadas por los clientes en Google Maps, Trustpilot, App Store, Google Play, Yelp u otras plataformas (ver Sección 6).</li>
          <li>Las acciones, omisiones o decisiones de los clientes finales del usuario.</li>
          <li>Problemas técnicos, cambios de política, suspensiones de perfiles o cualquier otra actuación de Google Maps, Trustpilot u otras plataformas de reseñas de terceros (ver Sección 7).</li>
          <li>El incumplimiento por parte del usuario de sus obligaciones legales en materia de protección de datos.</li>
          <li>Sanciones, penalizaciones, eliminación de reseñas, suspensión de perfiles de negocio o cualquier otra medida adoptada por plataformas de reseñas de terceros como consecuencia del uso por parte del usuario de la funcionalidad de solicitud selectiva de reseñas, del sistema de incentivos o de cualquier otra funcionalidad de la Plataforma.</li>
        </ul>
        <p>
          La responsabilidad máxima de {COMPANY} frente al usuario, por cualquier concepto y en conjunto, no superará
          el importe total abonado por el usuario a {COMPANY} durante los tres (3) meses anteriores al evento que
          origine la reclamación.
        </p>
      </Section>

      <Section title="12. Suscripción, facturación y cancelación">
        <p>
          <strong>Naturaleza del servicio:</strong> ReseñasYa funciona exclusivamente mediante suscripción mensual de
          pago. No existe periodo de prueba gratuito salvo indicación expresa en la página de precios.
        </p>

        <p><strong>Renovación automática:</strong></p>
        <ul>
          <li>La suscripción se renueva automáticamente cada mes en la misma fecha en que fue contratada originalmente.</li>
          <li>El importe correspondiente al plan contratado se cargará de forma automática al método de pago registrado (tarjeta de crédito/débito), sin necesidad de ninguna acción por parte del usuario.</li>
          <li>Este proceso se repetirá indefinidamente hasta que el usuario cancele expresamente su suscripción.</li>
          <li>El usuario recibirá una factura por correo electrónico tras cada cargo exitoso.</li>
        </ul>

        <p><strong>Cómo cancelar la suscripción:</strong></p>
        <p>
          El usuario puede cancelar su suscripción en cualquier momento siguiendo estos pasos:
        </p>
        <ol>
          <li>Acceder al panel de su cuenta en <a href={`${APP_URL}/facturacion`} className="text-brand-600 hover:underline">Facturación</a>.</li>
          <li>Hacer clic en el botón <strong>"Gestionar suscripción"</strong>.</li>
          <li>En el portal de Stripe que se abrirá, seleccionar <strong>"Cancelar plan"</strong> y confirmar la cancelación.</li>
        </ol>
        <p>
          También puede contactar con nosotros en{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>{" "}
          para solicitar la cancelación.
        </p>

        <p><strong>Efectos de la cancelación:</strong></p>
        <ul>
          <li>La cancelación debe realizarse <strong>antes de que finalice el período de facturación en curso</strong> para evitar el cargo automático del siguiente mes.</li>
          <li>Una vez cancelada, la suscripción no se renovará en la siguiente fecha de cobro.</li>
          <li>El usuario mantendrá acceso al servicio hasta el final del período de facturación ya pagado.</li>
          <li><strong>No se realizarán reembolsos</strong> por los períodos de facturación ya cobrados, salvo que la legislación aplicable lo exija expresamente.</li>
        </ul>

        <p><strong>Cambios de plan:</strong></p>
        <ul>
          <li>El usuario puede cambiar de plan (superior o inferior) en cualquier momento desde la sección de Facturación.</li>
          <li>Los cambios de plan se aplicarán en el siguiente período de facturación.</li>
        </ul>

        <p><strong>Modificación de precios:</strong></p>
        <ul>
          <li>{COMPANY} se reserva el derecho a modificar los precios de los planes con un preaviso mínimo de 30 días, notificado por correo electrónico.</li>
          <li>Si el usuario no está de acuerdo con el nuevo precio, podrá cancelar su suscripción antes de la fecha de entrada en vigor del cambio.</li>
          <li>El uso continuado del servicio tras la entrada en vigor del nuevo precio implica la aceptación del mismo.</li>
        </ul>

        <p><strong>Impago:</strong></p>
        <ul>
          <li>En caso de que el cargo automático no pueda realizarse (tarjeta caducada, fondos insuficientes u otros motivos), {COMPANY} intentará el cobro de nuevo durante un período determinado.</li>
          <li>Si el impago persiste, {COMPANY} se reserva el derecho a suspender o cancelar el acceso al servicio.</li>
        </ul>
      </Section>

      <Section title="13. Suspensión y cancelación de la cuenta">
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

      <Section title="14. Tratamiento de datos por cuenta del usuario (Art. 28 RGPD)">
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
          <li>No recurrir a otro encargado del tratamiento sin autorización previa del responsable, salvo los subencargados necesarios para la prestación del servicio (Twilio, Anthropic, Supabase, Vercel, Stripe), cuya utilización el usuario acepta mediante el uso de la Plataforma.</li>
          <li>Asistir al responsable del tratamiento en la atención de solicitudes de ejercicio de derechos de los interesados.</li>
          <li>Suprimir o devolver todos los datos personales al responsable del tratamiento una vez finalizada la prestación del servicio, salvo que el derecho de la Unión o de los Estados miembros exija la conservación de los datos personales.</li>
          <li>Poner a disposición del responsable del tratamiento toda la información necesaria para demostrar el cumplimiento de las obligaciones establecidas en el artículo 28 RGPD.</li>
        </ul>
        <p>
          El usuario, como responsable del tratamiento, garantiza que cuenta con base jurídica suficiente para tratar
          los datos de sus clientes y para encargar dicho tratamiento a {COMPANY}.
        </p>
      </Section>

      <Section title="15. Modificación de las Condiciones">
        <p>
          {COMPANY} se reserva el derecho de modificar estas Condiciones en cualquier momento. Las modificaciones
          serán comunicadas al usuario mediante correo electrónico o aviso en la Plataforma con un mínimo de 15 días
          de antelación a su entrada en vigor. El uso continuado del servicio tras la entrada en vigor de los cambios
          implica la aceptación de las nuevas Condiciones.
        </p>
      </Section>

      <Section title="16. Legislación aplicable y jurisdicción">
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

      <Section title="17. Contacto">
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
