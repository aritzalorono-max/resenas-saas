import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates, buildUrl, APP_URL } from "@/lib/seo";
import { CONTACT } from "@/lib/constants";

const COMPANY     = CONTACT.COMPANY;
const EMAIL_LEGAL = CONTACT.EMAIL;
const PHONE       = CONTACT.PHONE;

export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([getTranslations("privacy"), getLocale()]);
  const title = t("metaTitle");
  const description = t("metaDesc");
  const url = buildUrl("/privacidad", locale);
  return {
    title,
    description,
    alternates: { canonical: url, languages: hreflangAlternates("/privacidad") },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PrivacidadPage() {
  const t = await getTranslations("privacy");
  const strong = (c: React.ReactNode) => <strong>{c}</strong>;

  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{t("legalDoc")}</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{t("pageTitle")}</h1>
        <p className="text-sm text-gray-400">{t("lastUpdatedLabel")} {t("lastUpdatedDate")}</p>
      </header>

      {/* ── LEGAL NOTICE ─────────────────────────────────────────────── */}
      <div className="mb-3">
        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
          {t("legalNoticeTag")}
        </span>
      </div>

      <Section title={t("s1Title")}>
        <Table rows={[
          [t("s1_companyNameK"), COMPANY],
          [t("s1_legalFormK"), t("s1_legalFormV")],
          [t("s1_cifK"), "B-95612958"],
          [t("s1_addressK"), "Avda. Ribera de Axpe 11, 2D - 202. 48950 Erandio (Bizkaia)"],
          [t("s1_registryK"), "R.M. de Vizcaya, Tomo 5138, Folio 19, Inscripción 1.ª, Hoja BI-56789"],
          [t("s1_trademarkK"), t("s1_trademarkV")],
          [t("s1_emailK"), EMAIL_LEGAL],
          [t("s1_phoneK"), PHONE],
          [t("s1_webK"), APP_URL],
          [t("s1_activityK"), t("s1_activityV")],
        ]} />
        <p>{t("s1p1")}</p>
      </Section>

      <Section title={t("s2Title")}>
        <p>{t.rich("s2p1", { strong, company: COMPANY, appUrl: APP_URL })}</p>
      </Section>

      <Section title={t("s3Title")}>
        <p>{t("s3p1", { company: COMPANY })}</p>
        <p>{t("s3p2", { company: COMPANY })}</p>
      </Section>

      <Section title={t("s4Title")}>
        <p>{t("s4p1", { company: COMPANY })}</p>
        <p>{t("s4p2")}</p>
      </Section>

      <Section title={t("s5Title")}>
        <p>{t("s5p1")}</p>
      </Section>

      {/* ── PRIVACY POLICY ───────────────────────────────────────────── */}
      <div className="mt-12 mb-3">
        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
          {t("privacyTag")}
        </span>
      </div>

      <Section title={t("s6Title")}>
        <Table rows={[
          [t("s6_respK"), COMPANY],
          [t("s6_purposeK"), t("s6_purposeV")],
          [t("s6_dpoK"), EMAIL_LEGAL],
          [t("s6_authK"), t("s6_authV")],
        ]} />
      </Section>

      <Section title={t("s7Title")}>
        <p>{t("s7intro")}</p>
        <SubTitle>{t("s7_1Title")}</SubTitle>
        <ul>
          <li>{t.rich("s7_1l0", { strong })}</li>
          <li>{t.rich("s7_1l1", { strong })}</li>
          <li>{t.rich("s7_1l2", { strong })}</li>
          <li>{t.rich("s7_1l3", { strong, company: COMPANY })}</li>
        </ul>
        <SubTitle>{t("s7_2Title")}</SubTitle>
        <p>{t("s7_2intro")}</p>
        <ul>
          <li>{t.rich("s7_2l0", { strong, company: COMPANY })}</li>
          <li>{t("s7_2l1")}</li>
          <li>{t("s7_2l2")}</li>
          <li>{t.rich("s7_2l3", { strong })}</li>
        </ul>
      </Section>

      <Section title={t("s8Title")}>
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{t("s8thPurpose")}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{t("s8thBasis")}</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["s8_r0p", "s8_r0b"],
              ["s8_r1p", "s8_r1b"],
              ["s8_r2p", "s8_r2b"],
              ["s8_r3p", "s8_r3b"],
              ["s8_r4p", "s8_r4b"],
              ["s8_r5p", "s8_r5b"],
            ] as const).map(([kp, kb], i) => (
              <tr key={kp} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="p-3 border border-gray-200 text-gray-600">{t(kp)}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{t(kb)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title={t("s9Title")}>
        <p>{t("s9intro", { company: COMPANY })}</p>
        <table className="w-full text-sm border-collapse mt-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{t("s9thProv")}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{t("s9thServ")}</th>
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700">{t("s9thCountry")}</th>
            </tr>
          </thead>
          <tbody>
            {([
              ["Supabase, Inc.", "s9_r0s"],
              ["Twilio Inc.", "s9_r1s"],
              ["Anthropic, PBC", "s9_r2s"],
              ["Vercel Inc.", "s9_r3s"],
              ["Stripe, Inc.", "s9_r4s"],
              ["Google LLC", "s9_r5s"],
            ] as const).map(([prov, ks], i) => (
              <tr key={prov} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="p-3 border border-gray-200 text-gray-600 font-medium">{prov}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{t(ks)}</td>
                <td className="p-3 border border-gray-200 text-gray-600">{t("s9_sccs")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3">{t("s9footer")}</p>
      </Section>

      <Section title={t("s10Title")}>
        <ul>
          {(["s10l0", "s10l1", "s10l2", "s10l3"] as const).map((key) => (
            <li key={key}>{t.rich(key, { strong })}</li>
          ))}
        </ul>
      </Section>

      <Section title={t("s11Title")}>
        <p>{t("s11intro", { email: EMAIL_LEGAL })}</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-3 not-prose">
          {([
              ["s11_r0title", "s11_r0desc"],
              ["s11_r1title", "s11_r1desc"],
              ["s11_r2title", "s11_r2desc"],
              ["s11_r3title", "s11_r3desc"],
              ["s11_r4title", "s11_r4desc"],
              ["s11_r5title", "s11_r5desc"],
              ["s11_r6title", "s11_r6desc"],
              ["s11_r7title", "s11_r7desc"],
            ] as const).map(([kt, kd]) => (
            <div key={kt} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="font-semibold text-gray-800 text-sm">{t(kt)}</p>
              <p className="text-xs text-gray-500 mt-0.5">{t(kd)}</p>
            </div>
          ))}
        </div>
        <p className="mt-3">{t("s11footer")}</p>
      </Section>

      <Section title={t("s12Title")}>
        <p>{t("s12intro", { company: COMPANY })}</p>
        <ul>
          {(["s12l0", "s12l1", "s12l2", "s12l3", "s12l4", "s12l5"] as const).map((key) => (
            <li key={key}>{t(key)}</li>
          ))}
        </ul>
        <p>{t("s12p2", { company: COMPANY })}</p>
      </Section>

      <Section title={t("s13Title")}>
        <p>{t("s13p1", { company: COMPANY })}</p>
        <p>
          {t("s13p2")}{" "}
          <a href={`mailto:${EMAIL_LEGAL}`} className="text-brand-600 hover:underline">{EMAIL_LEGAL}</a>.
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
