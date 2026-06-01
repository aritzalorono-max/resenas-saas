import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localizedPath } from "@/lib/localized-paths";
import { getTermsContent } from "@/content/terms-content";

const COMPANY  = "Buy & Click, SL";
const EMAIL    = "contacto.resenasya@gmail.com";
const APP_URL  = "https://resenasya.com";
const ODR_URL  = "https://ec.europa.eu/consumers/odr";
const BILLING_PATH = "/facturacion";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const c = getTermsContent(locale);
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: { canonical: "/terminos" },
    robots: { index: true, follow: true },
  };
}

export default async function TerminosPage() {
  const locale = await getLocale();
  const c = getTermsContent(locale);

  return (
    <article>
      <header className="mb-10 pb-6 border-b border-gray-100">
        <p className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">{c.legalDoc}</p>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{c.pageTitle}</h1>
        <p className="text-sm text-gray-400">{c.lastUpdatedDate}</p>
      </header>

      {/* Section 1 — always rendered with hardcoded JSX for inline links */}
      <Section title={locale === "es" ? "1. Información general" :
                      locale === "en" ? "1. General information" :
                      locale === "fr" ? "1. Informations générales" :
                      locale === "de" ? "1. Allgemeine Informationen" :
                      locale === "it" ? "1. Informazioni generali" :
                                        "1. Informações gerais"}>
        <p>
          {locale === "es" ? <>El presente documento establece los Términos y Condiciones de uso (en adelante, &quot;las Condiciones&quot;) que regulan el acceso y la utilización del servicio <strong>ResenasYa</strong>, disponible en{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (en adelante, &quot;la Plataforma&quot;), titularidad de <strong>{COMPANY}</strong>, empresa debidamente constituida conforme a la legislación española, con CIF <strong>B-95612958</strong>, domicilio social en <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, inscrita en el Registro Mercantil de Vizcaya, Tomo 5138, Folio 19, Inscripción 1.ª, Hoja BI-56789, y correo electrónico de contacto:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</> :
           locale === "en" ? <>This document sets out the Terms and Conditions of Use (hereinafter, &quot;the Conditions&quot;) governing access to and use of the <strong>ResenasYa</strong> service, available at{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (hereinafter, &quot;the Platform&quot;), owned by <strong>{COMPANY}</strong>, duly incorporated under Spanish law, with tax ID (CIF) <strong>B-95612958</strong>, registered office at <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, registered in the Commercial Register of Biscay, Volume 5138, Sheet 19, Entry 1, Folio BI-56789, and contact email:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</> :
           locale === "fr" ? <>Le présent document établit les Conditions Générales d&apos;Utilisation (ci-après, &quot;les Conditions&quot;) régissant l&apos;accès et l&apos;utilisation du service <strong>ResenasYa</strong>, disponible à l&apos;adresse{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (ci-après, &quot;la Plateforme&quot;), appartenant à <strong>{COMPANY}</strong>, société dûment constituée conformément à la législation espagnole, avec numéro fiscal (CIF) <strong>B-95612958</strong>, siège social à <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, inscrite au Registre du Commerce de Biscaye, et e-mail de contact :{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</> :
           locale === "de" ? <>Dieses Dokument legt die Allgemeinen Geschäftsbedingungen (nachfolgend &quot;Bedingungen&quot;) fest, die den Zugang zu und die Nutzung des Dienstes <strong>ResenasYa</strong> unter{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (nachfolgend &quot;die Plattform&quot;) regeln, im Eigentum von <strong>{COMPANY}</strong>, ordnungsgemäß nach spanischem Recht gegründet, mit Steuer-ID (CIF) <strong>B-95612958</strong>, eingetragene Adresse: <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, und Kontakt-E-Mail:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</> :
           locale === "it" ? <>Il presente documento stabilisce i Termini e Condizioni d&apos;Uso (di seguito, &quot;le Condizioni&quot;) che regolano l&apos;accesso e l&apos;utilizzo del servizio <strong>ResenasYa</strong>, disponibile all&apos;indirizzo{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (di seguito, &quot;la Piattaforma&quot;), di proprietà di <strong>{COMPANY}</strong>, società debitamente costituita ai sensi della legislazione spagnola, con codice fiscale (CIF) <strong>B-95612958</strong>, sede legale presso <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, e indirizzo e-mail di contatto:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</> :
                             <>O presente documento estabelece os Termos e Condições de Utilização (doravante, &quot;as Condições&quot;) que regulam o acesso e a utilização do serviço <strong>ResenasYa</strong>, disponível em{" "}<a href={APP_URL} className="text-brand-600 hover:underline">{APP_URL}</a> (doravante, &quot;a Plataforma&quot;), propriedade de <strong>{COMPANY}</strong>, empresa devidamente constituída ao abrigo da legislação espanhola, com NIF (CIF) <strong>B-95612958</strong>, sede social em <strong>Avda. Ribera de Axpe 11, 2D - 202, 48950 Erandio (Bizkaia)</strong>, e e-mail de contacto:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a>.</>
          }
        </p>
        <p>
          {locale === "es" ? <>La marca <strong>ResenasYa</strong> es titularidad de <strong>{COMPANY}</strong>, registrada en la Oficina Española de Patentes y Marcas bajo la denominación <em>Buy &amp; Click</em>.</> :
           locale === "en" ? <>The <strong>ResenasYa</strong> trademark is owned by <strong>{COMPANY}</strong>, registered at the Spanish Patent and Trademark Office under the name <em>Buy &amp; Click</em>.</> :
           locale === "fr" ? <>La marque <strong>ResenasYa</strong> est la propriété de <strong>{COMPANY}</strong>, enregistrée à l&apos;Office Espagnol des Brevets et des Marques sous la dénomination <em>Buy &amp; Click</em>.</> :
           locale === "de" ? <>Die Marke <strong>ResenasYa</strong> ist Eigentum von <strong>{COMPANY}</strong>, eingetragen beim Spanischen Patent- und Markenamt unter dem Namen <em>Buy &amp; Click</em>.</> :
           locale === "it" ? <>Il marchio <strong>ResenasYa</strong> è di proprietà di <strong>{COMPANY}</strong>, registrato presso l&apos;Ufficio Spagnolo dei Brevetti e dei Marchi con la denominazione <em>Buy &amp; Click</em>.</> :
                             <>A marca <strong>ResenasYa</strong> é propriedade de <strong>{COMPANY}</strong>, registada no Instituto Nacional de Propriedade Industrial espanhol sob a denominação <em>Buy &amp; Click</em>.</>
          }
        </p>
        <p>
          {locale === "es" ? "Al registrarte y utilizar la Plataforma, aceptas íntegramente estas Condiciones. Si no estás de acuerdo con alguno de sus términos, deberás abstenerte de usar el servicio." :
           locale === "en" ? "By registering and using the Platform, you fully accept these Conditions. If you do not agree with any of their terms, you must refrain from using the service." :
           locale === "fr" ? "En vous inscrivant et en utilisant la Plateforme, vous acceptez intégralement les présentes Conditions. Si vous n'êtes pas d'accord avec l'un de leurs termes, vous devez vous abstenir d'utiliser le service." :
           locale === "de" ? "Durch die Registrierung und Nutzung der Plattform akzeptieren Sie diese Bedingungen vollständig. Wenn Sie mit einem der Bedingungen nicht einverstanden sind, müssen Sie auf die Nutzung des Dienstes verzichten." :
           locale === "it" ? "Registrandoti e utilizzando la Piattaforma, accetti integralmente le presenti Condizioni. Se non sei d'accordo con uno dei loro termini, devi astenerti dall'utilizzare il servizio." :
                             "Ao registar-se e utilizar a Plataforma, aceita integralmente as presentes Condições. Se não concordar com algum dos seus termos, deve abster-se de utilizar o serviço."
          }
        </p>
      </Section>

      {/* Sections 2–11, 13–16 from locale data */}
      {c.sections.map((section) => (
        <Section key={section.title} title={section.title}>
          {section.content.map((para, i) =>
            para.startsWith("•") ? (
              <ul key={i} className="list-none space-y-1.5 pl-0">
                {para.split("\n").map((item, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-brand-500 shrink-0">›</span>
                    <span>{item.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p key={i}>{para}</p>
            )
          )}
        </Section>
      ))}

      {/* Section 12 — Subscription (always Spanish-structured, translated inline) */}
      <Section title={
        locale === "es" ? "12. Suscripción, facturación y cancelación" :
        locale === "en" ? "12. Subscription, billing and cancellation" :
        locale === "fr" ? "12. Abonnement, facturation et résiliation" :
        locale === "de" ? "12. Abonnement, Abrechnung und Kündigung" :
        locale === "it" ? "12. Abbonamento, fatturazione e cancellazione" :
                          "12. Subscrição, faturação e cancelamento"
      }>
        <SubscriptionSection locale={locale} email={EMAIL} billingPath={BILLING_PATH} />
      </Section>

      {/* Section 17 — Contact */}
      <Section title={
        locale === "es" ? "17. Contacto" :
        locale === "en" ? "17. Contact" :
        locale === "fr" ? "17. Contact" :
        locale === "de" ? "17. Kontakt" :
        locale === "it" ? "17. Contatto" :
                          "17. Contacto"
      }>
        <p>
          {locale === "es" ? <>Para cualquier consulta relacionada con estas Condiciones, puedes contactarnos en:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> o a través de{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">nuestro formulario de contacto</Link>.</> :
           locale === "en" ? <>For any queries related to these Conditions, you can contact us at:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> or via{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">our contact form</Link>.</> :
           locale === "fr" ? <>Pour toute question relative aux présentes Conditions, vous pouvez nous contacter à :{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> ou via{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">notre formulaire de contact</Link>.</> :
           locale === "de" ? <>Bei Fragen zu diesen Bedingungen können Sie uns unter{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> oder über{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">unser Kontaktformular</Link> erreichen.</> :
           locale === "it" ? <>Per qualsiasi domanda relativa alle presenti Condizioni, potete contattarci a:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> o tramite{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">il nostro modulo di contatto</Link>.</> :
                             <>Para qualquer questão relacionada com as presentes Condições, pode contactar-nos em:{" "}<a href={`mailto:${EMAIL}`} className="text-brand-600 hover:underline">{EMAIL}</a> ou através do{" "}<Link href={localizedPath("/contacto", locale)} className="text-brand-600 hover:underline">nosso formulário de contacto</Link>.</>
          }
        </p>
      </Section>

      {/* ODR link for EU consumers */}
      <p className="text-xs text-gray-400 mt-6">
        {locale === "es" ? "Resolución de litigios en línea UE: " :
         locale === "en" ? "EU online dispute resolution: " :
         locale === "fr" ? "Résolution des litiges en ligne UE : " :
         locale === "de" ? "EU Online-Streitbeilegung: " :
         locale === "it" ? "Risoluzione delle controversie online UE: " :
                           "Resolução de litígios em linha UE: "
        }
        <a href={ODR_URL} className="text-brand-600 hover:underline" target="_blank" rel="noopener noreferrer">{ODR_URL}</a>
      </p>
    </article>
  );
}

function SubscriptionSection({ locale, email, billingPath }: { locale: string; email: string; billingPath: string }) {
  const labels = {
    es: {
      nature: "Naturaleza del servicio:", natureDesc: "ResenasYa funciona exclusivamente mediante suscripción mensual de pago. No existe periodo de prueba gratuito salvo indicación expresa en la página de precios.",
      autoTitle: "Renovación automática:",
      autoL: ["La suscripción se renueva automáticamente cada mes en la misma fecha en que fue contratada originalmente.", "El importe se cargará automáticamente al método de pago registrado.", "Este proceso se repetirá indefinidamente hasta que el usuario cancele expresamente su suscripción.", "El usuario recibirá una factura por correo electrónico tras cada cargo exitoso."],
      cancelTitle: "Cómo cancelar la suscripción:",
      cancelIntro: "El usuario puede cancelar su suscripción en cualquier momento siguiendo estos pasos:",
      cancelSteps: ["Acceder al panel de su cuenta en Facturación.", 'Hacer clic en el botón "Gestionar suscripción".', 'En el portal de Stripe, seleccionar "Cancelar plan" y confirmar la cancelación.'],
      cancelOr: "También puede contactar con nosotros en",
      effectsTitle: "Efectos de la cancelación:",
      effectsL: ["La cancelación debe realizarse antes de que finalice el período de facturación en curso.", "Una vez cancelada, la suscripción no se renovará en la siguiente fecha de cobro.", "El usuario mantendrá acceso al servicio hasta el final del período de facturación ya pagado.", "No se realizarán reembolsos por los períodos de facturación ya cobrados, salvo que la legislación aplicable lo exija."],
      changePlanTitle: "Cambios de plan:",
      changePlanL: ["El usuario puede cambiar de plan en cualquier momento desde la sección de Facturación.", "Los cambios de plan se aplicarán en el siguiente período de facturación."],
      priceTitle: "Modificación de precios:",
      priceL: ["Buy & Click, SL se reserva el derecho a modificar los precios con un preaviso mínimo de 30 días, notificado por correo electrónico.", "Si el usuario no está de acuerdo con el nuevo precio, podrá cancelar su suscripción antes de la fecha de entrada en vigor del cambio.", "El uso continuado del servicio tras la entrada en vigor del nuevo precio implica la aceptación del mismo."],
      nonPayTitle: "Impago:",
      nonPayL: ["En caso de que el cargo automático no pueda realizarse, Buy & Click, SL intentará el cobro de nuevo durante un período determinado.", "Si el impago persiste, Buy & Click, SL se reserva el derecho a suspender o cancelar el acceso al servicio."],
    },
    en: {
      nature: "Nature of the service:", natureDesc: "ResenasYa operates exclusively on a monthly paid subscription basis. There is no free trial period unless expressly indicated on the pricing page.",
      autoTitle: "Automatic renewal:",
      autoL: ["The subscription renews automatically each month on the same date it was originally contracted.", "The amount will be automatically charged to the registered payment method.", "This process will repeat indefinitely until the user expressly cancels their subscription.", "The user will receive an invoice by email after each successful charge."],
      cancelTitle: "How to cancel your subscription:",
      cancelIntro: "The user can cancel their subscription at any time by following these steps:",
      cancelSteps: ["Access your account panel at Billing.", 'Click the "Manage subscription" button.', 'In the Stripe portal, select "Cancel plan" and confirm the cancellation.'],
      cancelOr: "You can also contact us at",
      effectsTitle: "Effects of cancellation:",
      effectsL: ["Cancellation must be made before the end of the current billing period to avoid automatic charge.", "Once cancelled, the subscription will not renew on the next billing date.", "The user will retain access to the service until the end of the already paid billing period.", "No refunds will be made for billing periods already charged, unless required by applicable law."],
      changePlanTitle: "Plan changes:",
      changePlanL: ["The user can change plan at any time from the Billing section.", "Plan changes will take effect in the next billing period."],
      priceTitle: "Price changes:",
      priceL: ["Buy & Click, SL reserves the right to modify prices with a minimum of 30 days' notice by email.", "If the user does not agree with the new price, they may cancel their subscription before the change takes effect.", "Continued use of the service after the new price takes effect implies acceptance thereof."],
      nonPayTitle: "Non-payment:",
      nonPayL: ["If the automatic charge cannot be made, Buy & Click, SL will retry collection during a set period.", "If non-payment persists, Buy & Click, SL reserves the right to suspend or cancel access to the service."],
    },
    fr: {
      nature: "Nature du service :", natureDesc: "ResenasYa fonctionne exclusivement par abonnement mensuel payant. Il n'y a pas de période d'essai gratuite sauf indication expresse sur la page des tarifs.",
      autoTitle: "Renouvellement automatique :",
      autoL: ["L'abonnement se renouvelle automatiquement chaque mois à la même date que la souscription initiale.", "Le montant sera automatiquement débité du moyen de paiement enregistré.", "Ce processus se répétera indéfiniment jusqu'à ce que l'utilisateur annule expressément son abonnement.", "L'utilisateur recevra une facture par e-mail après chaque débit réussi."],
      cancelTitle: "Comment résilier votre abonnement :",
      cancelIntro: "L'utilisateur peut résilier son abonnement à tout moment en suivant ces étapes :",
      cancelSteps: ["Accéder au panneau de compte dans Facturation.", 'Cliquer sur le bouton "Gérer l\'abonnement".', 'Dans le portail Stripe, sélectionner "Annuler le plan" et confirmer la résiliation.'],
      cancelOr: "Vous pouvez également nous contacter à",
      effectsTitle: "Effets de la résiliation :",
      effectsL: ["La résiliation doit être effectuée avant la fin de la période de facturation en cours.", "Une fois résilié, l'abonnement ne sera pas renouvelé à la prochaine date de facturation.", "L'utilisateur conservera l'accès au service jusqu'à la fin de la période de facturation déjà payée.", "Aucun remboursement ne sera effectué pour les périodes de facturation déjà débitées."],
      changePlanTitle: "Changements de plan :",
      changePlanL: ["L'utilisateur peut changer de plan à tout moment depuis la section Facturation.", "Les changements de plan s'appliqueront à la prochaine période de facturation."],
      priceTitle: "Modification des prix :",
      priceL: ["Buy & Click, SL se réserve le droit de modifier les prix avec un préavis minimum de 30 jours par e-mail.", "Si l'utilisateur n'est pas d'accord avec le nouveau prix, il peut résilier son abonnement avant la date d'entrée en vigueur.", "L'utilisation continue du service après l'entrée en vigueur du nouveau prix implique son acceptation."],
      nonPayTitle: "Non-paiement :",
      nonPayL: ["Si le débit automatique ne peut pas être effectué, Buy & Click, SL tentera à nouveau le paiement pendant une période déterminée.", "Si le non-paiement persiste, Buy & Click, SL se réserve le droit de suspendre ou d'annuler l'accès au service."],
    },
    de: {
      nature: "Art des Dienstes:", natureDesc: "ResenasYa funktioniert ausschließlich im Rahmen eines monatlichen kostenpflichtigen Abonnements. Es gibt keine kostenlose Testphase, sofern nicht ausdrücklich auf der Preisseite angegeben.",
      autoTitle: "Automatische Verlängerung:",
      autoL: ["Das Abonnement verlängert sich automatisch monatlich am ursprünglichen Vertragsdatum.", "Der Betrag wird automatisch vom registrierten Zahlungsmittel abgebucht.", "Dieser Vorgang wiederholt sich unbegrenzt, bis der Nutzer sein Abonnement ausdrücklich kündigt.", "Der Nutzer erhält nach jeder erfolgreichen Zahlung eine Rechnung per E-Mail."],
      cancelTitle: "So kündigen Sie Ihr Abonnement:",
      cancelIntro: "Der Nutzer kann sein Abonnement jederzeit durch folgende Schritte kündigen:",
      cancelSteps: ["Zugriff auf das Kontopanel unter Abrechnung.", 'Klick auf die Schaltfläche "Abonnement verwalten".', 'Im Stripe-Portal "Plan kündigen" auswählen und die Kündigung bestätigen.'],
      cancelOr: "Sie können uns auch unter folgender Adresse kontaktieren:",
      effectsTitle: "Folgen der Kündigung:",
      effectsL: ["Die Kündigung muss vor Ablauf des laufenden Abrechnungszeitraums erfolgen.", "Nach der Kündigung wird das Abonnement zum nächsten Abrechnungsdatum nicht verlängert.", "Der Nutzer behält bis zum Ende des bereits bezahlten Abrechnungszeitraums Zugang zum Dienst.", "Es werden keine Rückerstattungen für bereits abgerechnete Zeiträume gewährt."],
      changePlanTitle: "Planwechsel:",
      changePlanL: ["Der Nutzer kann jederzeit aus dem Bereich Abrechnung den Plan wechseln.", "Planwechsel gelten ab dem nächsten Abrechnungszeitraum."],
      priceTitle: "Preisänderungen:",
      priceL: ["Buy & Click, SL behält sich das Recht vor, Preise mit einer Mindestankündigungsfrist von 30 Tagen per E-Mail zu ändern.", "Wenn der Nutzer mit dem neuen Preis nicht einverstanden ist, kann er das Abonnement vor Inkrafttreten kündigen.", "Die weitere Nutzung des Dienstes nach Inkrafttreten des neuen Preises gilt als Zustimmung."],
      nonPayTitle: "Nichtzahlung:",
      nonPayL: ["Falls die automatische Belastung nicht möglich ist, wird Buy & Click, SL die Zahlung erneut versuchen.", "Bei anhaltender Nichtzahlung behält sich Buy & Click, SL das Recht vor, den Zugang zu sperren oder zu kündigen."],
    },
    it: {
      nature: "Natura del servizio:", natureDesc: "ResenasYa funziona esclusivamente tramite abbonamento mensile a pagamento. Non esiste un periodo di prova gratuito salvo indicazione espressa nella pagina dei prezzi.",
      autoTitle: "Rinnovo automatico:",
      autoL: ["L'abbonamento si rinnova automaticamente ogni mese nella stessa data della sottoscrizione originale.", "L'importo verrà addebitato automaticamente al metodo di pagamento registrato.", "Questo processo si ripeterà indefinitamente fino a quando l'utente non annullerà espressamente l'abbonamento.", "L'utente riceverà una fattura via e-mail dopo ogni addebito riuscito."],
      cancelTitle: "Come annullare l'abbonamento:",
      cancelIntro: "L'utente può annullare il proprio abbonamento in qualsiasi momento seguendo questi passaggi:",
      cancelSteps: ["Accedere al pannello dell'account in Fatturazione.", 'Fare clic sul pulsante "Gestisci abbonamento".', 'Nel portale Stripe, selezionare "Annulla piano" e confermare l\'annullamento.'],
      cancelOr: "Puoi anche contattarci a",
      effectsTitle: "Effetti della cancellazione:",
      effectsL: ["La cancellazione deve essere effettuata prima della fine del periodo di fatturazione corrente.", "Una volta annullato, l'abbonamento non si rinnoverà alla prossima data di fatturazione.", "L'utente manterrà l'accesso al servizio fino alla fine del periodo di fatturazione già pagato.", "Non verranno effettuati rimborsi per i periodi di fatturazione già addebitati."],
      changePlanTitle: "Cambio di piano:",
      changePlanL: ["L'utente può cambiare piano in qualsiasi momento dalla sezione Fatturazione.", "I cambi di piano si applicheranno nel prossimo periodo di fatturazione."],
      priceTitle: "Modifica dei prezzi:",
      priceL: ["Buy & Click, SL si riserva il diritto di modificare i prezzi con un preavviso minimo di 30 giorni via e-mail.", "Se l'utente non è d'accordo con il nuovo prezzo, può annullare l'abbonamento prima della data di entrata in vigore.", "L'uso continuato del servizio dopo l'entrata in vigore del nuovo prezzo implica l'accettazione dello stesso."],
      nonPayTitle: "Mancato pagamento:",
      nonPayL: ["Se l'addebito automatico non può essere effettuato, Buy & Click, SL tenterà nuovamente il pagamento per un periodo determinato.", "Se il mancato pagamento persiste, Buy & Click, SL si riserva il diritto di sospendere o annullare l'accesso al servizio."],
    },
    pt: {
      nature: "Natureza do serviço:", natureDesc: "ResenasYa funciona exclusivamente mediante subscrição mensal paga. Não existe período de teste gratuito salvo indicação expressa na página de preços.",
      autoTitle: "Renovação automática:",
      autoL: ["A subscrição renova-se automaticamente todos os meses na mesma data em que foi originalmente contratada.", "O montante será debitado automaticamente no método de pagamento registado.", "Este processo repetir-se-á indefinidamente até que o utilizador cancele expressamente a sua subscrição.", "O utilizador receberá uma fatura por e-mail após cada débito bem-sucedido."],
      cancelTitle: "Como cancelar a subscrição:",
      cancelIntro: "O utilizador pode cancelar a sua subscrição a qualquer momento seguindo estes passos:",
      cancelSteps: ["Aceder ao painel da conta em Faturação.", 'Clicar no botão "Gerir subscrição".', 'No portal Stripe, selecionar "Cancelar plano" e confirmar o cancelamento.'],
      cancelOr: "Também pode contactar-nos em",
      effectsTitle: "Efeitos do cancelamento:",
      effectsL: ["O cancelamento deve ser efetuado antes do final do período de faturação em curso.", "Uma vez cancelada, a subscrição não será renovada na próxima data de cobrança.", "O utilizador manterá acesso ao serviço até ao final do período de faturação já pago.", "Não serão efetuados reembolsos pelos períodos de faturação já cobrados."],
      changePlanTitle: "Mudanças de plano:",
      changePlanL: ["O utilizador pode mudar de plano a qualquer momento a partir da secção de Faturação.", "As mudanças de plano aplicar-se-ão no próximo período de faturação."],
      priceTitle: "Modificação de preços:",
      priceL: ["A Buy & Click, SL reserva-se o direito de modificar os preços com um pré-aviso mínimo de 30 dias por e-mail.", "Se o utilizador não concordar com o novo preço, pode cancelar a subscrição antes da data de entrada em vigor.", "A utilização continuada do serviço após a entrada em vigor do novo preço implica a sua aceitação."],
      nonPayTitle: "Falta de pagamento:",
      nonPayL: ["Se o débito automático não puder ser efetuado, a Buy & Click, SL tentará novamente o pagamento durante um período determinado.", "Se a falta de pagamento persistir, a Buy & Click, SL reserva-se o direito de suspender ou cancelar o acesso ao serviço."],
    },
  };

  const l = labels[locale as keyof typeof labels] ?? labels.es;

  return (
    <>
      <p><strong>{l.nature}</strong> {l.natureDesc}</p>

      <p><strong>{l.autoTitle}</strong></p>
      <ul className="list-none space-y-1 pl-0">
        {l.autoL.map((item, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 shrink-0">›</span><span>{item}</span></li>)}
      </ul>

      <p><strong>{l.cancelTitle}</strong></p>
      <p>{l.cancelIntro}</p>
      <ol className="list-decimal list-inside space-y-1 text-gray-600">
        {l.cancelSteps.map((step, i) => (
          <li key={i}>{i === 0 ? <><span>{step.replace("Facturación.", "")}</span><Link href={billingPath} className="text-brand-600 hover:underline">{locale === "en" ? "Billing" : locale === "fr" ? "Facturation" : locale === "de" ? "Abrechnung" : locale === "it" ? "Fatturazione" : locale === "pt" ? "Faturação" : "Facturación"}</Link>.</> : step}</li>
        ))}
      </ol>
      <p>{l.cancelOr}{" "}<a href={`mailto:${email}`} className="text-brand-600 hover:underline">{email}</a></p>

      <p><strong>{l.effectsTitle}</strong></p>
      <ul className="list-none space-y-1 pl-0">
        {l.effectsL.map((item, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 shrink-0">›</span><span>{item}</span></li>)}
      </ul>

      <p><strong>{l.changePlanTitle}</strong></p>
      <ul className="list-none space-y-1 pl-0">
        {l.changePlanL.map((item, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 shrink-0">›</span><span>{item}</span></li>)}
      </ul>

      <p><strong>{l.priceTitle}</strong></p>
      <ul className="list-none space-y-1 pl-0">
        {l.priceL.map((item, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 shrink-0">›</span><span>{item}</span></li>)}
      </ul>

      <p><strong>{l.nonPayTitle}</strong></p>
      <ul className="list-none space-y-1 pl-0">
        {l.nonPayL.map((item, i) => <li key={i} className="flex gap-2"><span className="text-brand-500 shrink-0">›</span><span>{item}</span></li>)}
      </ul>
    </>
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
