export interface FaqItem { q: string; a: string }
export interface FaqCategory { category: string; items: FaqItem[] }

const FAQ_DATA: Record<string, FaqCategory[]> = {
  es: [
    {
      category: "Funcionamiento",
      items: [
        { q: "¿Cómo funciona exactamente?", a: "Introduces el nombre y teléfono de tu cliente en el panel. Le llega un WhatsApp personalizado preguntando por su experiencia. La IA analiza la respuesta al instante: si es positiva, le anima a dejar reseña con el enlace directo a la plataforma que elijas; si es negativa, responde con empatía sin enviarle al perfil público." },
        { q: "¿Para qué plataformas funciona?", a: "Para cualquiera: Google Maps, App Store, Play Store, Trustpilot o cualquier otra URL de reseñas. Solo tienes que configurar el enlace de destino en tu perfil y ResenasYa lo envía automáticamente a los clientes satisfechos." },
        { q: "¿Se puede usar para varias plataformas a la vez?", a: "Sí. Puedes configurar varias plataformas en tu perfil y elegir cuál está activa en cada momento. Algunos negocios envían a Google Maps de lunes a jueves y a Trustpilot el resto de la semana." },
        { q: "¿Qué necesito para empezar?", a: "Solo registrarte en ResenasYa y añadir el enlace de tu perfil de reseñas (Google Maps, App Store, etc.). La configuración completa lleva menos de 1 minuto." },
        { q: "¿Cuántas solicitudes puedo enviar al mes?", a: "Depende del plan: Starter (9,9€/mes) incluye 50 contactos, y Pro (29,9€/mes) incluye 250 contactos. Puedes cambiar de plan o cancelar en cualquier momento desde la sección de Facturación." },
        { q: "¿Qué pasa si un cliente deja una valoración negativa?", a: "La IA detecta el sentimiento negativo y responde con un mensaje empático invitando al cliente a contar qué pasó, sin enviarle a ningún perfil público. Tú recibes el feedback en el panel para gestionarlo de forma interna antes de que se convierta en una reseña negativa." },
        { q: "¿Puedo personalizar los mensajes de WhatsApp?", a: "Sí. Puedes personalizar el mensaje inicial con el nombre del cliente y el nombre de tu negocio, y elegir entre tres tonos de comunicación: trato de tú (cercano), usted (formal) o juvenil (desenfadado). Los mensajes de seguimiento se adaptan automáticamente al tono elegido." },
        { q: "¿Funciona para abogados, psicólogos y otros sectores sensibles?", a: "Sí. Sectores con alta sensibilidad lo usan con el tono «usted» para mantener la formalidad. El filtro de sentimiento es especialmente valioso aquí: gestiona los casos delicados en privado, sin exposición pública." },
        { q: "¿Se envían recordatorios si el cliente no responde?", a: "Sí. Si un cliente no responde al mensaje inicial, ResenasYa puede enviar automáticamente hasta 2 recordatorios: el primero a las 24 horas y el segundo a las 72 horas. Esta función se puede activar o desactivar desde Configuración." },
        { q: "¿Los mensajes de WhatsApp se envían en el idioma del cliente?", a: "Puedes elegir el idioma en que se enviarán los mensajes de WhatsApp (español, inglés, francés, alemán, italiano o portugués) desde la sección de Configuración. El idioma se aplica a todos los mensajes enviados desde tu cuenta." },
      ],
    },
    {
      category: "Inteligencia artificial y mensajes",
      items: [
        { q: "¿Qué papel juega la IA en el servicio?", a: "La inteligencia artificial (Claude de Anthropic) hace dos cosas: analiza el sentimiento de la respuesta del cliente (positivo, negativo o neutro) y genera automáticamente el mensaje de seguimiento que se le envía. Todo el proceso es automático y no hay revisión humana antes del envío." },
        { q: "¿ResenasYa es responsable de lo que dice la IA en los mensajes?", a: "No. Los mensajes generados por la IA no son revisados por ResenasYa antes de enviarse. Si bien la IA está entrenada para responder de forma adecuada, puede cometer errores o generar respuestas que no se ajusten exactamente a lo esperado. ResenasYa no asume responsabilidad por el contenido de los mensajes generados automáticamente." },
        { q: "¿La IA siempre clasifica bien el sentimiento de una respuesta?", a: "La IA acierta en la gran mayoría de los casos, pero no es infalible. Puede clasificar erróneamente una respuesta ambigua o irónica. En ese caso, podría enviarse un mensaje de seguimiento inadecuado para el contexto. ResenasYa no se hace responsable de estos errores de clasificación." },
        { q: "¿Qué pasa si un cliente me responde algo inapropiado u ofensivo?", a: "ResenasYa no tiene control sobre lo que los clientes responden. Si recibes una respuesta inapropiada u ofensiva, deberás gestionarla directamente con el cliente y, si procede, con las autoridades. La respuesta quedará registrada en tu panel para que puedas revisarla." },
      ],
    },
    {
      category: "Reseñas y plataformas",
      items: [
        { q: "¿ResenasYa garantiza que los clientes dejen reseñas positivas?", a: "No. ResenasYa facilita el contacto con clientes satisfechos y les proporciona el enlace para dejar reseña, pero no puede garantizar ni el número de reseñas que se publicarán, ni su contenido, ni su puntuación. Los resultados dependen exclusivamente de la experiencia real del cliente." },
        { q: "¿Es ResenasYa responsable de las reseñas que dejan los clientes?", a: "No. Una vez que el cliente accede a la plataforma, lo que escriba es responsabilidad suya. Si un cliente deja una reseña negativa, falsa o que consideras injusta, deberás gestionarlo directamente con la plataforma correspondiente (Google, Trustpilot, etc.)." },
        { q: "¿Qué pasa si Google Maps elimina mis reseñas o penaliza mi perfil?", a: "ResenasYa no tiene ningún control sobre las decisiones de Google Maps u otras plataformas. Dichas plataformas pueden eliminar reseñas o modificar algoritmos de forma unilateral. ResenasYa no asume responsabilidad por estas situaciones." },
        { q: "¿Cómo funcionan los incentivos y códigos de descuento?", a: "Disponible en el plan Pro. Puedes activar un incentivo: el cliente recibe un mensaje invitándole a dejar una reseña de 5★ y enviar la captura de pantalla. La IA verifica automáticamente que la reseña tiene 5 estrellas y le responde con el código de descuento al instante, sin intervención humana." },
        { q: "¿Puedo conectar mi perfil de Google Business para gestionar las reseñas directamente?", a: "Sí. Desde la sección \"Google Business\" del panel puedes conectar tu cuenta de Google Business Profile. Una vez conectada, podrás ver todas tus reseñas, responderlas con sugerencias generadas por IA y analizar los patrones de opinión de tus clientes." },
        { q: "¿ResenasYa puede responder reseñas en Google Maps en mi nombre?", a: "Sí, si conectas tu cuenta de Google Business Profile. La IA genera una respuesta sugerida que tú revisas y apruebas antes de publicarla. Tú tienes siempre el control sobre lo que se publica." },
        { q: "¿Puedo pedir que eliminen una reseña negativa de Google?", a: "Google solo elimina reseñas que incumplen sus políticas (spam, contenido falso, ofensivo, conflicto de interés, etc.). ResenasYa analiza tus reseñas, identifica las que podrían ser reclamables y genera automáticamente el texto del correo de reclamación para que tú lo envíes directamente a Google. ResenasYa no garantiza que Google elimine ninguna reseña, ya que esa decisión corresponde exclusivamente a Google." },
      ],
    },
    {
      category: "Suscripción y facturación",
      items: [
        { q: "¿La suscripción se cobra automáticamente cada mes?", a: "Sí. La suscripción es mensual y se renueva automáticamente. Cada mes, en la misma fecha en que te suscribiste, se cargará el importe de tu plan al método de pago registrado. Recibirás una factura por correo electrónico tras cada cobro." },
        { q: "¿Cómo cancelo mi suscripción?", a: "Puedes cancelar en cualquier momento desde tu panel: ve a Facturación → haz clic en «Gestionar suscripción» → en el portal de Stripe, selecciona «Cancelar plan» y confirma. Tras cancelar, mantendrás el acceso hasta el final del período ya pagado. No se realizan reembolsos por períodos ya cobrados." },
        { q: "¿Puedo cancelar a mitad de mes y que me devuelvan el dinero?", a: "No. La política de ResenasYa no contempla reembolsos por períodos de facturación ya cobrados. Si cancelas, mantendrás el acceso al servicio hasta el final del período pagado, pero no recibirás ningún reembolso proporcional." },
        { q: "¿Qué ocurre si no cancelo antes del siguiente cobro?", a: "Si no cancelas antes de que finalice tu período de facturación, la suscripción se renovará automáticamente. Una vez realizado el cargo, no se tramitarán reembolsos. Por eso es importante cancelar con suficiente antelación si no deseas continuar." },
        { q: "¿Puedo cambiar de plan?", a: "Sí. Puedes cambiar de plan (superior o inferior) en cualquier momento desde la sección de Facturación de tu panel. Los cambios se aplicarán en el siguiente período de facturación." },
        { q: "¿Subirán los precios?", a: "ResenasYa se reserva el derecho a modificar los precios con un preaviso mínimo de 30 días por correo electrónico. Si no estás de acuerdo con el nuevo precio, puedes cancelar tu suscripción antes de que entre en vigor el cambio." },
      ],
    },
    {
      category: "Legal y privacidad",
      items: [
        { q: "¿Es legal enviar WhatsApps a clientes para pedir reseñas?", a: "Sí, siempre que el cliente haya dado su consentimiento para recibir comunicaciones. Recomendamos informarle durante la visita o en el proceso de compra, y contar con su número de teléfono facilitado voluntariamente. El envío cumple con el RGPD bajo base legitimadora de interés legítimo o consentimiento." },
        { q: "¿Los datos de mis clientes están seguros?", a: "Sí. Los datos se almacenan en Supabase con cifrado en tránsito (HTTPS/TLS) y Row Level Security activo: cada negocio solo accede a sus propios datos. Los datos de pago son gestionados íntegramente por Stripe y nunca se almacenan en nuestros servidores." },
        { q: "¿Qué pasa con mis datos si cancelo la cuenta?", a: "Tras la cancelación de la cuenta, los datos se conservarán durante el período de retención establecido en nuestra Política de Privacidad, tras el cual serán eliminados permanentemente. Puedes solicitar la eliminación anticipada contactando con nosotros en info@resenasya.com." },
      ],
    },
  ],

  en: [
    {
      category: "How it works",
      items: [
        { q: "How does it work exactly?", a: "You enter your customer's name and phone number in the dashboard. They receive a personalised WhatsApp asking about their experience. The AI instantly analyses the reply: if it's positive, it encourages them to leave a review with a direct link to your chosen platform; if it's negative, it responds empathetically without sending them to your public profile." },
        { q: "Which platforms does it work with?", a: "Any platform: Google Maps, App Store, Play Store, Trustpilot, or any other review URL. Just set your destination link in your profile and ResenasYa automatically sends it to satisfied customers." },
        { q: "Can it be used for multiple platforms at once?", a: "Yes. You can set up multiple platforms in your profile and choose which one is active at any given time. Some businesses send to Google Maps Monday to Thursday and to Trustpilot for the rest of the week." },
        { q: "What do I need to get started?", a: "Just sign up for ResenasYa and add your review profile link (Google Maps, App Store, etc.). The full setup takes less than 1 minute." },
        { q: "How many requests can I send per month?", a: "It depends on your plan: Starter (€9.9/month) includes 50 contacts, and Pro (€29.9/month) includes 250 contacts. You can change plan or cancel at any time from the Billing section." },
        { q: "What happens if a customer leaves a negative rating?", a: "The AI detects the negative sentiment and responds with an empathetic message inviting the customer to share what went wrong, without sending them to any public profile. You receive the feedback in your dashboard to handle internally before it becomes a negative public review." },
        { q: "Can I customise the WhatsApp messages?", a: "Yes. You can personalise the initial message with the customer's name and your business name, and choose between three communication tones: friendly (informal), formal, or casual/youth-oriented. Follow-up messages automatically adapt to the chosen tone." },
        { q: "Does it work for lawyers, psychologists, and other sensitive sectors?", a: "Yes. Highly sensitive sectors use it with the formal tone to maintain professionalism. The sentiment filter is especially valuable here: it handles delicate cases privately, without public exposure." },
        { q: "Are reminders sent if the customer doesn't reply?", a: "Yes. If a customer doesn't respond to the initial message, ResenasYa can automatically send up to 2 reminders: the first after 24 hours and the second after 72 hours. This feature can be enabled or disabled from Settings." },
        { q: "Are WhatsApp messages sent in the customer's language?", a: "You can choose the language in which WhatsApp messages will be sent (Spanish, English, French, German, Italian or Portuguese) from the Settings section. The language applies to all messages sent from your account." },
      ],
    },
    {
      category: "AI & messages",
      items: [
        { q: "What role does AI play in the service?", a: "The artificial intelligence (Anthropic's Claude) does two things: it analyses the sentiment of the customer's reply (positive, negative, or neutral) and automatically generates the follow-up message that is sent to them. The entire process is automatic and there is no human review before sending." },
        { q: "Is ResenasYa responsible for what the AI says in messages?", a: "No. Messages generated by the AI are not reviewed by ResenasYa before being sent. Although the AI is trained to respond appropriately, it can make mistakes or generate responses that do not meet expectations exactly. ResenasYa assumes no responsibility for the content of automatically generated messages." },
        { q: "Does the AI always classify sentiment correctly?", a: "The AI is correct in the vast majority of cases, but it is not infallible. It can misclassify an ambiguous or ironic response. In that case, an inappropriate follow-up message could be sent. ResenasYa is not responsible for these classification errors." },
        { q: "What if a customer replies with something inappropriate or offensive?", a: "ResenasYa has no control over what customers reply. If you receive an inappropriate or offensive response, you must deal with it directly with the customer and, if appropriate, with the authorities. The reply will be logged in your dashboard for review." },
      ],
    },
    {
      category: "Reviews & platforms",
      items: [
        { q: "Does ResenasYa guarantee that customers leave positive reviews?", a: "No. ResenasYa facilitates contact with satisfied customers and provides them with the link to leave a review, but it cannot guarantee the number of reviews that will be published, their content, or their rating. Results depend entirely on the customer's real experience with your business." },
        { q: "Is ResenasYa responsible for the reviews customers leave?", a: "No. Once the customer accesses the platform, what they write is their responsibility. If a customer leaves a negative, false, or unfair review, you must deal with it directly with the relevant platform (Google, Trustpilot, etc.)." },
        { q: "What if Google Maps removes my reviews or penalises my profile?", a: "ResenasYa has no control over decisions made by Google Maps or other platforms. These platforms can remove reviews or modify their algorithms unilaterally. ResenasYa assumes no responsibility for such situations." },
        { q: "How do incentives and discount codes work?", a: "Available on the Pro plan. You can activate an incentive: the customer receives a message inviting them to leave a 5★ review and send a screenshot. The AI automatically verifies that the review has 5 stars and immediately replies with the discount code or reward, with no human intervention." },
        { q: "Can I connect my Google Business profile to manage reviews directly?", a: "Yes. From the \"Google Business\" section of your dashboard you can connect your Google Business Profile account. Once connected, you can view all your reviews, reply to them with AI-generated suggestions, and analyse your customers' opinion patterns." },
        { q: "Can ResenasYa reply to Google Maps reviews on my behalf?", a: "Yes, if you connect your Google Business Profile account. The AI generates a suggested reply that you review and approve before publishing. You always have full control over what gets published." },
        { q: "Can I request the removal of a negative Google review?", a: "Google only removes reviews that violate its policies (spam, fake content, offensive material, conflict of interest, etc.). ResenasYa analyses your reviews, identifies those that may be eligible for a complaint, and automatically generates the complaint email text for you to send directly to Google. ResenasYa does not guarantee that Google will remove any review, as that decision rests solely with Google." },
      ],
    },
    {
      category: "Subscription & billing",
      items: [
        { q: "Is the subscription billed automatically each month?", a: "Yes. The subscription is monthly and renews automatically. Each month, on the same date you subscribed, your plan amount will be charged to your registered payment method. You will receive an invoice by email after each payment." },
        { q: "How do I cancel my subscription?", a: "You can cancel at any time from your dashboard: go to Billing → click 'Manage subscription' → in the Stripe portal, select 'Cancel plan' and confirm. After cancelling, you will retain access until the end of the already-paid period. No refunds are issued for periods already charged." },
        { q: "Can I cancel mid-month and get a refund?", a: "No. ResenasYa's policy does not provide refunds for already-billed periods. If you cancel, you will retain access to the service until the end of the paid period, but you will not receive any proportional refund for unused days." },
        { q: "What happens if I don't cancel before the next charge?", a: "If you don't cancel before your billing period ends, the subscription will renew automatically. Once the charge is made, no refunds will be processed. So it's important to cancel well in advance if you don't wish to continue." },
        { q: "Can I change my plan?", a: "Yes. You can change plan (upgrade or downgrade) at any time from the Billing section of your dashboard. Changes will take effect from the next billing period." },
        { q: "Will prices increase?", a: "ResenasYa reserves the right to modify prices with a minimum of 30 days' notice by email. If you don't agree with the new price, you can cancel your subscription before the change takes effect." },
      ],
    },
    {
      category: "Legal & privacy",
      items: [
        { q: "Is it legal to send WhatsApps to customers to ask for reviews?", a: "Yes, provided the customer has given their consent to receive communications. We recommend informing them during their visit or purchase process, and ensuring their phone number was provided voluntarily. The sending complies with GDPR under the legal basis of legitimate interest or consent." },
        { q: "Is my customers' data safe?", a: "Yes. Data is stored in Supabase with in-transit encryption (HTTPS/TLS) and active Row Level Security: each business only accesses its own data. Payment data is handled entirely by Stripe and is never stored on our servers." },
        { q: "What happens to my data if I cancel my account?", a: "After account cancellation, data will be retained during the retention period established in our Privacy Policy, after which it will be permanently deleted. You can request early deletion by contacting us at info@resenasya.com." },
      ],
    },
  ],

  fr: [
    {
      category: "Fonctionnement",
      items: [
        { q: "Comment ça fonctionne exactement ?", a: "Vous saisissez le nom et le téléphone de votre client dans le tableau de bord. Il reçoit un WhatsApp personnalisé lui demandant son avis sur son expérience. L'IA analyse la réponse instantanément : si elle est positive, elle l'encourage à laisser un avis avec le lien direct vers la plateforme choisie ; si elle est négative, elle répond avec empathie sans l'envoyer vers votre profil public." },
        { q: "Pour quelles plateformes ça fonctionne ?", a: "Pour toutes : Google Maps, App Store, Play Store, Trustpilot ou n'importe quelle autre URL d'avis. Il vous suffit de configurer le lien de destination dans votre profil et ResenasYa l'envoie automatiquement aux clients satisfaits." },
        { q: "Peut-on l'utiliser pour plusieurs plateformes en même temps ?", a: "Oui. Vous pouvez configurer plusieurs plateformes dans votre profil et choisir laquelle est active à tout moment. Certaines entreprises envoient vers Google Maps du lundi au jeudi et vers Trustpilot le reste de la semaine." },
        { q: "De quoi ai-je besoin pour commencer ?", a: "Il suffit de vous inscrire sur ResenasYa et d'ajouter le lien de votre profil d'avis (Google Maps, App Store, etc.). La configuration complète prend moins d'1 minute." },
        { q: "Combien de demandes puis-je envoyer par mois ?", a: "Cela dépend de votre forfait : Starter (9,9€/mois) inclut 50 contacts, et Pro (29,9€/mois) inclut 250 contacts. Vous pouvez changer de forfait ou annuler à tout moment depuis la section Facturation." },
        { q: "Que se passe-t-il si un client laisse une évaluation négative ?", a: "L'IA détecte le sentiment négatif et répond avec un message empathique invitant le client à expliquer ce qui s'est passé, sans l'envoyer vers un profil public. Vous recevez le retour dans votre tableau de bord pour le gérer en interne avant qu'il ne devienne un avis négatif public." },
        { q: "Puis-je personnaliser les messages WhatsApp ?", a: "Oui. Vous pouvez personnaliser le message initial avec le nom du client et le nom de votre entreprise, et choisir entre trois tons de communication : tutoiement (informel), vouvoiement (formel) ou jeune (décontracté). Les messages de suivi s'adaptent automatiquement au ton choisi." },
        { q: "Fonctionne-t-il pour les avocats, les psychologues et d'autres secteurs sensibles ?", a: "Oui. Les secteurs très sensibles l'utilisent avec le ton formel pour maintenir le professionnalisme. Le filtre de sentiment est particulièrement précieux ici : il gère les cas délicats en privé, sans exposition publique." },
        { q: "Des rappels sont-ils envoyés si le client ne répond pas ?", a: "Oui. Si un client ne répond pas au message initial, ResenasYa peut envoyer automatiquement jusqu'à 2 rappels : le premier après 24 heures et le second après 72 heures. Cette fonction peut être activée ou désactivée depuis les Paramètres." },
        { q: "Les messages WhatsApp sont-ils envoyés dans la langue du client ?", a: "Vous pouvez choisir la langue dans laquelle les messages WhatsApp seront envoyés (espagnol, anglais, français, allemand, italien ou portugais) depuis la section Paramètres. La langue s'applique à tous les messages envoyés depuis votre compte." },
      ],
    },
    {
      category: "IA et messages",
      items: [
        { q: "Quel rôle joue l'IA dans le service ?", a: "L'intelligence artificielle (Claude d'Anthropic) fait deux choses : elle analyse le sentiment de la réponse du client (positif, négatif ou neutre) et génère automatiquement le message de suivi qui lui est envoyé. Tout le processus est automatique et il n'y a aucune révision humaine avant l'envoi." },
        { q: "ResenasYa est-il responsable de ce que dit l'IA dans les messages ?", a: "Non. Les messages générés par l'IA ne sont pas revus par ResenasYa avant d'être envoyés. Bien que l'IA soit entraînée à répondre de manière appropriée, elle peut commettre des erreurs. ResenasYa n'assume aucune responsabilité pour le contenu des messages générés automatiquement." },
        { q: "L'IA classe-t-elle toujours correctement le sentiment d'une réponse ?", a: "L'IA est correcte dans la grande majorité des cas, mais elle n'est pas infaillible. Elle peut mal classer une réponse ambiguë ou ironique. ResenasYa n'est pas responsable de ces erreurs de classification." },
        { q: "Que se passe-t-il si un client répond quelque chose d'inapproprié ou d'offensant ?", a: "ResenasYa n'a aucun contrôle sur ce que les clients répondent. Si vous recevez une réponse inappropriée, vous devez la gérer directement avec le client et, le cas échéant, avec les autorités. La réponse sera enregistrée dans votre tableau de bord." },
      ],
    },
    {
      category: "Avis et plateformes",
      items: [
        { q: "ResenasYa garantit-il que les clients laissent des avis positifs ?", a: "Non. ResenasYa facilite le contact avec les clients satisfaits et leur fournit le lien pour laisser un avis, mais ne peut pas garantir le nombre d'avis publiés, leur contenu ni leur note. Les résultats dépendent exclusivement de la véritable expérience du client." },
        { q: "ResenasYa est-il responsable des avis laissés par les clients ?", a: "Non. Une fois que le client accède à la plateforme, ce qu'il écrit est de sa responsabilité. Si un client laisse un avis négatif, faux ou injuste, vous devez le gérer directement avec la plateforme concernée (Google, Trustpilot, etc.)." },
        { q: "Que se passe-t-il si Google Maps supprime mes avis ou pénalise mon profil ?", a: "ResenasYa n'a aucun contrôle sur les décisions de Google Maps ou d'autres plateformes. Ces plateformes peuvent supprimer des avis ou modifier leurs algorithmes unilatéralement. ResenasYa n'assume aucune responsabilité pour ces situations." },
        { q: "Comment fonctionnent les incentives et les codes de réduction ?", a: "Disponible dans le forfait Pro. Vous pouvez activer un incentive : le client reçoit un message l'invitant à laisser un avis 5★ et à envoyer une capture d'écran. L'IA vérifie automatiquement que l'avis a 5 étoiles et lui répond immédiatement avec le code de réduction, sans intervention humaine." },
        { q: "Puis-je connecter mon profil Google Business pour gérer les avis directement ?", a: "Oui. Depuis la section «Google Business» du tableau de bord, vous pouvez connecter votre compte Google Business Profile. Une fois connecté, vous pourrez voir tous vos avis, y répondre avec des suggestions générées par l'IA et analyser les tendances d'opinion de vos clients." },
        { q: "ResenasYa peut-il répondre aux avis Google Maps en mon nom ?", a: "Oui, si vous connectez votre compte Google Business Profile. L'IA génère une réponse suggérée que vous relisez et approuvez avant publication. Vous gardez toujours le contrôle sur ce qui est publié." },
        { q: "Puis-je demander la suppression d'un avis négatif sur Google ?", a: "Google ne supprime que les avis qui enfreignent ses politiques (spam, contenu faux, offensant, conflit d'intérêts, etc.). ResenasYa analyse vos avis, identifie ceux qui pourraient faire l'objet d'une réclamation et génère automatiquement le texte de l'e-mail de réclamation pour que vous l'envoyiez directement à Google. ResenasYa ne garantit pas que Google supprime un avis, cette décision appartient exclusivement à Google." },
      ],
    },
    {
      category: "Abonnement et facturation",
      items: [
        { q: "L'abonnement est-il prélevé automatiquement chaque mois ?", a: "Oui. L'abonnement est mensuel et se renouvelle automatiquement. Chaque mois, à la même date que votre inscription, le montant de votre forfait sera débité sur votre moyen de paiement enregistré. Vous recevrez une facture par e-mail après chaque paiement." },
        { q: "Comment résilier mon abonnement ?", a: "Vous pouvez résilier à tout moment depuis votre tableau de bord : allez dans Facturation → cliquez sur «Gérer l'abonnement» → dans le portail Stripe, sélectionnez «Annuler le forfait» et confirmez. Après résiliation, vous conserverez l'accès jusqu'à la fin de la période déjà payée. Aucun remboursement n'est effectué pour les périodes déjà facturées." },
        { q: "Puis-je annuler en cours de mois et être remboursé ?", a: "Non. La politique de ResenasYa ne prévoit pas de remboursements pour les périodes de facturation déjà facturées. Si vous annulez, vous conserverez l'accès au service jusqu'à la fin de la période payée, mais vous ne recevrez aucun remboursement proportionnel." },
        { q: "Que se passe-t-il si je n'annule pas avant le prochain prélèvement ?", a: "Si vous n'annulez pas avant la fin de votre période de facturation, l'abonnement se renouvellera automatiquement. Une fois le prélèvement effectué, aucun remboursement ne sera traité. Il est donc important d'annuler suffisamment à l'avance." },
        { q: "Puis-je changer de forfait ?", a: "Oui. Vous pouvez changer de forfait (supérieur ou inférieur) à tout moment depuis la section Facturation de votre tableau de bord. Les changements prendront effet à la prochaine période de facturation." },
        { q: "Les prix vont-ils augmenter ?", a: "ResenasYa se réserve le droit de modifier les prix avec un préavis minimum de 30 jours par e-mail. Si vous n'êtes pas d'accord avec le nouveau prix, vous pouvez annuler votre abonnement avant que le changement n'entre en vigueur." },
      ],
    },
    {
      category: "Légal et confidentialité",
      items: [
        { q: "Est-il légal d'envoyer des WhatsApps aux clients pour demander des avis ?", a: "Oui, à condition que le client ait donné son consentement pour recevoir des communications. Nous recommandons de l'informer lors de sa visite ou de son processus d'achat, et de disposer de son numéro de téléphone fourni volontairement. L'envoi est conforme au RGPD sous la base légale de l'intérêt légitime ou du consentement." },
        { q: "Les données de mes clients sont-elles sécurisées ?", a: "Oui. Les données sont stockées dans Supabase avec chiffrement en transit (HTTPS/TLS) et Row Level Security actif : chaque entreprise n'accède qu'à ses propres données. Les données de paiement sont entièrement gérées par Stripe et ne sont jamais stockées sur nos serveurs." },
        { q: "Que se passe-t-il avec mes données si j'annule mon compte ?", a: "Après l'annulation du compte, les données seront conservées pendant la période de rétention établie dans notre Politique de Confidentialité, après quoi elles seront supprimées définitivement. Vous pouvez demander une suppression anticipée en nous contactant à info@resenasya.com." },
      ],
    },
  ],

  de: [
    {
      category: "Funktionsweise",
      items: [
        { q: "Wie funktioniert es genau?", a: "Du gibst den Namen und die Telefonnummer deines Kunden in das Dashboard ein. Er erhält eine personalisierte WhatsApp-Nachricht, in der nach seiner Erfahrung gefragt wird. Die KI analysiert die Antwort sofort: Ist sie positiv, wird der Kunde ermutigt, eine Bewertung mit einem Direktlink zur gewählten Plattform zu hinterlassen; ist sie negativ, antwortet die KI einfühlsam, ohne ihn zu deinem öffentlichen Profil zu schicken." },
        { q: "Für welche Plattformen funktioniert es?", a: "Für alle: Google Maps, App Store, Play Store, Trustpilot oder jede andere Bewertungs-URL. Du musst nur den Ziellink in deinem Profil konfigurieren, und ResenasYa sendet ihn automatisch an zufriedene Kunden." },
        { q: "Kann es für mehrere Plattformen gleichzeitig genutzt werden?", a: "Ja. Du kannst mehrere Plattformen in deinem Profil einrichten und jederzeit wählen, welche aktiv ist. Einige Unternehmen senden montags bis donnerstags an Google Maps und den Rest der Woche an Trustpilot." },
        { q: "Was brauche ich, um anzufangen?", a: "Melde dich einfach bei ResenasYa an und füge den Link zu deinem Bewertungsprofil hinzu (Google Maps, App Store usw.). Die vollständige Einrichtung dauert weniger als 1 Minute." },
        { q: "Wie viele Anfragen kann ich pro Monat senden?", a: "Das hängt von deinem Plan ab: Starter (9,90 €/Monat) beinhaltet 50 Kontakte, Pro (29,90 €/Monat) beinhaltet 250 Kontakte. Du kannst deinen Plan jederzeit im Bereich Abrechnung ändern oder kündigen." },
        { q: "Was passiert, wenn ein Kunde eine negative Bewertung hinterlässt?", a: "Die KI erkennt die negative Stimmung und antwortet mit einer einfühlsamen Nachricht, in der der Kunde eingeladen wird, zu erzählen, was passiert ist – ohne ihn zu einem öffentlichen Profil zu schicken. Du erhältst das Feedback in deinem Dashboard, um es intern zu behandeln, bevor es zu einer negativen öffentlichen Bewertung wird." },
        { q: "Kann ich die WhatsApp-Nachrichten anpassen?", a: "Ja. Du kannst die erste Nachricht mit dem Namen des Kunden und deinem Unternehmensnamen personalisieren und zwischen drei Kommunikationstönen wählen: freundlich (informell), formell oder locker/jugendlich. Folgenachrichten passen sich automatisch dem gewählten Ton an." },
        { q: "Funktioniert es für Anwälte, Psychologen und andere sensible Bereiche?", a: "Ja. Sehr sensible Bereiche verwenden es mit dem formellen Ton, um Professionalität zu wahren. Der Stimmungsfilter ist hier besonders wertvoll: Er behandelt heikle Fälle privat, ohne öffentliche Exposition." },
        { q: "Werden Erinnerungen gesendet, wenn der Kunde nicht antwortet?", a: "Ja. Wenn ein Kunde nicht auf die erste Nachricht antwortet, kann ResenasYa automatisch bis zu 2 Erinnerungen senden: die erste nach 24 Stunden und die zweite nach 72 Stunden. Diese Funktion kann in den Einstellungen aktiviert oder deaktiviert werden." },
        { q: "Werden WhatsApp-Nachrichten in der Sprache des Kunden gesendet?", a: "Du kannst in den Einstellungen die Sprache wählen, in der WhatsApp-Nachrichten gesendet werden (Spanisch, Englisch, Französisch, Deutsch, Italienisch oder Portugiesisch). Die Sprache gilt für alle Nachrichten, die von deinem Konto gesendet werden." },
      ],
    },
    {
      category: "KI und Nachrichten",
      items: [
        { q: "Welche Rolle spielt die KI in dem Dienst?", a: "Die Künstliche Intelligenz (Anthropics Claude) tut zwei Dinge: Sie analysiert die Stimmung der Kundenantwort (positiv, negativ oder neutral) und generiert automatisch die Folgenachricht, die gesendet wird. Der gesamte Prozess ist automatisch, und es gibt keine menschliche Überprüfung vor dem Senden." },
        { q: "Ist ResenasYa für den Inhalt der KI-Nachrichten verantwortlich?", a: "Nein. Die von der KI generierten Nachrichten werden von ResenasYa vor dem Versand nicht überprüft. Obwohl die KI darauf trainiert ist, angemessen zu antworten, kann sie Fehler machen. ResenasYa übernimmt keine Verantwortung für den Inhalt automatisch generierter Nachrichten." },
        { q: "Klassifiziert die KI die Stimmung einer Antwort immer korrekt?", a: "Die KI liegt in der überwältigenden Mehrheit der Fälle richtig, ist aber nicht unfehlbar. Sie kann eine mehrdeutige oder ironische Antwort falsch klassifizieren. ResenasYa übernimmt keine Verantwortung für diese Klassifizierungsfehler." },
        { q: "Was passiert, wenn ein Kunde mit etwas Unangemessenem oder Beleidigendem antwortet?", a: "ResenasYa hat keine Kontrolle darüber, was Kunden antworten. Wenn du eine unangemessene oder beleidigende Antwort erhältst, musst du diese direkt mit dem Kunden klären. Die Antwort wird in deinem Dashboard protokolliert." },
      ],
    },
    {
      category: "Bewertungen und Plattformen",
      items: [
        { q: "Garantiert ResenasYa, dass Kunden positive Bewertungen hinterlassen?", a: "Nein. ResenasYa erleichtert den Kontakt mit zufriedenen Kunden und stellt ihnen den Link zum Hinterlassen einer Bewertung zur Verfügung, kann aber weder die Anzahl der veröffentlichten Bewertungen, deren Inhalt noch deren Bewertung garantieren. Die Ergebnisse hängen ausschließlich von der tatsächlichen Erfahrung des Kunden ab." },
        { q: "Ist ResenasYa für die Bewertungen verantwortlich, die Kunden hinterlassen?", a: "Nein. Sobald der Kunde auf die Plattform zugreift, liegt das, was er schreibt, in seiner Verantwortung. Wenn ein Kunde eine negative, falsche oder ungerechte Bewertung hinterlässt, musst du diese direkt mit der entsprechenden Plattform (Google, Trustpilot usw.) klären." },
        { q: "Was passiert, wenn Google Maps meine Bewertungen löscht oder mein Profil bestraft?", a: "ResenasYa hat keinerlei Kontrolle über die Entscheidungen von Google Maps oder anderen Plattformen. Diese Plattformen können Bewertungen löschen oder Algorithmen einseitig ändern. ResenasYa übernimmt keine Verantwortung für solche Situationen." },
        { q: "Wie funktionieren Anreize und Rabattcodes?", a: "Im Pro-Plan verfügbar. Du kannst einen Anreiz aktivieren: Der Kunde erhält eine Nachricht, in der er eingeladen wird, eine 5★-Bewertung zu hinterlassen und einen Screenshot zu senden. Die KI überprüft automatisch, ob die Bewertung 5 Sterne hat, und antwortet sofort mit dem Rabattcode, ohne menschliche Intervention." },
        { q: "Kann ich mein Google-Business-Profil verbinden, um Bewertungen direkt zu verwalten?", a: "Ja. Im Bereich «Google Business» deines Dashboards kannst du dein Google Business Profile-Konto verbinden. Nach der Verbindung kannst du alle deine Bewertungen einsehen, mit KI-generierten Vorschlägen antworten und die Meinungstendenzen deiner Kunden analysieren." },
        { q: "Kann ResenasYa in meinem Namen auf Google Maps-Bewertungen antworten?", a: "Ja, wenn du dein Google Business Profile-Konto verbindest. Die KI generiert eine Antwortvorlage, die du vor der Veröffentlichung überprüfst und genehmigst. Du hast immer die Kontrolle darüber, was veröffentlicht wird." },
        { q: "Kann ich die Löschung einer negativen Google-Bewertung beantragen?", a: "Google löscht nur Bewertungen, die gegen seine Richtlinien verstoßen (Spam, gefälschter Inhalt, beleidigender Inhalt, Interessenkonflikt usw.). ResenasYa analysiert deine Bewertungen, identifiziert mögliche Beschwerdefälle und generiert automatisch den Text der Beschwerdemail, die du direkt an Google senden kannst. ResenasYa garantiert nicht, dass Google eine Bewertung löscht, da diese Entscheidung ausschließlich bei Google liegt." },
      ],
    },
    {
      category: "Abo und Abrechnung",
      items: [
        { q: "Wird das Abonnement jeden Monat automatisch abgerechnet?", a: "Ja. Das Abonnement ist monatlich und verlängert sich automatisch. Jeden Monat, am gleichen Datum wie deine Anmeldung, wird der Betrag deines Plans von deiner registrierten Zahlungsmethode abgebucht. Du erhältst nach jeder Zahlung eine Rechnung per E-Mail." },
        { q: "Wie kündige ich mein Abonnement?", a: "Du kannst jederzeit über dein Dashboard kündigen: Gehe zu Abrechnung → klicke auf «Abonnement verwalten» → wähle im Stripe-Portal «Plan kündigen» und bestätige. Nach der Kündigung behältst du den Zugang bis zum Ende des bereits bezahlten Zeitraums. Für bereits abgerechnete Zeiträume erfolgen keine Rückerstattungen." },
        { q: "Kann ich mitten im Monat kündigen und mein Geld zurückbekommen?", a: "Nein. Die Richtlinien von ResenasYa sehen keine Rückerstattungen für bereits abgerechnete Zeiträume vor. Wenn du kündigst, behältst du den Zugang bis zum Ende des bezahlten Zeitraums, erhältst aber keine anteilige Rückerstattung." },
        { q: "Was passiert, wenn ich vor der nächsten Abbuchung nicht kündige?", a: "Wenn du nicht vor dem Ende deines Abrechnungszeitraums kündigst, verlängert sich das Abonnement automatisch. Sobald die Abbuchung erfolgt ist, werden keine Rückerstattungen bearbeitet. Deshalb ist es wichtig, rechtzeitig zu kündigen, wenn du nicht fortfahren möchtest." },
        { q: "Kann ich meinen Plan wechseln?", a: "Ja. Du kannst deinen Plan (Upgrade oder Downgrade) jederzeit im Bereich Abrechnung deines Dashboards wechseln. Änderungen treten ab dem nächsten Abrechnungszeitraum in Kraft." },
        { q: "Werden die Preise steigen?", a: "ResenasYa behält sich das Recht vor, die Preise mit einer Mindestankündigung von 30 Tagen per E-Mail zu ändern. Wenn du mit dem neuen Preis nicht einverstanden bist, kannst du dein Abonnement kündigen, bevor die Änderung in Kraft tritt." },
      ],
    },
    {
      category: "Rechtliches und Datenschutz",
      items: [
        { q: "Ist es legal, Kunden WhatsApps zu schicken, um nach Bewertungen zu fragen?", a: "Ja, sofern der Kunde seine Zustimmung zum Erhalt von Mitteilungen gegeben hat. Wir empfehlen, ihn beim Besuch oder im Kaufprozess zu informieren und seine Telefonnummer freiwillig zu haben. Der Versand entspricht der DSGVO auf der Grundlage berechtigter Interessen oder Einwilligung." },
        { q: "Sind die Daten meiner Kunden sicher?", a: "Ja. Die Daten werden in Supabase mit Verschlüsselung im Transit (HTTPS/TLS) und aktivierter Row Level Security gespeichert: Jedes Unternehmen greift nur auf seine eigenen Daten zu. Zahlungsdaten werden vollständig von Stripe verwaltet und nie auf unseren Servern gespeichert." },
        { q: "Was passiert mit meinen Daten, wenn ich mein Konto kündige?", a: "Nach der Kontokündigung werden die Daten während der in unserer Datenschutzrichtlinie festgelegten Aufbewahrungsfrist gespeichert, danach werden sie dauerhaft gelöscht. Du kannst eine frühzeitige Löschung beantragen, indem du uns unter info@resenasya.com kontaktierst." },
      ],
    },
  ],

  it: [
    {
      category: "Funzionamento",
      items: [
        { q: "Come funziona esattamente?", a: "Inserisci il nome e il telefono del tuo cliente nel pannello. Riceve un WhatsApp personalizzato che gli chiede della sua esperienza. L'IA analizza immediatamente la risposta: se è positiva, lo incoraggia a lasciare una recensione con il link diretto alla piattaforma scelta; se è negativa, risponde con empatia senza inviarlo al tuo profilo pubblico." },
        { q: "Per quali piattaforme funziona?", a: "Per qualsiasi: Google Maps, App Store, Play Store, Trustpilot o qualsiasi altro URL di recensioni. Devi solo configurare il link di destinazione nel tuo profilo e ResenasYa lo invia automaticamente ai clienti soddisfatti." },
        { q: "Si può usare per più piattaforme contemporaneamente?", a: "Sì. Puoi configurare più piattaforme nel tuo profilo e scegliere quale è attiva in ogni momento. Alcune attività inviano a Google Maps da lunedì a giovedì e a Trustpilot il resto della settimana." },
        { q: "Cosa mi serve per iniziare?", a: "Basta registrarsi su ResenasYa e aggiungere il link del tuo profilo recensioni (Google Maps, App Store, ecc.). La configurazione completa richiede meno di 1 minuto." },
        { q: "Quante richieste posso inviare al mese?", a: "Dipende dal piano: Starter (9,9€/mese) include 50 contatti, e Pro (29,9€/mese) include 250 contatti. Puoi cambiare piano o annullare in qualsiasi momento dalla sezione Fatturazione." },
        { q: "Cosa succede se un cliente lascia una valutazione negativa?", a: "L'IA rileva il sentimento negativo e risponde con un messaggio empatico invitando il cliente a raccontare cosa è successo, senza inviarlo a nessun profilo pubblico. Ricevi il feedback nel tuo pannello per gestirlo internamente prima che diventi una recensione negativa pubblica." },
        { q: "Posso personalizzare i messaggi WhatsApp?", a: "Sì. Puoi personalizzare il messaggio iniziale con il nome del cliente e il nome della tua attività, e scegliere tra tre toni di comunicazione: tu (informale), lei (formale) o giovanile (disinvolto). I messaggi di follow-up si adattano automaticamente al tono scelto." },
        { q: "Funziona per avvocati, psicologi e altri settori sensibili?", a: "Sì. I settori molto sensibili lo usano con il tono formale per mantenere la professionalità. Il filtro del sentimento è particolarmente prezioso qui: gestisce i casi delicati in privato, senza esposizione pubblica." },
        { q: "Vengono inviati promemoria se il cliente non risponde?", a: "Sì. Se un cliente non risponde al messaggio iniziale, ResenasYa può inviare automaticamente fino a 2 promemoria: il primo dopo 24 ore e il secondo dopo 72 ore. Questa funzione può essere attivata o disattivata dalle Impostazioni." },
        { q: "I messaggi WhatsApp vengono inviati nella lingua del cliente?", a: "Puoi scegliere la lingua in cui verranno inviati i messaggi WhatsApp (spagnolo, inglese, francese, tedesco, italiano o portoghese) dalla sezione Impostazioni. La lingua si applica a tutti i messaggi inviati dal tuo account." },
      ],
    },
    {
      category: "IA e messaggi",
      items: [
        { q: "Che ruolo svolge l'IA nel servizio?", a: "L'intelligenza artificiale (Claude di Anthropic) fa due cose: analizza il sentimento della risposta del cliente (positivo, negativo o neutro) e genera automaticamente il messaggio di follow-up che viene inviato. L'intero processo è automatico e non c'è revisione umana prima dell'invio." },
        { q: "ResenasYa è responsabile di ciò che dice l'IA nei messaggi?", a: "No. I messaggi generati dall'IA non sono revisionati da ResenasYa prima dell'invio. Sebbene l'IA sia addestrata a rispondere in modo appropriato, può commettere errori. ResenasYa non assume responsabilità per il contenuto dei messaggi generati automaticamente." },
        { q: "L'IA classifica sempre correttamente il sentimento di una risposta?", a: "L'IA è corretta nella stragrande maggioranza dei casi, ma non è infallibile. Può classificare erroneamente una risposta ambigua o ironica. ResenasYa non è responsabile di questi errori di classificazione." },
        { q: "Cosa succede se un cliente risponde con qualcosa di inappropriato o offensivo?", a: "ResenasYa non ha controllo su ciò che i clienti rispondono. Se ricevi una risposta inappropriata, devi gestirla direttamente con il cliente e, se necessario, con le autorità. La risposta verrà registrata nel tuo pannello." },
      ],
    },
    {
      category: "Recensioni e piattaforme",
      items: [
        { q: "ResenasYa garantisce che i clienti lascino recensioni positive?", a: "No. ResenasYa facilita il contatto con i clienti soddisfatti e fornisce loro il link per lasciare una recensione, ma non può garantire né il numero di recensioni che verranno pubblicate, né il loro contenuto, né la loro valutazione. I risultati dipendono esclusivamente dall'esperienza reale del cliente." },
        { q: "ResenasYa è responsabile delle recensioni che lasciano i clienti?", a: "No. Una volta che il cliente accede alla piattaforma, ciò che scrive è di sua responsabilità. Se un cliente lascia una recensione negativa, falsa o ingiusta, dovrai gestirla direttamente con la piattaforma corrispondente (Google, Trustpilot, ecc.)." },
        { q: "Cosa succede se Google Maps rimuove le mie recensioni o penalizza il mio profilo?", a: "ResenasYa non ha alcun controllo sulle decisioni di Google Maps o altre piattaforme. Queste piattaforme possono rimuovere recensioni o modificare algoritmi unilateralmente. ResenasYa non assume responsabilità per queste situazioni." },
        { q: "Come funzionano gli incentivi e i codici sconto?", a: "Disponibile nel piano Pro. Puoi attivare un incentivo: il cliente riceve un messaggio che lo invita a lasciare una recensione 5★ e inviare uno screenshot. L'IA verifica automaticamente che la recensione abbia 5 stelle e risponde immediatamente con il codice sconto, senza intervento umano." },
        { q: "Posso collegare il mio profilo Google Business per gestire le recensioni direttamente?", a: "Sì. Dalla sezione «Google Business» del pannello puoi collegare il tuo account Google Business Profile. Una volta collegato, potrai vedere tutte le tue recensioni, rispondervi con suggerimenti generati dall'IA e analizzare i pattern di opinione dei tuoi clienti." },
        { q: "ResenasYa può rispondere alle recensioni di Google Maps a mio nome?", a: "Sì, se colleghi il tuo account Google Business Profile. L'IA genera una risposta suggerita che rivedi e approvi prima della pubblicazione. Hai sempre il pieno controllo su ciò che viene pubblicato." },
        { q: "Posso richiedere la rimozione di una recensione negativa su Google?", a: "Google rimuove solo le recensioni che violano le sue politiche (spam, contenuto falso, offensivo, conflitto di interessi, ecc.). ResenasYa analizza le tue recensioni, identifica quelle che potrebbero essere reclamabili e genera automaticamente il testo dell'e-mail di reclamo che puoi inviare direttamente a Google. ResenasYa non garantisce che Google rimuova alcuna recensione, poiché tale decisione spetta esclusivamente a Google." },
      ],
    },
    {
      category: "Abbonamento e fatturazione",
      items: [
        { q: "L'abbonamento viene addebitato automaticamente ogni mese?", a: "Sì. L'abbonamento è mensile e si rinnova automaticamente. Ogni mese, nella stessa data in cui ti sei iscritto, l'importo del tuo piano verrà addebitato sul metodo di pagamento registrato. Riceverai una fattura via e-mail dopo ogni pagamento." },
        { q: "Come cancello il mio abbonamento?", a: "Puoi cancellare in qualsiasi momento dal tuo pannello: vai su Fatturazione → clicca su «Gestisci abbonamento» → nel portale Stripe, seleziona «Annulla piano» e conferma. Dopo la cancellazione, manterrai l'accesso fino alla fine del periodo già pagato. Non vengono effettuati rimborsi per i periodi già addebitati." },
        { q: "Posso cancellare a metà mese e ricevere un rimborso?", a: "No. La politica di ResenasYa non prevede rimborsi per i periodi di fatturazione già addebitati. Se cancelli, manterrai l'accesso al servizio fino alla fine del periodo pagato, ma non riceverai alcun rimborso proporzionale." },
        { q: "Cosa succede se non cancello prima del prossimo addebito?", a: "Se non cancelli prima della fine del tuo periodo di fatturazione, l'abbonamento si rinnoverà automaticamente. Una volta effettuato l'addebito, non verranno elaborati rimborsi. È quindi importante cancellare con sufficiente anticipo se non desideri continuare." },
        { q: "Posso cambiare piano?", a: "Sì. Puoi cambiare piano (superiore o inferiore) in qualsiasi momento dalla sezione Fatturazione del tuo pannello. Le modifiche avranno effetto dal successivo periodo di fatturazione." },
        { q: "I prezzi aumenteranno?", a: "ResenasYa si riserva il diritto di modificare i prezzi con un preavviso minimo di 30 giorni via e-mail. Se non sei d'accordo con il nuovo prezzo, puoi cancellare il tuo abbonamento prima che la modifica entri in vigore." },
      ],
    },
    {
      category: "Legale e privacy",
      items: [
        { q: "È legale inviare WhatsApp ai clienti per chiedere recensioni?", a: "Sì, purché il cliente abbia dato il suo consenso a ricevere comunicazioni. Consigliamo di informarlo durante la visita o nel processo di acquisto, e di avere il suo numero di telefono fornito volontariamente. L'invio è conforme al GDPR sulla base giuridica dell'interesse legittimo o del consenso." },
        { q: "I dati dei miei clienti sono al sicuro?", a: "Sì. I dati sono archiviati in Supabase con crittografia in transito (HTTPS/TLS) e Row Level Security attivo: ogni attività accede solo ai propri dati. I dati di pagamento sono gestiti interamente da Stripe e non vengono mai archiviati sui nostri server." },
        { q: "Cosa succede ai miei dati se cancello l'account?", a: "Dopo la cancellazione dell'account, i dati verranno conservati durante il periodo di conservazione stabilito nella nostra Informativa sulla Privacy, dopodiché verranno eliminati definitivamente. Puoi richiedere la cancellazione anticipata contattandoci all'indirizzo info@resenasya.com." },
      ],
    },
  ],

  pt: [
    {
      category: "Funcionamento",
      items: [
        { q: "Como funciona exatamente?", a: "Introduzes o nome e o telefone do teu cliente no painel. Ele recebe um WhatsApp personalizado a perguntar pela sua experiência. A IA analisa a resposta instantaneamente: se for positiva, incentiva-o a deixar uma avaliação com o link direto para a plataforma escolhida; se for negativa, responde com empatia sem o enviar para o teu perfil público." },
        { q: "Para que plataformas funciona?", a: "Para qualquer uma: Google Maps, App Store, Play Store, Trustpilot ou qualquer outro URL de avaliações. Basta configurar o link de destino no teu perfil e o ResenasYa envia-o automaticamente aos clientes satisfeitos." },
        { q: "Pode ser usado para várias plataformas ao mesmo tempo?", a: "Sim. Podes configurar várias plataformas no teu perfil e escolher qual está ativa em cada momento. Alguns negócios enviam para o Google Maps de segunda a quinta e para o Trustpilot no resto da semana." },
        { q: "O que preciso para começar?", a: "Basta registares-te no ResenasYa e adicionar o link do teu perfil de avaliações (Google Maps, App Store, etc.). A configuração completa demora menos de 1 minuto." },
        { q: "Quantos pedidos posso enviar por mês?", a: "Depende do plano: Starter (9,9€/mês) inclui 50 contactos, e Pro (29,9€/mês) inclui 250 contactos. Podes mudar de plano ou cancelar em qualquer momento na secção de Faturação." },
        { q: "O que acontece se um cliente deixar uma avaliação negativa?", a: "A IA deteta o sentimento negativo e responde com uma mensagem empática convidando o cliente a contar o que aconteceu, sem o enviar para nenhum perfil público. Recebes o feedback no teu painel para o gerir internamente antes de se tornar uma avaliação negativa pública." },
        { q: "Posso personalizar as mensagens de WhatsApp?", a: "Sim. Podes personalizar a mensagem inicial com o nome do cliente e o nome do teu negócio, e escolher entre três tons de comunicação: informal (tu), formal (você) ou jovial. As mensagens de seguimento adaptam-se automaticamente ao tom escolhido." },
        { q: "Funciona para advogados, psicólogos e outros setores sensíveis?", a: "Sim. Setores muito sensíveis usam-no com o tom formal para manter o profissionalismo. O filtro de sentimento é especialmente valioso aqui: gere os casos delicados em privado, sem exposição pública." },
        { q: "São enviados lembretes se o cliente não responder?", a: "Sim. Se um cliente não responder à mensagem inicial, o ResenasYa pode enviar automaticamente até 2 lembretes: o primeiro após 24 horas e o segundo após 72 horas. Esta função pode ser ativada ou desativada nas Definições." },
        { q: "As mensagens de WhatsApp são enviadas no idioma do cliente?", a: "Podes escolher o idioma em que as mensagens de WhatsApp serão enviadas (espanhol, inglês, francês, alemão, italiano ou português) na secção de Definições. O idioma aplica-se a todas as mensagens enviadas da tua conta." },
      ],
    },
    {
      category: "IA e mensagens",
      items: [
        { q: "Que papel desempenha a IA no serviço?", a: "A inteligência artificial (Claude da Anthropic) faz duas coisas: analisa o sentimento da resposta do cliente (positivo, negativo ou neutro) e gera automaticamente a mensagem de seguimento enviada. Todo o processo é automático e não há revisão humana antes do envio." },
        { q: "A ResenasYa é responsável pelo que a IA diz nas mensagens?", a: "Não. As mensagens geradas pela IA não são revistas pela ResenasYa antes de serem enviadas. Embora a IA seja treinada para responder de forma adequada, pode cometer erros. A ResenasYa não assume responsabilidade pelo conteúdo das mensagens geradas automaticamente." },
        { q: "A IA classifica sempre corretamente o sentimento de uma resposta?", a: "A IA está correta na grande maioria dos casos, mas não é infalível. Pode classificar incorretamente uma resposta ambígua ou irónica. A ResenasYa não é responsável por estes erros de classificação." },
        { q: "O que acontece se um cliente responder com algo inapropriado ou ofensivo?", a: "A ResenasYa não tem controlo sobre o que os clientes respondem. Se receberes uma resposta inapropriada, deves geri-la diretamente com o cliente e, se necessário, com as autoridades. A resposta ficará registada no teu painel." },
      ],
    },
    {
      category: "Avaliações e plataformas",
      items: [
        { q: "A ResenasYa garante que os clientes deixem avaliações positivas?", a: "Não. A ResenasYa facilita o contacto com clientes satisfeitos e fornece-lhes o link para deixar uma avaliação, mas não pode garantir o número de avaliações publicadas, o seu conteúdo nem a sua pontuação. Os resultados dependem exclusivamente da experiência real do cliente." },
        { q: "A ResenasYa é responsável pelas avaliações que os clientes deixam?", a: "Não. Assim que o cliente acede à plataforma, o que escreve é da sua responsabilidade. Se um cliente deixar uma avaliação negativa, falsa ou injusta, deves geri-la diretamente com a plataforma correspondente (Google, Trustpilot, etc.)." },
        { q: "O que acontece se o Google Maps remover as minhas avaliações ou penalizar o meu perfil?", a: "A ResenasYa não tem qualquer controlo sobre as decisões do Google Maps ou outras plataformas. Essas plataformas podem remover avaliações ou modificar algoritmos unilateralmente. A ResenasYa não assume responsabilidade por essas situações." },
        { q: "Como funcionam os incentivos e os códigos de desconto?", a: "Disponível no plano Pro. Podes ativar um incentivo: o cliente recebe uma mensagem a convidá-lo a deixar uma avaliação de 5★ e a enviar um screenshot. A IA verifica automaticamente que a avaliação tem 5 estrelas e responde imediatamente com o código de desconto, sem intervenção humana." },
        { q: "Posso ligar o meu perfil do Google Business para gerir as avaliações diretamente?", a: "Sim. Na secção «Google Business» do painel podes ligar a tua conta do Google Business Profile. Uma vez ligada, poderás ver todas as tuas avaliações, responder-lhes com sugestões geradas por IA e analisar os padrões de opinião dos teus clientes." },
        { q: "O ResenasYa pode responder a avaliações do Google Maps em meu nome?", a: "Sim, se ligares a tua conta do Google Business Profile. A IA gera uma resposta sugerida que revês e aprovas antes da publicação. Tens sempre total controlo sobre o que é publicado." },
        { q: "Posso pedir a remoção de uma avaliação negativa do Google?", a: "O Google só remove avaliações que violem as suas políticas (spam, conteúdo falso, ofensivo, conflito de interesses, etc.). O ResenasYa analisa as tuas avaliações, identifica as que podem ser reclamáveis e gera automaticamente o texto do e-mail de reclamação para enviares diretamente ao Google. O ResenasYa não garante que o Google remova qualquer avaliação, pois essa decisão cabe exclusivamente ao Google." },
      ],
    },
    {
      category: "Subscrição e faturação",
      items: [
        { q: "A subscrição é cobrada automaticamente todos os meses?", a: "Sim. A subscrição é mensal e renova-se automaticamente. Cada mês, na mesma data em que te subscreveste, o valor do teu plano será debitado no método de pagamento registado. Receberás uma fatura por e-mail após cada pagamento." },
        { q: "Como cancelo a minha subscrição?", a: "Podes cancelar em qualquer momento no teu painel: vai a Faturação → clica em «Gerir subscrição» → no portal do Stripe, seleciona «Cancelar plano» e confirma. Após o cancelamento, manterás o acesso até ao final do período já pago. Não são efetuados reembolsos por períodos já cobrados." },
        { q: "Posso cancelar a meio do mês e receber o dinheiro de volta?", a: "Não. A política da ResenasYa não prevê reembolsos por períodos de faturação já cobrados. Se cancelares, manterás o acesso ao serviço até ao final do período pago, mas não receberás nenhum reembolso proporcional." },
        { q: "O que acontece se não cancelar antes da próxima cobrança?", a: "Se não cancelares antes do final do teu período de faturação, a subscrição será renovada automaticamente. Uma vez efetuada a cobrança, não serão processados reembolsos. Por isso é importante cancelar com antecedência suficiente se não quiseres continuar." },
        { q: "Posso mudar de plano?", a: "Sim. Podes mudar de plano (superior ou inferior) em qualquer momento na secção de Faturação do teu painel. As alterações entrarão em vigor no próximo período de faturação." },
        { q: "Os preços vão aumentar?", a: "A ResenasYa reserva-se o direito de modificar os preços com um aviso prévio mínimo de 30 dias por e-mail. Se não concordares com o novo preço, podes cancelar a tua subscrição antes de a alteração entrar em vigor." },
      ],
    },
    {
      category: "Legal e privacidade",
      items: [
        { q: "É legal enviar WhatsApps a clientes para pedir avaliações?", a: "Sim, desde que o cliente tenha dado o seu consentimento para receber comunicações. Recomendamos informá-lo durante a visita ou no processo de compra, e ter o seu número de telefone fornecido voluntariamente. O envio cumpre o RGPD sob a base jurídica de interesse legítimo ou consentimento." },
        { q: "Os dados dos meus clientes estão seguros?", a: "Sim. Os dados são armazenados na Supabase com encriptação em trânsito (HTTPS/TLS) e Row Level Security ativo: cada negócio acede apenas aos seus próprios dados. Os dados de pagamento são geridos integralmente pelo Stripe e nunca são armazenados nos nossos servidores." },
        { q: "O que acontece aos meus dados se cancelar a conta?", a: "Após o cancelamento da conta, os dados serão conservados durante o período de retenção estabelecido na nossa Política de Privacidade, após o qual serão eliminados permanentemente. Podes solicitar a eliminação antecipada contactando-nos em info@resenasya.com." },
      ],
    },
  ],
};

