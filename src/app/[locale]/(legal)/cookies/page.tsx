import type { Metadata } from "next";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";

export const metadata: Metadata = {
  title: "Política de Cookies | ReseñasYa",
  description: "Información sobre el uso de cookies en ReseñasYa conforme a la normativa europea.",
  alternates: { canonical: "/cookies" },
  robots: { index: false },
};

const LAST_UPDATED = "16 de mayo de 2026";
const COMPANY      = "Buy & Click, SL";
const EMAIL        = "contacto.resenasya@gmail.com";

export default function CookiesPage() {
  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Documento legal</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Cookies</h1>
        <p className="text-sm text-gray-400">Última actualización: {LAST_UPDATED}</p>

        {/* Manage preferences inline */}
        <div className="mt-4 inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500">¿Quieres revisar o cambiar tus preferencias?</span>
          <ManageCookiesButton />
        </div>
      </header>

      <Section title="1. ¿Qué son las cookies?">
        <p>
          Una cookie es un pequeño archivo de texto que un sitio web guarda en tu navegador cuando lo visitas.
          Las cookies permiten que el sitio web recuerde tus acciones y preferencias (como el inicio de sesión,
          el idioma o el tamaño de fuente) durante un período de tiempo, de modo que no tengas que volver a
          introducirlos cada vez que visites el sitio o navegues de una página a otra.
        </p>
        <p>
          En cumplimiento del artículo 22.2 de la Ley 34/2002 de Servicios de la Sociedad de la Información
          (LSSICE), del Reglamento (UE) 2016/679 (RGPD) y de la Directiva 2009/136/CE (Directiva ePrivacy),
          {" "}{COMPANY} te informa sobre el uso de cookies en la plataforma <strong>ReseñasYa</strong>.
        </p>
      </Section>

      <Section title="2. Tipos de cookies que utilizamos">
        <SubTitle>2.1 Cookies estrictamente necesarias</SubTitle>
        <p>
          Son imprescindibles para el funcionamiento de la plataforma. Sin ellas, servicios como la autenticación
          o la seguridad de sesión no serían posibles. <strong>No requieren consentimiento</strong> previo conforme
          a la normativa aplicable y no pueden desactivarse.
        </p>
        <CookieTable cookies={[
          {
            name: "sb-access-token",
            provider: "Supabase",
            purpose: "Gestión de la sesión autenticada del usuario en la plataforma.",
            type: "Primera parte",
            duration: "Sesión / 1 hora",
            consent: "No requerido",
            active: true,
          },
          {
            name: "sb-refresh-token",
            provider: "Supabase",
            purpose: "Renovación automática de la sesión del usuario.",
            type: "Primera parte",
            duration: "30 días",
            consent: "No requerido",
            active: true,
          },
          {
            name: "__Host-next-auth.csrf-token",
            provider: "Next.js",
            purpose: "Protección contra ataques CSRF (Cross-Site Request Forgery).",
            type: "Primera parte",
            duration: "Sesión",
            consent: "No requerido",
            active: true,
          },
          {
            name: "ry_cookie_consent",
            provider: "ReseñasYa (localStorage)",
            purpose: "Almacena tus preferencias de consentimiento de cookies para no pedírtelas en cada visita.",
            type: "Primera parte (localStorage)",
            duration: "Hasta que se actualice la política",
            consent: "No requerido",
            active: true,
          },
          {
            name: "resenas_ya_country",
            provider: "ReseñasYa (localStorage)",
            purpose: "Recuerda el prefijo de país seleccionado en el selector de teléfono.",
            type: "Primera parte (localStorage)",
            duration: "Persistente hasta borrado manual",
            consent: "No requerido",
            active: true,
          },
        ]} />

        <SubTitle>2.2 Cookies analíticas</SubTitle>
        <p>
          Nos ayudan a entender cómo se usa la plataforma para poder mejorarla. Los datos se tratan
          de forma agregada y anónima. <strong>Solo se activan con tu consentimiento expreso.</strong>
        </p>
        <p>
          <em>Actualmente estas cookies no están activas.</em> Se activarán en una futura actualización
          de la plataforma, momento en el que se informará mediante el banner de consentimiento.
        </p>
        <CookieTable cookies={[
          {
            name: "_ga, _ga_*",
            provider: "Google Analytics 4",
            purpose: "Mide el comportamiento de navegación de forma anónima para mejorar la experiencia de usuario.",
            type: "Tercera parte",
            duration: "2 años",
            consent: "Requerido",
            active: false,
          },
          {
            name: "va_*",
            provider: "Vercel Analytics",
            purpose: "Analítica de rendimiento web sin cookies de seguimiento entre sitios.",
            type: "Primera parte",
            duration: "Sesión",
            consent: "Requerido",
            active: false,
          },
        ]} />

        <SubTitle>2.3 Cookies de marketing y redes sociales</SubTitle>
        <p>
          Permiten mostrar publicidad relevante y medir el rendimiento de campañas en plataformas sociales.
          <strong> Solo se activan con tu consentimiento expreso.</strong>
        </p>
        <p>
          <em>Actualmente estas cookies no están activas.</em> Se activarán en una futura actualización.
        </p>
        <CookieTable cookies={[
          {
            name: "_fbp, _fbc",
            provider: "Meta Pixel (Facebook / Instagram)",
            purpose: "Seguimiento de conversiones y remarketing en plataformas de Meta.",
            type: "Tercera parte",
            duration: "90 días",
            consent: "Requerido",
            active: false,
          },
          {
            name: "li_sugr, bcookie",
            provider: "LinkedIn Insight Tag",
            purpose: "Conversiones y audiencias en LinkedIn.",
            type: "Tercera parte",
            duration: "6 meses – 2 años",
            consent: "Requerido",
            active: false,
          },
          {
            name: "_gcl_au, _gcl_aw",
            provider: "Google Ads",
            purpose: "Medición de conversiones de campañas de Google.",
            type: "Tercera parte",
            duration: "90 días",
            consent: "Requerido",
            active: false,
          },
        ]} />
      </Section>

      <Section title="3. Servicios de terceros sin cookies de navegador">
        <p>
          Los siguientes servicios forman parte de nuestra plataforma pero funcionan exclusivamente en el
          servidor y <strong>no instalan cookies en tu navegador</strong>:
        </p>
        <ul>
          <li><strong>Twilio WhatsApp Business</strong> — Envío y recepción de mensajes WhatsApp a clientes.</li>
          <li><strong>Anthropic Claude</strong> — Análisis de sentimiento de respuestas de clientes mediante IA.</li>
          <li><strong>Supabase PostgreSQL</strong> — Base de datos. Las credenciales de sesión se gestionan mediante las cookies de primera parte descritas arriba.</li>
        </ul>
        <p>
          Si accedes a enlaces externos presentes en la plataforma (como tu perfil de Google Maps),
          los sitios de destino pueden establecer sus propias cookies conforme a sus políticas.
          {COMPANY} no controla ni es responsable de dichas cookies.
        </p>
      </Section>

      <Section title="4. Base legal para el uso de cookies">
        <ul>
          <li>
            <strong>Necesidad técnica / interés legítimo:</strong> las cookies estrictamente necesarias
            para el funcionamiento del servicio (autenticación, seguridad) no requieren consentimiento
            previo (artículo 22.2 LSSICE a contrario sensu).
          </li>
          <li>
            <strong>Consentimiento expreso (artículo 6.1.a RGPD):</strong> las cookies analíticas y de
            marketing requieren tu consentimiento previo, libre, informado y específico. Puedes retirar
            tu consentimiento en cualquier momento desde el panel de preferencias.
          </li>
        </ul>
      </Section>

      <Section title="5. Cómo gestionar tus preferencias">
        <p>
          Puedes revisar o cambiar tus preferencias en cualquier momento usando el botón de la parte
          superior de esta página o desde el pie de página de la plataforma.
        </p>
        <p>
          También puedes gestionar, bloquear o eliminar las cookies a través de la configuración de tu
          navegador. Ten en cuenta que desactivar las cookies necesarias puede impedir el correcto
          funcionamiento de la plataforma.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mt-2 not-prose">
          {[
            { browser: "Google Chrome",   url: "https://support.google.com/chrome/answer/95647" },
            { browser: "Mozilla Firefox", url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web" },
            { browser: "Apple Safari",    url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac" },
            { browser: "Microsoft Edge",  url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
          ].map(({ browser, url }) => (
            <a
              key={browser}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              {browser}
            </a>
          ))}
        </div>
      </Section>

      <Section title="6. Actualización de esta política">
        <p>
          {COMPANY} puede actualizar esta Política de Cookies cuando sea necesario, por ejemplo al incorporar
          nuevas funcionalidades que requieran el uso de cookies adicionales o al contratar nuevos servicios.
          Las actualizaciones sustanciales se comunicarán mediante el banner de consentimiento y, en su caso,
          por correo electrónico.
        </p>
        <p>
          Para cualquier consulta sobre cookies o privacidad, contacta con nosotros en:{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
        </p>
      </Section>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Componentes de presentación
// ---------------------------------------------------------------------------

interface Cookie {
  name: string;
  provider: string;
  purpose: string;
  type: string;
  duration: string;
  consent: string;
  active: boolean;
}

function CookieTable({ cookies }: { cookies: Cookie[] }) {
  return (
    <div className="overflow-x-auto mt-3 mb-4">
      <table className="w-full text-xs border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-gray-50">
            {["Nombre", "Proveedor", "Finalidad", "Tipo", "Duración", "Consentimiento", "Estado"].map((h) => (
              <th key={h} className="text-left p-2.5 border border-gray-200 font-semibold text-gray-700">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cookies.map((c, i) => (
            <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
              <td className="p-2.5 border border-gray-200 font-mono text-gray-700 whitespace-nowrap">{c.name}</td>
              <td className="p-2.5 border border-gray-200 text-gray-600">{c.provider}</td>
              <td className="p-2.5 border border-gray-200 text-gray-600">{c.purpose}</td>
              <td className="p-2.5 border border-gray-200 text-gray-600 whitespace-nowrap">{c.type}</td>
              <td className="p-2.5 border border-gray-200 text-gray-600 whitespace-nowrap">{c.duration}</td>
              <td className="p-2.5 border border-gray-200 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.consent === "No requerido" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                }`}>
                  {c.consent}
                </span>
              </td>
              <td className="p-2.5 border border-gray-200 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"
                }`}>
                  {c.active ? "Activa" : "Pendiente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
