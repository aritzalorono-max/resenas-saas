import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ManageCookiesButton } from "@/components/cookies/ManageCookiesButton";

const COMPANY = "Buy & Click, SL";
const EMAIL   = "info@resenasya.com";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookies");
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
    alternates: { canonical: "/cookies" },
    robots: { index: false },
  };
}

export default async function CookiesPage() {
  const t = await getTranslations("cookies");

  const necessaryCookies = [
    {
      name: "sb-access-token",
      provider: "Supabase",
      purpose: t("c_sbAccess_purpose"),
      type: t("c_sbAccess_type"),
      duration: t("c_sbAccess_duration"),
      consentRequired: false,
      active: true,
    },
    {
      name: "sb-refresh-token",
      provider: "Supabase",
      purpose: t("c_sbRefresh_purpose"),
      type: t("c_sbRefresh_type"),
      duration: t("c_sbRefresh_duration"),
      consentRequired: false,
      active: true,
    },
    {
      name: "__Host-next-auth.csrf-token",
      provider: "Next.js",
      purpose: t("c_csrf_purpose"),
      type: t("c_csrf_type"),
      duration: t("c_csrf_duration"),
      consentRequired: false,
      active: true,
    },
    {
      name: "ry_cookie_consent",
      provider: "ResenasYa (localStorage)",
      purpose: t("c_ryConsent_purpose"),
      type: t("c_ryConsent_type"),
      duration: t("c_ryConsent_duration"),
      consentRequired: false,
      active: true,
    },
    {
      name: "resenas_ya_country",
      provider: "ResenasYa (localStorage)",
      purpose: t("c_ryCountry_purpose"),
      type: t("c_ryCountry_type"),
      duration: t("c_ryCountry_duration"),
      consentRequired: false,
      active: true,
    },
    {
      name: "__gb_oauth_state",
      provider: "ResenasYa",
      purpose: t("c_gbOauthState_purpose"),
      type: t("c_gbOauthState_type"),
      duration: t("c_gbOauthState_duration"),
      consentRequired: false,
      active: true,
    },
  ];

  const analyticsCookies = [
    {
      name: "_ga, _ga_*",
      provider: "Google Analytics 4",
      purpose: t("c_ga_purpose"),
      type: t("c_ga_type"),
      duration: t("c_ga_duration"),
      consentRequired: true,
      active: false,
    },
    {
      name: "va_*",
      provider: "Vercel Analytics",
      purpose: t("c_va_purpose"),
      type: t("c_va_type"),
      duration: t("c_va_duration"),
      consentRequired: true,
      active: false,
    },
  ];

  const marketingCookies = [
    {
      name: "_fbp, _fbc",
      provider: "Meta Pixel (Facebook / Instagram)",
      purpose: t("c_fbp_purpose"),
      type: t("c_fbp_type"),
      duration: t("c_fbp_duration"),
      consentRequired: true,
      active: false,
    },
    {
      name: "li_sugr, bcookie",
      provider: "LinkedIn Insight Tag",
      purpose: t("c_li_purpose"),
      type: t("c_li_type"),
      duration: t("c_li_duration"),
      consentRequired: true,
      active: false,
    },
    {
      name: "_gcl_au, _gcl_aw",
      provider: "Google Ads",
      purpose: t("c_gcl_purpose"),
      type: t("c_gcl_type"),
      duration: t("c_gcl_duration"),
      consentRequired: true,
      active: false,
    },
  ];

  const tableHeaders = [
    t("thName"), t("thProvider"), t("thPurpose"),
    t("thType"), t("thDuration"), t("thConsent"), t("thStatus"),
  ];

  const consentLabels = {
    required: t("consentRequired"),
    notRequired: t("consentNotRequired"),
  };

  const statusLabels = {
    active: t("statusActive"),
    pending: t("statusPending"),
  };

  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("legalDoc")}</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t("pageTitle")}</h1>
        <p className="text-sm text-gray-500">{t("lastUpdatedLabel")} {t("lastUpdatedDate")}</p>

        <div className="mt-4 inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-500">{t("managePrefsPrompt")}</span>
          <ManageCookiesButton />
        </div>
      </header>

      <Section title={t("s1Title")}>
        <p>{t("s1p1")}</p>
        <p>
          {t.rich("s1p2", {
            company: () => COMPANY,
            strong: (c) => <strong key="s1p2strong">{c}</strong>,
          })}
        </p>
      </Section>

      <Section title={t("s2Title")}>
        <SubTitle>{t("s2_1Title")}</SubTitle>
        <p>{t("s2_1p1")}</p>
        <CookieTable cookies={necessaryCookies} headers={tableHeaders} consentLabels={consentLabels} statusLabels={statusLabels} />

        <SubTitle>{t("s2_2Title")}</SubTitle>
        <p>{t("s2_2p1")}</p>
        <p><em>{t("s2_2p2")}</em></p>
        <CookieTable cookies={analyticsCookies} headers={tableHeaders} consentLabels={consentLabels} statusLabels={statusLabels} />

        <SubTitle>{t("s2_3Title")}</SubTitle>
        <p>{t("s2_3p1")}</p>
        <p><em>{t("s2_3p2")}</em></p>
        <CookieTable cookies={marketingCookies} headers={tableHeaders} consentLabels={consentLabels} statusLabels={statusLabels} />
      </Section>

      <Section title={t("s3Title")}>
        <p>{t("s3p1")}</p>
        <ul>
          <li>{t("s3l1")}</li>
          <li>{t("s3l2")}</li>
          <li>{t("s3l3")}</li>
        </ul>
        <p>
          {t.rich("s3p2", { company: () => COMPANY })}
        </p>
      </Section>

      <Section title={t("s4Title")}>
        <ul>
          <li>
            <strong>{t("s4l1Title")}</strong>{" "}{t("s4l1Desc")}
          </li>
          <li>
            <strong>{t("s4l2Title")}</strong>{" "}{t("s4l2Desc")}
          </li>
        </ul>
      </Section>

      <Section title={t("s5Title")}>
        <p>{t("s5p1")}</p>
        <p>{t("s5p2")}</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-2 not-prose">
          {[
            { browser: "Google Chrome",   url: "https://support.google.com/chrome/answer/95647" },
            { browser: "Mozilla Firefox", url: "https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" },
            { browser: "Apple Safari",    url: "https://support.apple.com/guide/safari/sfri11471/mac" },
            { browser: "Microsoft Edge",  url: "https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" },
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

      <Section title={t("s6Title")}>
        <p>{t.rich("s6p1", { company: () => COMPANY })}</p>
        <p>
          {t("s6p2")}{" "}
          <a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>
        </p>
      </Section>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Presentation components
// ---------------------------------------------------------------------------

interface Cookie {
  name: string;
  provider: string;
  purpose: string;
  type: string;
  duration: string;
  consentRequired: boolean;
  active: boolean;
}

interface Labels {
  required: string;
  notRequired: string;
}

interface StatusLabels {
  active: string;
  pending: string;
}

function CookieTable({ cookies, headers, consentLabels, statusLabels }: {
  cookies: Cookie[];
  headers: string[];
  consentLabels: Labels;
  statusLabels: StatusLabels;
}) {
  return (
    <div className="overflow-x-auto mt-3 mb-4">
      <table className="w-full text-xs border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-gray-50">
            {headers.map((h) => (
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
                  c.consentRequired ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                }`}>
                  {c.consentRequired ? consentLabels.required : consentLabels.notRequired}
                </span>
              </td>
              <td className="p-2.5 border border-gray-200 whitespace-nowrap">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  c.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {c.active ? statusLabels.active : statusLabels.pending}
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
