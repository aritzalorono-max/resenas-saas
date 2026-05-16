import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad y Aviso Legal | ReseñasYa",
  description: "Política de privacidad, aviso legal y protección de datos de ReseñasYa conforme al RGPD.",
  alternates: { canonical: "/privacidad" },
  robots: { index: false },
};

const LAST_UPDATED = "16 de mayo de 2026";
const COMPANY      = "Buy & Click, SL";
const EMAIL_LEGAL  = "contacto.resenasya@gmail.com";
const EMAIL_DPD    = "contacto.resenasya@gmail.com";
const APP_URL      = "https://resenasya.com";

export default function PrivacidadPage() {
  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Documento legal</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacidad y Aviso Legal</h1>
        <p className="text-sm text-gray-400">Última actualización: {LAST_UPDATED}</p>
      </header>

      {/* ── AVISO LEGAL ─────────────────────────────────────────────────── */}
      <div className="mb-3">
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
          Aviso legal
        </span>
      </div>

      <Section title="1. Datos identificativos del titular">
        <Table rows={[
          ["Denominación social", COMPANY],
          ["Forma jurídica", "Sociedad de Responsabilidad Limitada (S.L.)"],
          ["CIF", "B-95612958"],
          ["Domicilio social", "Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)"],
          ["Registro Mercantil", "R.M. de Vizcaya, Tomo 5138, Folio 19, Inscripción 1.ª, Hoja BI-56789"],
          ["Marca registrada", "Buy & Click (Oficina Española de Patentes y Marcas)"],
          ["Correo electrónico", EMAIL_LEGAL],
          ["Sitio web", APP_URL],
          ["Actividad", "Servicios SaaS de gestión de reputación online"],
        ]} />
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
          Información y de Comercio Electrónico (LSSICE), se ponen a disposición del usuario los datos identificativos
          del titular de la plataforma.
        </p>
      </Section>

      <Section title="2. Objeto y ámbito de aplicación">
        <p>
          El presente aviso legal regula el acceso y uso de la plataforma <strong>ReseñasYa</strong> ({APP_URL}),
          titularidad de {COMPANY}. El acceso a la plataforma implica la aceptación de este aviso legal en su
          totalidad. Si no estás de acuerdo con sus términos, deberás abstenerte de utilizar el servicio.
        </p>
      </Section>

      <Section title="3. Propiedad intelectual e industrial">
        <p>
          Todos los contenidos de la plataforma —incluyendo, sin carácter limitativo, textos, fotografías, gráficos,
          imágenes, iconos, tecnología, software, código fuente, logotipos, marcas, nombres comerciales, diseño
          gráfico y estructura— son titularidad de {COMPANY} o de sus proveedores de contenidos, y están protegidos
          por la normativa española e internacional sobre propiedad intelectual e industrial.
        </p>
        <p>
          Queda expresamente prohibida la reproducción, distribución, comunicación pública, transformación o
          cualquier otra forma de explotación de dichos contenidos sin autorización expresa y por escrito de {COMPANY}.
        </p>
      </Section>

      <Section title="4. Responsabilidad">
        <p>
          {COMPANY} no garantiza la disponibilidad continua ni la ausencia de errores en la plataforma. Asimismo,
          no se responsabiliza de los daños que pudieran derivarse del uso incorrecto de la plataforma, de la
          interrupción del servicio, de fallos técnicos o de accesos no autorizados que no sean imputables a {COMPANY}.
        </p>
        <p>
          El usuario es responsable del uso que realice de la plataforma, del cumplimiento de la normativa aplicable
          en materia de protección de datos respecto a sus propios clientes, y del contenido de los mensajes que
          envíe a través del servicio.
        </p>
      </Section>

      <Section title="5. Legislación aplicable">
        <p>
          El presente aviso legal se rige por la legislación española. Para la resolución de cualquier controversia
          derivada de su interpretación o cumplimiento, las partes se someten a la jurisdicción de los Juzgados y
          Tribunales de España.
        </p>
      </Section>

      {/* ── POLÍTICA DE PRIVACIDAD ──────────────────────────────────────── */}
      <div className="mt-12 mb-3">
        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
          Política de privacidad
        </span>
      </div>

      <Section title="6. Responsable del tratamiento">
        <Table rows={[
          ["Responsable", COMPANY],
          ["Finalidad principal", "Prestación del servicio ReseñasYa y gestión de la relación contractual"],
          ["Contacto DPD / privacidad", EMAIL_DPD],
          ["Supervisory authority", "Agencia Española de Protección de Datos (AEPD) — www.aepd.es"],
        ]} />
      </Section>

      <Section title="7. Datos personales que tratamos">
        <p>En función del tipo de usuario y la relación con la plataforma, tratamos las siguientes categorías de datos:</p>
        <SubTitle>7.1 Usuarios registrados (negocios)</SubTitle>
        <ul>
          <li><strong>Datos de registro:</strong> dirección de correo electrónico y contraseña cifrada.</li>
          <li><strong>Datos del perfil del negocio:</strong> nombre del negocio, descripción, URL de la web, enlace de Google Maps y tono de comunicación seleccionado.</li>
          <li><strong>Datos de uso:</strong> registros de actividad, número de solicitudes enviadas, métricas de satisfacción de clientes.</li>
          <li><strong>Datos de facturación:</strong> en planes de pago, los datos necesarios para la emisión de facturas (nombre, NIF/CIF, dirección fiscal). Los datos de pago son gestionados directamente por el procesador de pagos y no son almacenados por {COMPANY}.</li>
        </ul>
        <SubTitle>7.2 Clientes finales de los negocios</SubTitle>
        <p>
          Los negocios que usan ReseñasYa introducen datos de sus propios clientes (nombre y número de teléfono)
          para el envío de solicitudes de reseña. Respecto a estos datos:
        </p>
        <ul>
          <li>{COMPANY} actúa como <strong>encargado del tratamiento</strong> en nombre del negocio usuario, que es el responsable del tratamiento.</li>
          <li>El negocio es responsable de haber obtenido el consentimiento necesario de sus clientes antes de introducir sus datos en la plataforma.</li>
          <li>Las respuestas de los clientes (texto libre) son procesadas por la IA de Anthropic (Claude) para el análisis de sentimiento y se almacenan de forma asociada a cada solicitud.</li>
        </ul>
      </Section>

      <Section title="8. Finalidades y bases jurídicas del tratamiento">
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Finalidad</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Base jurídica</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Gestión del registro y acceso a la plataforma", "Ejecución del contrato (art. 6.1.b RGPD)"],
              ["Prestación del servicio de envío de WhatsApps y análisis de sentimiento", "Ejecución del contrato (art. 6.1.b RGPD)"],
              ["Facturación y cumplimiento de obligaciones fiscales", "Cumplimiento de obligación legal (art. 6.1.c RGPD)"],
              ["Envío de comunicaciones sobre el servicio (novedades, cambios de condiciones)", "Interés legítimo del responsable (art. 6.1.f RGPD)"],
              ["Envío de comunicaciones comerciales y newsletter (si el usuario lo acepta)", "Consentimiento (art. 6.1.a RGPD)"],
              ["Análisis de uso y mejora del servicio", "Interés legítimo del responsable (art. 6.1.f RGPD)"],
            ].map(([fin, base], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="p-3 border border-gray-200 text-gray-600">{fin}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{base}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title="9. Destinatarios y transferencias internacionales">
        <p>
          Para la prestación del servicio, {COMPANY} comparte datos con los siguientes proveedores que actúan
          como encargados del tratamiento:
        </p>
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Proveedor</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">Servicio</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">País / Garantías</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Supabase, Inc.", "Base de datos y autenticación", "EE.UU. — Cláusulas Contractuales Tipo UE"],
              ["Twilio Inc.", "Envío de mensajes WhatsApp", "EE.UU. — Cláusulas Contractuales Tipo UE"],
              ["Anthropic, PBC", "Análisis de sentimiento (IA)", "EE.UU. — Cláusulas Contractuales Tipo UE"],
              ["Vercel Inc.", "Alojamiento web (serverless)", "EE.UU. — Cláusulas Contractuales Tipo UE"],
              ["Stripe, Inc.", "Procesamiento de pagos y suscripciones", "EE.UU. — Cláusulas Contractuales Tipo UE"],
            ].map(([p, s, c], i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="p-3 border border-gray-200 text-gray-600 font-medium">{p}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{s}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3">
          No cedemos datos personales a terceros ajenos a la prestación del servicio, salvo obligación legal.
        </p>
      </Section>

      <Section title="10. Plazos de conservación">
        <ul>
          <li><strong>Datos de cuenta y perfil del negocio:</strong> durante la vigencia del contrato de servicio y, una vez finalizado, durante los plazos de prescripción legal (mínimo 5 años para obligaciones mercantiles y fiscales).</li>
          <li><strong>Datos de clientes finales (solicitudes de reseña):</strong> durante la vigencia de la cuenta del negocio y hasta 3 años tras la cancelación, salvo solicitud de supresión anterior.</li>
          <li><strong>Logs de actividad y seguridad:</strong> 12 meses.</li>
          <li><strong>Datos de facturación:</strong> 5 años conforme a la normativa fiscal española.</li>
        </ul>
      </Section>

      <Section title="11. Derechos de los interesados">
        <p>
          Conforme al RGPD, los interesados pueden ejercer los siguientes derechos enviando una solicitud a{" "}
          <a href={`mailto:${EMAIL_DPD}`} className="text-brand-600 hover:underline">{EMAIL_DPD}</a> indicando
          el derecho que desean ejercer y adjuntando copia de su documento de identidad:
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3 not-prose">
          {[
            { d: "Acceso", desc: "Conocer qué datos personales tuyos tratamos." },
            { d: "Rectificación", desc: "Corregir datos inexactos o incompletos." },
            { d: "Supresión", desc: "Solicitar el borrado de tus datos cuando proceda." },
            { d: "Limitación", desc: "Solicitar la suspensión temporal del tratamiento." },
            { d: "Oposición", desc: "Oponerte al tratamiento basado en interés legítimo." },
            { d: "Portabilidad", desc: "Recibir tus datos en formato estructurado y legible por máquina." },
            { d: "Retirada del consentimiento", desc: "Retirar el consentimiento prestado en cualquier momento sin efectos retroactivos." },
            { d: "Reclamación ante la AEPD", desc: "Presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es)." },
          ].map(({ d, desc }) => (
            <div key={d} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">{d}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">
          Responderemos a tu solicitud en un plazo máximo de un mes, prorrogable dos meses adicionales en casos
          complejos, comunicándote la prórroga en el plazo de un mes desde la recepción.
        </p>
      </Section>

      <Section title="12. Seguridad de los datos">
        <p>
          {COMPANY} aplica medidas técnicas y organizativas apropiadas para proteger los datos personales contra
          la pérdida accidental, el acceso no autorizado, la divulgación, la alteración o la destrucción. Entre
          estas medidas se incluyen:
        </p>
        <ul>
          <li>Cifrado de datos en tránsito mediante TLS/HTTPS en todas las comunicaciones.</li>
          <li>Cifrado de contraseñas mediante algoritmos de hash seguros (bcrypt).</li>
          <li>Control de acceso basado en Row Level Security (RLS) en la base de datos.</li>
          <li>Separación de credenciales de acceso por entorno (desarrollo/producción).</li>
          <li>Rotación periódica de claves de API y tokens de acceso.</li>
          <li>Monitorización de accesos y alertas ante anomalías.</li>
        </ul>
        <p>
          En caso de producirse una brecha de seguridad que afecte a datos personales, {COMPANY} notificará a
          la AEPD en un plazo máximo de 72 horas y, cuando proceda, a los interesados afectados.
        </p>
      </Section>

      <Section title="13. Cambios en esta política">
        <p>
          {COMPANY} se reserva el derecho a actualizar esta Política de Privacidad para adaptarla a cambios
          normativos, jurisprudenciales o del propio servicio. Las modificaciones sustanciales serán comunicadas
          a los usuarios registrados con al menos 15 días de antelación mediante correo electrónico o aviso
          destacado en la plataforma.
        </p>
        <p>
          Para cualquier consulta sobre privacidad, contacta con nosotros en:{" "}
          <a href={`mailto:${EMAIL_DPD}`} className="text-brand-600 hover:underline">{EMAIL_DPD}</a>.
        </p>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">{title}</h2>
      <div className="space-y-3 text-gray-600 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return <p className="font-semibold text-gray-800 mt-4 mb-1">{children}</p>;
}

function Table({ rows }: { rows: [string, string][] }) {
  return (
    <table className="w-full text-sm border-collapse mb-3">
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-gray-100">
            <td className="py-2 pr-4 font-medium text-gray-700 whitespace-nowrap w-48">{k}</td>
            <td className="py-2 text-gray-600">{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
