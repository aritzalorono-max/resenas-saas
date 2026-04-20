import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información sobre el uso de cookies en ReseñasYa conforme a la normativa europea.",
  alternates: { canonical: "/cookies" },
  robots: { index: false },
};

const LAST_UPDATED = "20 de abril de 2026";
const COMPANY      = "ReseñasYa S.L.";
const EMAIL        = "privacidad@resenasya.com";

export default function CookiesPage() {
  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">Documento legal</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Política de Cookies</h1>
        <p className="text-sm text-gray-400">Última actualización: {LAST_UPDATED}</p>
      </header>

      <Section title="1. ¿Qué son las cookies?">
        <p>
          Una cookie es un pequeño archivo de texto que un sitio web guarda en tu navegador cuando lo visitas.
          Las cookies permiten que el sitio web recuerde tus acciones y preferencias (como el inicio de sesión,
          el idioma o el tamaño de fuente) durante un período de tiempo, de modo que no tengas que volver a
          introducir esa información cada vez que visites el sitio o navegues de una página a otra.
        </p>
        <p>
          En cumplimiento del artículo 22.2 de la Ley 34/2002, de Servicios de la Sociedad de la Información
          (LSSICE), y de la Directiva 2009/136/CE (Directiva de cookies), {COMPANY} te informa sobre el uso de
          cookies en la plataforma <strong>ReseñasYa</strong>.
        </p>
      </Section>

      <Section title="2. Tipos de cookies que utilizamos">
        <p>
          Clasificamos las cookies según su finalidad y su origen:
        </p>

        <SubTitle>2.1 Cookies estrictamente necesarias</SubTitle>
        <p>
          Son imprescindibles para el funcionamiento de la plataforma. Sin ellas, servicios como la autenticación
          o la seguridad de sesión no serían posibles. No requieren consentimiento previo conforme a la normativa
          aplicable.
        </p>
        <CookieTable cookies={[
          {
            name: "sb-access-token",
            provider: "Supabase",
            purpose: "Gestión de la sesión autenticada del usuario en la plataforma.",
            type: "Primera parte",
            duration: "Sesión / 1 hora",
            consent: "No requerido",
          },
          {
            name: "sb-refresh-token",
            provider: "Supabase",
            purpose: "Renovación automática de la sesión del usuario.",
            type: "Primera parte",
            duration: "30 días",
            consent: "No requerido",
          },
          {
            name: "__Host-next-auth.csrf-token",
            provider: "Next.js",
            purpose: "Protección contra ataques CSRF (Cross-Site Request Forgery).",
            type: "Primera parte",
            duration: "Sesión",
            consent: "No requerido",
          },
        ]} />

        <SubTitle>2.2 Cookies de preferencias</SubTitle>
        <p>
          Permiten recordar las preferencias del usuario para mejorar su experiencia. En nuestra plataforma
          utilizamos el almacenamiento local (localStorage) del navegador —no cookies propiamente dichas— para
          recordar el país seleccionado en el formulario de envío de solicitudes.
        </p>
        <CookieTable cookies={[
          {
            name: "resenas_ya_country",
            provider: "ReseñasYa (localStorage)",
            purpose: "Recuerda el prefijo de país seleccionado por el usuario en el selector de teléfono para no tener que volver a elegirlo.",
            type: "Primera parte (localStorage)",
            duration: "Persistente hasta borrado manual",
            consent: "No requerido (no es cookie)",
          },
        ]} />

        <SubTitle>2.3 Cookies analíticas</SubTitle>
        <p>
          Actualmente <strong>no utilizamos</strong> cookies analíticas de terceros (como Google Analytics).
          El análisis de uso del servicio se realiza con datos agregados y anonimizados almacenados internamente,
          sin necesidad de cookies de seguimiento externas.
        </p>

        <SubTitle>2.4 Cookies de marketing y publicidad</SubTitle>
        <p>
          <strong>No utilizamos</strong> cookies de marketing, publicidad comportamental ni de seguimiento
          entre sitios web.
        </p>
      </Section>

      <Section title="3. Cookies de terceros">
        <p>
          La plataforma no carga cookies de terceros con fines publicitarios. Las únicas cookies de terceros
          presentes son las de Supabase para la gestión de sesiones, descritas en el apartado anterior.
        </p>
        <p>
          Si accedes a enlace externos presentes en la plataforma (como el enlace a tu perfil de Google Maps),
          los sitios de destino pueden establecer sus propias cookies conforme a sus respectivas políticas.
          {COMPANY} no controla ni es responsable de dichas cookies.
        </p>
      </Section>

      <Section title="4. Base legal para el uso de cookies">
        <p>Las cookies que utilizamos se amparan en las siguientes bases legales:</p>
        <ul>
          <li>
            <strong>Interés legítimo / necesidad técnica:</strong> las cookies estrictamente necesarias para
            el funcionamiento del servicio (autenticación, seguridad CSRF) no requieren consentimiento previo,
            dado que son imprescindibles para prestar el servicio solicitado por el usuario.
          </li>
          <li>
            <strong>Consentimiento:</strong> si en el futuro incorporásemos cookies analíticas o de publicidad,
            se solicitará el consentimiento expreso e informado del usuario antes de instalarlas.
          </li>
        </ul>
      </Section>

      <Section title="5. Cómo gestionar y desactivar las cookies">
        <p>
          Puedes gestionar, bloquear o eliminar las cookies a través de la configuración de tu navegador.
          Ten en cuenta que desactivar las cookies necesarias puede impedir el correcto funcionamiento de
          la plataforma (por ejemplo, no podrás iniciar sesión).
        </p>
        <p>Instrucciones según navegador:</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-2 not-prose">
          {[
            {
              browser: "Google Chrome",
              url: "https://support.google.com/chrome/answer/95647",
            },
            {
              browser: "Mozilla Firefox",
              url: "https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web",
            },
            {
              browser: "Apple Safari",
              url: "https://support.apple.com/es-es/guide/safari/sfri11471/mac",
            },
            {
              browser: "Microsoft Edge",
              url: "https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09",
            },
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
        <p className="mt-3">
          Para inhabilitar el seguimiento de analíticas (cuando aplique), también puedes instalar el
          complemento de inhabilitación de Google Analytics:{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-600 hover:underline"
          >
            tools.google.com/dlpage/gaoptout
          </a>.
        </p>
      </Section>

      <Section title="6. Actualización de esta política">
        <p>
          {COMPANY} puede actualizar esta Política de Cookies cuando sea necesario, por ejemplo al incorporar
          nuevas funcionalidades que requieran el uso de cookies adicionales. Las actualizaciones se
          comunicarán mediante aviso en la plataforma o, en cambios sustanciales, por correo electrónico.
        </p>
        <p>
          Para cualquier consulta sobre cookies o privacidad, contacta con nosotros en:{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.
        </p>
      </Section>
    </article>
  );
}

interface Cookie {
  name: string;
  provider: string;
  purpose: string;
  type: string;
  duration: string;
  consent: string;
}

function CookieTable({ cookies }: { cookies: Cookie[] }) {
  return (
    <div className="overflow-x-auto mt-3 mb-4">
      <table className="w-full text-xs border-collapse min-w-[600px]">
        <thead>
          <tr className="bg-gray-50">
            {["Nombre", "Proveedor", "Finalidad", "Tipo", "Duración", "Consentimiento"].map((h) => (
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