export function getFaqData(locale: string): FaqCategory[] {
  return FAQ_DATA[locale] ?? FAQ_DATA["es"];
}

export function getFaqPageMeta(locale: string): { title: string; description: string } {
  const meta: Record<string, { title: string; description: string }> = {
    es: { title: "Preguntas frecuentes | ResenasYa", description: "Resuelve tus dudas sobre ResenasYa: cómo funciona, qué plataformas soporta, si es legal, cómo cancelar y cómo personalizar los mensajes de WhatsApp." },
    en: { title: "FAQ | ResenasYa", description: "Find answers to your questions about ResenasYa: how it works, supported platforms, legality, cancellation, and WhatsApp message customisation." },
    fr: { title: "FAQ | ResenasYa", description: "Trouvez des réponses à vos questions sur ResenasYa : fonctionnement, plateformes supportées, légalité, annulation et personnalisation des messages WhatsApp." },
    de: { title: "FAQ | ResenasYa", description: "Finden Sie Antworten auf Ihre Fragen zu ResenasYa: Funktionsweise, unterstützte Plattformen, Legalität, Kündigung und Anpassung der WhatsApp-Nachrichten." },
    it: { title: "FAQ | ResenasYa", description: "Trova risposte alle tue domande su ResenasYa: come funziona, piattaforme supportate, legalità, cancellazione e personalizzazione dei messaggi WhatsApp." },
    pt: { title: "FAQ | ResenasYa", description: "Encontra respostas às tuas perguntas sobre ResenasYa: como funciona, plataformas suportadas, legalidade, cancelamento e personalização das mensagens de WhatsApp." },
  };
  return meta[locale] ?? meta["es"];
}

export function getFaqPageHeading(locale: string): { title: string; subtitle: string } {
  const headings: Record<string, { title: string; subtitle: string }> = {
    es: { title: "Preguntas frecuentes", subtitle: "Todo lo que necesitas saber antes de empezar con ResenasYa." },
    en: { title: "Frequently asked questions", subtitle: "Everything you need to know before getting started with ResenasYa." },
    fr: { title: "Questions fréquentes", subtitle: "Tout ce que vous devez savoir avant de commencer avec ResenasYa." },
    de: { title: "Häufig gestellte Fragen", subtitle: "Alles, was du wissen musst, bevor du mit ResenasYa anfängst." },
    it: { title: "Domande frequenti", subtitle: "Tutto quello che devi sapere prima di iniziare con ResenasYa." },
    pt: { title: "Perguntas frequentes", subtitle: "Tudo o que precisas de saber antes de começar com ResenasYa." },
  };
  return headings[locale] ?? headings["es"];
}
