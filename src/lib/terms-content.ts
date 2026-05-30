export interface TermsSection {
  title: string;
  content: string[];
}

export interface TermsContent {
  metaTitle: string;
  metaDesc: string;
  legalDoc: string;
  pageTitle: string;
  lastUpdatedDate: string;
  sections: TermsSection[];
}

const CONTENT: Record<string, TermsContent> = {
  es: {
    metaTitle: "Términos y Condiciones | ReseñasYa",
    metaDesc: "Condiciones generales de uso del servicio ReseñasYa.",
    legalDoc: "Documento legal",
    pageTitle: "Términos y Condiciones de Uso",
    lastUpdatedDate: "28 de mayo de 2026",
    sections: [
      {
        title: "2. Descripción del servicio",
        content: [
          "ReseñasYa es una plataforma SaaS (Software as a Service) que permite a negocios locales automatizar la captación de reseñas en Google Maps y otras plataformas mediante el envío de mensajes de WhatsApp a sus clientes. El servicio incluye:",
          "• Envío de mensajes de WhatsApp personalizados a clientes a través de la API de Twilio.",
          "• Análisis automático del sentimiento de las respuestas de los clientes mediante inteligencia artificial (Claude AI de Anthropic).",
          "• Generación automática de mensajes de seguimiento mediante inteligencia artificial, sin revisión humana previa al envío.",
          "• Redireccionamiento de clientes satisfechos al perfil de Google Maps u otras plataformas de reseñas del negocio.",
          "• Panel de gestión con estadísticas y métricas de satisfacción de clientes.",
          "• Personalización del tono y los mensajes de comunicación con clientes.",
          "• Sistema de incentivos opcional (plan Pro) para fomentar la publicación de reseñas.",
        ],
      },
      {
        title: "3. Condiciones de acceso y registro",
        content: [
          "Para utilizar la Plataforma es necesario completar el proceso de registro proporcionando una dirección de correo electrónico válida y una contraseña. Al registrarte, garantizas que:",
          "• Eres mayor de 18 años o cuentas con la capacidad legal suficiente para contratar.",
          "• Actúas en nombre propio o tienes autorización expresa para representar a la empresa u organización que registras.",
          "• Los datos facilitados son verídicos, exactos y completos.",
          "• Mantendrás actualizada la información de tu cuenta.",
          "Eres responsable de mantener la confidencialidad de tus credenciales de acceso. Deberás notificarnos inmediatamente ante cualquier uso no autorizado de tu cuenta.",
        ],
      },
      {
        title: "4. Uso aceptable del servicio",
        content: [
          "El usuario se compromete a utilizar la Plataforma de conformidad con la ley, la moral, el orden público, estas Condiciones y las políticas de uso de los servicios de terceros integrados (Twilio, Anthropic, Supabase, Google Maps).",
          "Queda expresamente prohibido:",
          "• Enviar mensajes de WhatsApp a personas que no hayan dado su consentimiento para recibir comunicaciones comerciales del negocio, conforme al RGPD y la LSSICE.",
          "• Utilizar la Plataforma para enviar spam, mensajes fraudulentos, engañosos o con contenido ilícito.",
          "• Usar el servicio para actividades que infrinjan derechos de terceros, incluidos derechos de propiedad intelectual, privacidad o protección de datos.",
          "• Intentar acceder a datos de otros usuarios o negocios registrados en la Plataforma.",
          "• Realizar ingeniería inversa, descompilar o desensamblar cualquier componente del software.",
          "• Sobrecargar los sistemas de la Plataforma mediante ataques automatizados o cualquier otro medio.",
          "• Revender o sublicenciar el acceso al servicio a terceros sin autorización expresa.",
        ],
      },
      {
        title: "5. Inteligencia artificial: funcionamiento, limitaciones y exención de responsabilidad",
        content: [
          "La Plataforma utiliza tecnología de inteligencia artificial (Claude AI, de Anthropic) para dos funciones principales: (i) analizar el sentimiento de las respuestas recibidas de los clientes finales del usuario, y (ii) generar automáticamente mensajes de seguimiento que se envían a dichos clientes a través de WhatsApp.",
          "El usuario reconoce y acepta expresamente los siguientes puntos en relación con el uso de inteligencia artificial en la Plataforma:",
          "• Los mensajes generados por la IA no son revisados por Buy & Click, SL antes de su envío. El proceso es completamente automático. Buy & Click, SL no supervisa, no valida ni aprueba individualmente el contenido de ningún mensaje generado por la IA antes de que sea enviado al cliente final.",
          "• Buy & Click, SL no es responsable del contenido de los mensajes generados por la IA. La inteligencia artificial puede cometer errores, malinterpretar el contexto, generar respuestas inexactas, inadecuadas o que no se ajusten a las expectativas del usuario o del cliente final.",
          "• La IA puede fallar en la clasificación del sentimiento. El análisis de sentimiento es una estimación estadística. La IA puede clasificar erróneamente una respuesta positiva como negativa o viceversa.",
          "• El usuario asume la responsabilidad del impacto de los mensajes generados por la IA. Si el usuario considera que los mensajes automáticos no son adecuados para su negocio, sector o público objetivo, debe abstenerse de usar esta funcionalidad.",
          "• La disponibilidad del servicio de IA depende de Anthropic. Buy & Click, SL no garantiza la disponibilidad continua del servicio de análisis e IA.",
        ],
      },
      {
        title: "6. Respuestas de clientes finales y contenido de reseñas",
        content: [
          "El uso de la Plataforma implica la comunicación con clientes finales del usuario a través de WhatsApp. Buy & Click, SL no tiene ningún control sobre las respuestas que dichos clientes puedan enviar ni sobre las reseñas que puedan publicar.",
          "• Buy & Click, SL no es responsable del contenido de las respuestas de los clientes finales. Los clientes pueden responder con mensajes ofensivos, inapropiados, falsos, difamatorios o de cualquier otro tipo.",
          "• Buy & Click, SL no es responsable de las reseñas publicadas en plataformas de terceros. Una vez que el cliente final accede a Google Maps, Trustpilot, App Store, Google Play, Yelp u otra plataforma, el contenido que publique escapa completamente del control de Buy & Click, SL.",
          "• Buy & Click, SL no garantiza que los clientes dejen reseñas positivas. La Plataforma facilita el contacto con los clientes, pero no puede garantizar ni el número, ni el contenido, ni la puntuación de las reseñas.",
          "• El usuario es responsable de gestionar las comunicaciones con sus clientes. Si el usuario recibe respuestas inadecuadas, amenazadoras o que puedan constituir un ilícito, deberá gestionarlas directamente con el cliente.",
        ],
      },
      {
        title: "7. Plataformas de reseñas de terceros: exención de responsabilidad",
        content: [
          "La Plataforma facilita el enlace a perfiles de reseñas en Google Maps, Trustpilot, App Store, Google Play, Yelp y otras plataformas de terceros. Buy & Click, SL no tiene ninguna relación comercial, afiliación ni acuerdo con dichas plataformas en el contexto del uso de ReseñasYa.",
          "• Buy & Click, SL no es responsable de las decisiones de Google Maps, Trustpilot ni de ninguna otra plataforma de reseñas. Esto incluye: eliminación de reseñas, suspensión o penalización de perfiles de negocio, cambios en los algoritmos de posicionamiento o modificaciones en las políticas de uso.",
          "• Buy & Click, SL no es responsable de los problemas técnicos de las plataformas de terceros. Caídas del servicio, errores en la carga de perfiles o problemas con los enlaces de reseñas son responsabilidad exclusiva de dichas plataformas.",
          "• El usuario es responsable de cumplir con las políticas de cada plataforma de reseñas. La solicitud selectiva de reseñas y el sistema de incentivos pueden estar sujetos a las políticas de contenido de cada plataforma.",
          "El usuario mantendrá indemne a Buy & Click, SL frente a cualquier reclamación, sanción o daño derivado de actuaciones de plataformas de reseñas de terceros como consecuencia del uso que el usuario haga de la Plataforma.",
        ],
      },
      {
        title: "8. Servicios de terceros",
        content: [
          "La Plataforma integra servicios de terceros para su funcionamiento. El uso de estos servicios está sujeto a sus propios términos y condiciones:",
          "• Twilio: proveedor del servicio de mensajería WhatsApp. El usuario deberá cumplir con sus políticas de uso aceptable.",
          "• Anthropic (Claude AI): proveedor del servicio de análisis de sentimiento y generación de mensajes mediante inteligencia artificial.",
          "• Supabase: proveedor de la infraestructura de base de datos y autenticación.",
          "• Stripe: proveedor del servicio de procesamiento de pagos y gestión de suscripciones. Los datos de tarjeta son gestionados directamente por Stripe.",
          "• Vercel: proveedor de la infraestructura de hospedaje y despliegue de la aplicación.",
          "• Google Maps / Google Business Profile: plataforma de reseñas de terceros.",
          "Buy & Click, SL no garantiza la disponibilidad continuada de los servicios de terceros y no será responsable por interrupciones, cambios o cese de dichos servicios.",
        ],
      },
      {
        title: "9. Propiedad intelectual e industrial",
        content: [
          "Todos los derechos de propiedad intelectual e industrial sobre la Plataforma, incluyendo pero no limitado a: código fuente, diseño, logotipos, marcas, textos, imágenes y funcionalidades, son titularidad exclusiva de Buy & Click, SL o de sus licenciantes.",
          "Se concede al usuario una licencia de uso limitada, no exclusiva, no transferible y revocable para acceder y utilizar la Plataforma conforme a estas Condiciones. Esta licencia no implica la cesión de ningún derecho de propiedad intelectual.",
          "El usuario conserva la propiedad de los datos de sus clientes introducidos en la Plataforma, otorgando a Buy & Click, SL únicamente las licencias necesarias para prestar el servicio contratado.",
        ],
      },
      {
        title: "10. Disponibilidad y calidad del servicio",
        content: [
          "Buy & Click, SL realizará sus mejores esfuerzos para mantener la Plataforma disponible de forma continua, pero no garantiza una disponibilidad del 100%. El servicio puede interrumpirse temporalmente por:",
          "• Tareas de mantenimiento programado o no programado.",
          "• Fallos en los servicios de terceros integrados (Twilio, Anthropic, Supabase, Stripe, Vercel).",
          "• Causas de fuerza mayor o caso fortuito.",
          "• Interrupciones en los servicios de infraestructura (servidores, red, electricidad).",
          "Buy & Click, SL no garantiza que los resultados obtenidos mediante el uso del servicio sean específicos ni predecibles. Los resultados dependen de factores ajenos al control de Buy & Click, SL.",
        ],
      },
      {
        title: "11. Limitación de responsabilidad",
        content: [
          "En la máxima medida permitida por la legislación aplicable, Buy & Click, SL no será responsable de:",
          "• Daños directos, indirectos, incidentales, especiales o consecuentes derivados del uso o la imposibilidad de uso del servicio.",
          "• Pérdida de beneficios, ingresos, datos o reputación comercial.",
          "• El contenido de los mensajes generados por la inteligencia artificial.",
          "• El contenido de los mensajes enviados por los clientes finales del usuario a través de WhatsApp.",
          "• Las reseñas publicadas por los clientes en Google Maps, Trustpilot, App Store, Google Play, Yelp u otras plataformas.",
          "• Las acciones, omisiones o decisiones de los clientes finales del usuario.",
          "• Problemas técnicos, cambios de política, suspensiones de perfiles o cualquier otra actuación de plataformas de reseñas de terceros.",
          "• El incumplimiento por parte del usuario de sus obligaciones legales en materia de protección de datos.",
          "• Sanciones, penalizaciones o eliminación de reseñas adoptadas por plataformas de terceros como consecuencia del uso por parte del usuario de la Plataforma.",
          "La responsabilidad máxima de Buy & Click, SL frente al usuario no superará el importe total abonado durante los tres (3) meses anteriores al evento que origine la reclamación.",
        ],
      },
      {
        title: "13. Suspensión y cancelación de la cuenta",
        content: [
          "Buy & Click, SL se reserva el derecho a suspender o cancelar la cuenta de un usuario, con o sin previo aviso, en los siguientes supuestos:",
          "• Incumplimiento de estas Condiciones o de las políticas de uso de los servicios de terceros integrados.",
          "• Falta de pago de las cuotas de suscripción.",
          "• Uso fraudulento, abusivo o ilícito del servicio.",
          "• Solicitud de la autoridad competente.",
          "Tras la cancelación de la cuenta, Buy & Click, SL podrá eliminar de forma permanente todos los datos asociados una vez transcurrido el período de retención establecido en la Política de Privacidad.",
        ],
      },
      {
        title: "14. Tratamiento de datos por cuenta del usuario (Art. 28 RGPD)",
        content: [
          "En el marco de la prestación del servicio, Buy & Click, SL actúa como encargado del tratamiento por cuenta del usuario (negocio), que actúa como responsable del tratamiento, respecto a los datos personales de los clientes finales introducidos en la Plataforma.",
          "En virtud de lo dispuesto en el artículo 28 del Reglamento (UE) 2016/679 (RGPD), Buy & Click, SL se compromete a:",
          "• Tratar los datos personales de los clientes finales únicamente siguiendo las instrucciones documentadas del responsable del tratamiento.",
          "• Garantizar que las personas autorizadas para tratar los datos personales se hayan comprometido a respetar la confidencialidad.",
          "• Aplicar todas las medidas de seguridad técnicas y organizativas apropiadas conforme al artículo 32 RGPD.",
          "• No recurrir a otro encargado del tratamiento sin autorización previa del responsable, salvo los subencargados necesarios para la prestación del servicio (Twilio, Anthropic, Supabase, Vercel, Stripe).",
          "• Asistir al responsable del tratamiento en la atención de solicitudes de ejercicio de derechos de los interesados.",
          "• Suprimir o devolver todos los datos personales al responsable del tratamiento una vez finalizada la prestación del servicio.",
          "• Poner a disposición del responsable del tratamiento toda la información necesaria para demostrar el cumplimiento de las obligaciones del artículo 28 RGPD.",
          "El usuario, como responsable del tratamiento, garantiza que cuenta con base jurídica suficiente para tratar los datos de sus clientes y para encargar dicho tratamiento a Buy & Click, SL.",
        ],
      },
      {
        title: "15. Modificación de las Condiciones",
        content: [
          "Buy & Click, SL se reserva el derecho de modificar estas Condiciones en cualquier momento. Las modificaciones serán comunicadas al usuario mediante correo electrónico o aviso en la Plataforma con un mínimo de 15 días de antelación a su entrada en vigor. El uso continuado del servicio tras la entrada en vigor de los cambios implica la aceptación de las nuevas Condiciones.",
        ],
      },
      {
        title: "16. Legislación aplicable y jurisdicción",
        content: [
          "Estas Condiciones se rigen por la legislación española. Para la resolución de cualquier controversia derivada de la interpretación o el cumplimiento de estas Condiciones, las partes se someten, con renuncia expresa a cualquier otro fuero, a la jurisdicción de los Juzgados y Tribunales de España.",
          "Para reclamaciones de consumidores de la Unión Europea, también está disponible la plataforma de resolución de litigios en línea de la UE.",
        ],
      },
    ],
  },

  en: {
    metaTitle: "Terms and Conditions | ReseñasYa",
    metaDesc: "General terms and conditions of use of the ReseñasYa service.",
    legalDoc: "Legal document",
    pageTitle: "Terms and Conditions of Use",
    lastUpdatedDate: "May 28, 2026",
    sections: [
      {
        title: "2. Service description",
        content: [
          "ReseñasYa is a SaaS (Software as a Service) platform that enables local businesses to automate the collection of reviews on Google Maps and other platforms by sending WhatsApp messages to their customers. The service includes:",
          "• Sending personalised WhatsApp messages to customers via the Twilio API.",
          "• Automatic sentiment analysis of customer responses using artificial intelligence (Claude AI by Anthropic).",
          "• Automatic generation of follow-up messages by artificial intelligence, without prior human review before sending.",
          "• Redirecting satisfied customers to the business's Google Maps profile or other review platforms.",
          "• Management dashboard with customer satisfaction statistics and metrics.",
          "• Personalisation of tone and customer communication messages.",
          "• Optional incentive system (Pro plan) to encourage the publication of reviews.",
        ],
      },
      {
        title: "3. Access and registration conditions",
        content: [
          "To use the Platform, you must complete the registration process by providing a valid email address and password. By registering, you warrant that:",
          "• You are over 18 years of age or have sufficient legal capacity to enter into contracts.",
          "• You are acting on your own behalf or have express authorisation to represent the company or organisation you are registering.",
          "• The information provided is truthful, accurate and complete.",
          "• You will keep your account information up to date.",
          "You are responsible for maintaining the confidentiality of your access credentials. You must notify us immediately of any unauthorised use of your account.",
        ],
      },
      {
        title: "4. Acceptable use of the service",
        content: [
          "The user undertakes to use the Platform in accordance with the law, morality, public order, these Conditions and the acceptable use policies of the integrated third-party services (Twilio, Anthropic, Supabase, Google Maps).",
          "The following are expressly prohibited:",
          "• Sending WhatsApp messages to people who have not consented to receive commercial communications from the business, in accordance with GDPR and applicable law.",
          "• Using the Platform to send spam, fraudulent, misleading or unlawful content messages.",
          "• Using the service for activities that infringe third-party rights, including intellectual property, privacy or data protection rights.",
          "• Attempting to access data from other users or businesses registered on the Platform.",
          "• Reverse engineering, decompiling or disassembling any component of the software.",
          "• Overloading the Platform's systems through automated attacks or any other means.",
          "• Reselling or sublicensing access to the service to third parties without express authorisation.",
        ],
      },
      {
        title: "5. Artificial intelligence: operation, limitations and disclaimer of liability",
        content: [
          "The Platform uses artificial intelligence technology (Claude AI by Anthropic) for two main functions: (i) analysing the sentiment of responses received from the user's end customers, and (ii) automatically generating follow-up messages sent to those customers via WhatsApp.",
          "The user expressly acknowledges and accepts the following regarding the use of artificial intelligence on the Platform:",
          "• AI-generated messages are not reviewed by Buy & Click, SL before sending. The process is entirely automatic. Buy & Click, SL does not supervise, validate or individually approve the content of any AI-generated message before it is sent to the end customer.",
          "• Buy & Click, SL is not responsible for the content of AI-generated messages. Artificial intelligence may make errors, misinterpret context, or generate inaccurate, inappropriate or unexpected responses.",
          "• AI may fail in sentiment classification. Sentiment analysis is a statistical estimate. The AI may incorrectly classify a positive response as negative or vice versa.",
          "• The user assumes responsibility for the impact of AI-generated messages. If the user considers that automatic messages are not suitable for their business, sector or target audience, they should refrain from using this feature.",
          "• The availability of the AI service depends on Anthropic. Buy & Click, SL does not guarantee the continuous availability of the analysis and AI service.",
        ],
      },
      {
        title: "6. End customer responses and review content",
        content: [
          "Use of the Platform involves communication with the user's end customers via WhatsApp. Buy & Click, SL has no control over the responses those customers may send or the reviews they may publish.",
          "• Buy & Click, SL is not responsible for the content of end customer responses. Customers may respond with offensive, inappropriate, false, defamatory or other types of messages.",
          "• Buy & Click, SL is not responsible for reviews published on third-party platforms. Once an end customer accesses Google Maps, Trustpilot, App Store, Google Play, Yelp or another platform, the content they publish is entirely outside Buy & Click, SL's control.",
          "• Buy & Click, SL does not guarantee that customers will leave positive reviews. The Platform facilitates contact with customers but cannot guarantee the number, content or rating of reviews.",
          "• The user is responsible for managing communications with their customers. If the user receives inappropriate, threatening or potentially unlawful responses, they must handle them directly with the customer.",
        ],
      },
      {
        title: "7. Third-party review platforms: disclaimer of liability",
        content: [
          "The Platform facilitates links to review profiles on Google Maps, Trustpilot, App Store, Google Play, Yelp and other third-party platforms. Buy & Click, SL has no commercial relationship, affiliation or agreement with those platforms in the context of using ReseñasYa.",
          "• Buy & Click, SL is not responsible for decisions made by Google Maps, Trustpilot or any other review platform. This includes: removal of reviews, suspension or penalisation of business profiles, changes to ranking algorithms or modifications to usage policies.",
          "• Buy & Click, SL is not responsible for technical issues on third-party platforms. Service outages, profile loading errors or review link problems are the exclusive responsibility of those platforms.",
          "• The user is responsible for complying with the policies of each review platform. Selective review requests and the incentive system may be subject to each platform's content policies.",
          "The user shall hold Buy & Click, SL harmless from any claim, penalty or damage arising from actions by third-party review platforms as a result of the user's use of the Platform.",
        ],
      },
      {
        title: "8. Third-party services",
        content: [
          "The Platform integrates third-party services for its operation. Use of these services is subject to their own terms and conditions:",
          "• Twilio: provider of the WhatsApp messaging service. The user must comply with their acceptable use policies.",
          "• Anthropic (Claude AI): provider of the sentiment analysis and AI message generation service.",
          "• Supabase: provider of the database and authentication infrastructure.",
          "• Stripe: provider of the payment processing and subscription management service. Card data is managed directly by Stripe.",
          "• Vercel: provider of the application hosting and deployment infrastructure.",
          "• Google Maps / Google Business Profile: third-party review platform.",
          "Buy & Click, SL does not guarantee the continued availability of third-party services and will not be liable for interruptions, changes or cessation of those services.",
        ],
      },
      {
        title: "9. Intellectual and industrial property",
        content: [
          "All intellectual and industrial property rights in the Platform, including but not limited to: source code, design, logos, trademarks, texts, images and features, are the exclusive property of Buy & Click, SL or its licensors.",
          "The user is granted a limited, non-exclusive, non-transferable and revocable licence to access and use the Platform in accordance with these Conditions. This licence does not imply the transfer of any intellectual property rights.",
          "The user retains ownership of their customers' data entered into the Platform, granting Buy & Click, SL only the licences necessary to provide the contracted service.",
        ],
      },
      {
        title: "10. Service availability and quality",
        content: [
          "Buy & Click, SL will use its best efforts to keep the Platform continuously available, but does not guarantee 100% availability. The service may be temporarily interrupted due to:",
          "• Scheduled or unscheduled maintenance tasks.",
          "• Failures in integrated third-party services (Twilio, Anthropic, Supabase, Stripe, Vercel).",
          "• Force majeure or fortuitous events.",
          "• Interruptions to infrastructure services (servers, network, electricity).",
          "Buy & Click, SL does not guarantee that the results obtained through use of the service will be specific or predictable. Results depend on factors beyond Buy & Click, SL's control.",
        ],
      },
      {
        title: "11. Limitation of liability",
        content: [
          "To the maximum extent permitted by applicable law, Buy & Click, SL will not be liable for:",
          "• Direct, indirect, incidental, special or consequential damages arising from the use or inability to use the service.",
          "• Loss of profits, revenue, data or business reputation.",
          "• The content of messages generated by artificial intelligence.",
          "• The content of messages sent by the user's end customers via WhatsApp.",
          "• Reviews published by customers on Google Maps, Trustpilot, App Store, Google Play, Yelp or other platforms.",
          "• The actions, omissions or decisions of the user's end customers.",
          "• Technical problems, policy changes, profile suspensions or any other action by third-party review platforms.",
          "• The user's failure to comply with their legal data protection obligations.",
          "• Penalties, sanctions or removal of reviews adopted by third-party platforms as a result of the user's use of the Platform.",
          "The maximum liability of Buy & Click, SL to the user shall not exceed the total amount paid during the three (3) months prior to the event giving rise to the claim.",
        ],
      },
      {
        title: "13. Account suspension and cancellation",
        content: [
          "Buy & Click, SL reserves the right to suspend or cancel a user's account, with or without prior notice, in the following circumstances:",
          "• Breach of these Conditions or the acceptable use policies of integrated third-party services.",
          "• Non-payment of subscription fees.",
          "• Fraudulent, abusive or unlawful use of the service.",
          "• Request by a competent authority.",
          "Following account cancellation, Buy & Click, SL may permanently delete all associated data once the retention period established in the Privacy Policy has elapsed.",
        ],
      },
      {
        title: "14. Data processing on behalf of the user (Art. 28 GDPR)",
        content: [
          "In the context of providing the service, Buy & Click, SL acts as a data processor on behalf of the user (business), who acts as the data controller, with respect to the personal data of end customers entered into the Platform.",
          "Pursuant to Article 28 of Regulation (EU) 2016/679 (GDPR), Buy & Click, SL undertakes to:",
          "• Process end customers' personal data only in accordance with the documented instructions of the data controller.",
          "• Ensure that persons authorised to process personal data have committed to respecting confidentiality.",
          "• Implement all appropriate technical and organisational security measures in accordance with Article 32 GDPR.",
          "• Not engage another processor without prior authorisation from the controller, except for the sub-processors necessary to provide the service (Twilio, Anthropic, Supabase, Vercel, Stripe).",
          "• Assist the data controller in responding to requests to exercise data subjects' rights.",
          "• Delete or return all personal data to the data controller upon completion of the service.",
          "• Make available to the data controller all information necessary to demonstrate compliance with the obligations of Article 28 GDPR.",
          "The user, as data controller, warrants that they have a sufficient legal basis to process their customers' data and to commission such processing to Buy & Click, SL.",
        ],
      },
      {
        title: "15. Modification of the Conditions",
        content: [
          "Buy & Click, SL reserves the right to modify these Conditions at any time. Modifications will be communicated to the user by email or notice on the Platform at least 15 days before they take effect. Continued use of the service after the changes take effect implies acceptance of the new Conditions.",
        ],
      },
      {
        title: "16. Applicable law and jurisdiction",
        content: [
          "These Conditions are governed by Spanish law. For the resolution of any dispute arising from the interpretation or fulfilment of these Conditions, the parties submit, expressly waiving any other jurisdiction, to the Courts and Tribunals of Spain.",
          "For complaints from consumers in the European Union, the EU online dispute resolution platform is also available.",
        ],
      },
    ],
  },

  fr: {
    metaTitle: "Conditions Générales d'Utilisation | ReseñasYa",
    metaDesc: "Conditions générales d'utilisation du service ReseñasYa.",
    legalDoc: "Document légal",
    pageTitle: "Conditions Générales d'Utilisation",
    lastUpdatedDate: "28 mai 2026",
    sections: [
      {
        title: "2. Description du service",
        content: [
          "ReseñasYa est une plateforme SaaS (Software as a Service) qui permet aux commerces locaux d'automatiser la collecte d'avis sur Google Maps et d'autres plateformes en envoyant des messages WhatsApp à leurs clients. Le service comprend :",
          "• Envoi de messages WhatsApp personnalisés aux clients via l'API Twilio.",
          "• Analyse automatique du sentiment des réponses des clients par intelligence artificielle (Claude AI d'Anthropic).",
          "• Génération automatique de messages de suivi par intelligence artificielle, sans révision humaine préalable à l'envoi.",
          "• Redirection des clients satisfaits vers le profil Google Maps ou d'autres plateformes d'avis de l'établissement.",
          "• Tableau de bord de gestion avec statistiques et métriques de satisfaction client.",
          "• Personnalisation du ton et des messages de communication avec les clients.",
          "• Système d'incitations optionnel (plan Pro) pour encourager la publication d'avis.",
        ],
      },
      {
        title: "3. Conditions d'accès et d'inscription",
        content: [
          "Pour utiliser la Plateforme, vous devez compléter le processus d'inscription en fournissant une adresse e-mail valide et un mot de passe. En vous inscrivant, vous garantissez que :",
          "• Vous avez plus de 18 ans ou disposez de la capacité juridique suffisante pour contracter.",
          "• Vous agissez en votre nom propre ou avez une autorisation expresse pour représenter l'entreprise ou l'organisation que vous inscrivez.",
          "• Les informations fournies sont véridiques, exactes et complètes.",
          "• Vous maintiendrez les informations de votre compte à jour.",
          "Vous êtes responsable de la confidentialité de vos identifiants d'accès. Vous devez nous notifier immédiatement de toute utilisation non autorisée de votre compte.",
        ],
      },
      {
        title: "4. Utilisation acceptable du service",
        content: [
          "L'utilisateur s'engage à utiliser la Plateforme conformément à la loi, à la morale, à l'ordre public, aux présentes Conditions et aux politiques d'utilisation acceptable des services tiers intégrés (Twilio, Anthropic, Supabase, Google Maps).",
          "Sont expressément interdits :",
          "• L'envoi de messages WhatsApp à des personnes n'ayant pas consenti à recevoir des communications commerciales de l'établissement, conformément au RGPD.",
          "• L'utilisation de la Plateforme pour envoyer des spams, des messages frauduleux, trompeurs ou à contenu illicite.",
          "• L'utilisation du service pour des activités portant atteinte aux droits de tiers, y compris les droits de propriété intellectuelle, de vie privée ou de protection des données.",
          "• Toute tentative d'accès aux données d'autres utilisateurs ou établissements inscrits sur la Plateforme.",
          "• L'ingénierie inverse, la décompilation ou le désassemblage de tout composant du logiciel.",
          "• La surcharge des systèmes de la Plateforme par des attaques automatisées ou tout autre moyen.",
          "• La revente ou la sous-licence de l'accès au service à des tiers sans autorisation expresse.",
        ],
      },
      {
        title: "5. Intelligence artificielle : fonctionnement, limites et exclusion de responsabilité",
        content: [
          "La Plateforme utilise la technologie d'intelligence artificielle (Claude AI d'Anthropic) pour deux fonctions principales : (i) analyser le sentiment des réponses reçues des clients finaux de l'utilisateur, et (ii) générer automatiquement des messages de suivi envoyés à ces clients via WhatsApp.",
          "L'utilisateur reconnaît et accepte expressément les points suivants concernant l'utilisation de l'intelligence artificielle sur la Plateforme :",
          "• Les messages générés par l'IA ne sont pas relus par Buy & Click, SL avant leur envoi. Le processus est entièrement automatique.",
          "• Buy & Click, SL n'est pas responsable du contenu des messages générés par l'IA. L'intelligence artificielle peut commettre des erreurs, mal interpréter le contexte ou générer des réponses inexactes ou inadaptées.",
          "• L'IA peut échouer dans la classification du sentiment. L'analyse de sentiment est une estimation statistique.",
          "• L'utilisateur assume la responsabilité de l'impact des messages générés par l'IA sur son activité.",
          "• La disponibilité du service IA dépend d'Anthropic. Buy & Click, SL ne garantit pas la disponibilité continue du service.",
        ],
      },
      {
        title: "6. Réponses des clients finaux et contenu des avis",
        content: [
          "L'utilisation de la Plateforme implique la communication avec les clients finaux de l'utilisateur via WhatsApp. Buy & Click, SL n'a aucun contrôle sur les réponses que ces clients peuvent envoyer ni sur les avis qu'ils peuvent publier.",
          "• Buy & Click, SL n'est pas responsable du contenu des réponses des clients finaux.",
          "• Buy & Click, SL n'est pas responsable des avis publiés sur des plateformes tierces.",
          "• Buy & Click, SL ne garantit pas que les clients laisseront des avis positifs.",
          "• L'utilisateur est responsable de la gestion des communications avec ses clients.",
        ],
      },
      {
        title: "7. Plateformes d'avis tierces : exclusion de responsabilité",
        content: [
          "La Plateforme facilite les liens vers des profils d'avis sur Google Maps, Trustpilot, App Store, Google Play, Yelp et d'autres plateformes tierces. Buy & Click, SL n'a aucune relation commerciale, affiliation ni accord avec ces plateformes.",
          "• Buy & Click, SL n'est pas responsable des décisions de Google Maps, Trustpilot ou d'autres plateformes d'avis.",
          "• Buy & Click, SL n'est pas responsable des problèmes techniques des plateformes tierces.",
          "• L'utilisateur est responsable du respect des politiques de chaque plateforme d'avis.",
          "L'utilisateur dégagera Buy & Click, SL de toute réclamation, sanction ou dommage découlant d'actions de plateformes d'avis tierces.",
        ],
      },
      {
        title: "8. Services tiers",
        content: [
          "La Plateforme intègre des services tiers pour son fonctionnement. L'utilisation de ces services est soumise à leurs propres conditions :",
          "• Twilio : fournisseur du service de messagerie WhatsApp.",
          "• Anthropic (Claude AI) : fournisseur du service d'analyse de sentiment et de génération de messages par IA.",
          "• Supabase : fournisseur de l'infrastructure de base de données et d'authentification.",
          "• Stripe : fournisseur du service de traitement des paiements et de gestion des abonnements.",
          "• Vercel : fournisseur de l'infrastructure d'hébergement et de déploiement.",
          "• Google Maps / Google Business Profile : plateforme d'avis tiers.",
          "Buy & Click, SL ne garantit pas la disponibilité continue des services tiers.",
        ],
      },
      {
        title: "9. Propriété intellectuelle et industrielle",
        content: [
          "Tous les droits de propriété intellectuelle et industrielle sur la Plateforme sont la propriété exclusive de Buy & Click, SL ou de ses concédants de licence.",
          "Une licence d'utilisation limitée, non exclusive, non transférable et révocable est accordée à l'utilisateur pour accéder à la Plateforme conformément aux présentes Conditions.",
          "L'utilisateur conserve la propriété des données de ses clients introduites dans la Plateforme.",
        ],
      },
      {
        title: "10. Disponibilité et qualité du service",
        content: [
          "Buy & Click, SL fera de son mieux pour maintenir la Plateforme disponible en continu, mais ne garantit pas une disponibilité de 100 %. Le service peut être interrompu temporairement pour :",
          "• Tâches de maintenance programmées ou non programmées.",
          "• Défaillances des services tiers intégrés (Twilio, Anthropic, Supabase, Stripe, Vercel).",
          "• Cas de force majeure ou événements fortuits.",
          "• Interruptions des services d'infrastructure (serveurs, réseau, électricité).",
          "Buy & Click, SL ne garantit pas que les résultats obtenus via le service seront spécifiques ou prévisibles.",
        ],
      },
      {
        title: "11. Limitation de responsabilité",
        content: [
          "Dans la mesure maximale permise par la loi applicable, Buy & Click, SL ne sera pas responsable de :",
          "• Dommages directs, indirects, accessoires, spéciaux ou consécutifs découlant de l'utilisation du service.",
          "• Perte de bénéfices, revenus, données ou réputation commerciale.",
          "• Le contenu des messages générés par l'intelligence artificielle.",
          "• Le contenu des messages envoyés par les clients finaux de l'utilisateur via WhatsApp.",
          "• Les avis publiés par les clients sur Google Maps, Trustpilot, App Store ou d'autres plateformes.",
          "• Les actions, omissions ou décisions des clients finaux de l'utilisateur.",
          "• Les problèmes techniques ou décisions des plateformes d'avis tierces.",
          "• Le non-respect par l'utilisateur de ses obligations légales en matière de protection des données.",
          "La responsabilité maximale de Buy & Click, SL ne dépassera pas le montant total payé au cours des trois (3) mois précédant l'événement à l'origine de la réclamation.",
        ],
      },
      {
        title: "13. Suspension et résiliation du compte",
        content: [
          "Buy & Click, SL se réserve le droit de suspendre ou de résilier le compte d'un utilisateur, avec ou sans préavis, dans les cas suivants :",
          "• Non-respect des présentes Conditions ou des politiques d'utilisation des services tiers intégrés.",
          "• Non-paiement des frais d'abonnement.",
          "• Utilisation frauduleuse, abusive ou illicite du service.",
          "• Demande d'une autorité compétente.",
          "Après la résiliation du compte, Buy & Click, SL pourra supprimer définitivement toutes les données associées une fois la période de conservation définie dans la Politique de confidentialité écoulée.",
        ],
      },
      {
        title: "14. Traitement des données pour le compte de l'utilisateur (Art. 28 RGPD)",
        content: [
          "Dans le cadre de la prestation du service, Buy & Click, SL agit en tant que sous-traitant pour le compte de l'utilisateur (établissement), qui agit en tant que responsable du traitement.",
          "En vertu de l'article 28 du Règlement (UE) 2016/679 (RGPD), Buy & Click, SL s'engage à traiter les données conformément aux instructions documentées du responsable du traitement, à appliquer les mesures de sécurité appropriées et à ne pas faire appel à d'autres sous-traitants sans autorisation préalable.",
          "L'utilisateur, en tant que responsable du traitement, garantit qu'il dispose d'une base juridique suffisante pour traiter les données de ses clients.",
        ],
      },
      {
        title: "15. Modification des Conditions",
        content: [
          "Buy & Click, SL se réserve le droit de modifier les présentes Conditions à tout moment. Les modifications seront communiquées à l'utilisateur par e-mail ou avis sur la Plateforme au moins 15 jours avant leur entrée en vigueur. La poursuite de l'utilisation du service après l'entrée en vigueur des modifications implique l'acceptation des nouvelles Conditions.",
        ],
      },
      {
        title: "16. Loi applicable et juridiction",
        content: [
          "Les présentes Conditions sont régies par le droit espagnol. Pour la résolution de tout litige découlant de leur interprétation ou exécution, les parties se soumettent à la juridiction des tribunaux espagnols.",
          "Pour les réclamations des consommateurs de l'Union européenne, la plateforme de règlement des litiges en ligne de l'UE est également disponible.",
        ],
      },
    ],
  },

  de: {
    metaTitle: "Allgemeine Geschäftsbedingungen | ReseñasYa",
    metaDesc: "Allgemeine Geschäftsbedingungen des ReseñasYa-Dienstes.",
    legalDoc: "Rechtliches Dokument",
    pageTitle: "Allgemeine Geschäftsbedingungen",
    lastUpdatedDate: "28. Mai 2026",
    sections: [
      {
        title: "2. Dienstbeschreibung",
        content: [
          "ReseñasYa ist eine SaaS-Plattform (Software as a Service), die es lokalen Unternehmen ermöglicht, die Sammlung von Bewertungen auf Google Maps und anderen Plattformen durch den Versand von WhatsApp-Nachrichten an ihre Kunden zu automatisieren. Der Dienst umfasst:",
          "• Versand personalisierter WhatsApp-Nachrichten an Kunden über die Twilio API.",
          "• Automatische Stimmungsanalyse von Kundenantworten mittels künstlicher Intelligenz (Claude AI von Anthropic).",
          "• Automatische Erstellung von Follow-up-Nachrichten durch KI, ohne vorherige menschliche Überprüfung.",
          "• Weiterleitung zufriedener Kunden zum Google Maps-Profil oder anderen Bewertungsplattformen des Unternehmens.",
          "• Verwaltungsdashboard mit Statistiken und Kundenzufriedenheitsmetriken.",
          "• Personalisierung von Ton und Kommunikationsnachrichten.",
          "• Optionales Anreizsystem (Pro-Plan) zur Förderung der Veröffentlichung von Bewertungen.",
        ],
      },
      {
        title: "3. Zugangs- und Registrierungsbedingungen",
        content: [
          "Um die Plattform nutzen zu können, müssen Sie den Registrierungsprozess abschließen, indem Sie eine gültige E-Mail-Adresse und ein Passwort angeben. Durch die Registrierung garantieren Sie:",
          "• Sie sind über 18 Jahre alt oder verfügen über ausreichende Rechtsfähigkeit zum Vertragsabschluss.",
          "• Sie handeln in eigenem Namen oder haben ausdrückliche Genehmigung, das Unternehmen zu vertreten.",
          "• Die angegebenen Daten sind wahrheitsgemäß, korrekt und vollständig.",
          "• Sie werden Ihre Kontodaten aktuell halten.",
          "Sie sind für die Vertraulichkeit Ihrer Zugangsdaten verantwortlich. Sie müssen uns unverzüglich über jede unbefugte Nutzung Ihres Kontos informieren.",
        ],
      },
      {
        title: "4. Zulässige Nutzung des Dienstes",
        content: [
          "Der Nutzer verpflichtet sich, die Plattform im Einklang mit dem Gesetz, diesen Bedingungen und den Nutzungsrichtlinien integrierter Drittanbieterdienste zu nutzen.",
          "Ausdrücklich verboten ist:",
          "• Das Senden von WhatsApp-Nachrichten an Personen, die nicht in den Empfang kommerzieller Mitteilungen eingewilligt haben, gemäß DSGVO.",
          "• Die Nutzung der Plattform zum Versenden von Spam, betrügerischen oder ungesetzlichen Inhalten.",
          "• Die Nutzung des Dienstes für Aktivitäten, die Rechte Dritter verletzen.",
          "• Versuche, auf Daten anderer registrierter Nutzer zuzugreifen.",
          "• Reverse Engineering, Dekompilierung oder Disassemblierung von Softwarekomponenten.",
          "• Überlastung der Plattformsysteme durch automatisierte Angriffe.",
          "• Weiterverkauf oder Unterlizenzierung des Diensts ohne ausdrückliche Genehmigung.",
        ],
      },
      {
        title: "5. Künstliche Intelligenz: Funktionsweise, Einschränkungen und Haftungsausschluss",
        content: [
          "Die Plattform nutzt KI-Technologie (Claude AI von Anthropic) für zwei Hauptfunktionen: (i) Stimmungsanalyse und (ii) automatische Generierung von Follow-up-Nachrichten.",
          "Der Nutzer erkennt ausdrücklich Folgendes an:",
          "• KI-generierte Nachrichten werden von Buy & Click, SL vor dem Versand nicht überprüft. Der Prozess ist vollständig automatisch.",
          "• Buy & Click, SL ist nicht für den Inhalt KI-generierter Nachrichten verantwortlich.",
          "• Die KI kann bei der Stimmungsklassifizierung Fehler machen.",
          "• Der Nutzer übernimmt die Verantwortung für die Auswirkungen KI-generierter Nachrichten.",
          "• Die Verfügbarkeit des KI-Dienstes hängt von Anthropic ab.",
        ],
      },
      {
        title: "6. Antworten von Endkunden und Bewertungsinhalt",
        content: [
          "Die Nutzung der Plattform beinhaltet die Kommunikation mit den Endkunden des Nutzers über WhatsApp. Buy & Click, SL hat keine Kontrolle über deren Antworten oder veröffentlichte Bewertungen.",
          "• Buy & Click, SL ist nicht für den Inhalt von Endkundenantworten verantwortlich.",
          "• Buy & Click, SL ist nicht für auf Drittplattformen veröffentlichte Bewertungen verantwortlich.",
          "• Buy & Click, SL garantiert nicht, dass Kunden positive Bewertungen hinterlassen.",
          "• Der Nutzer ist für die Verwaltung der Kommunikation mit seinen Kunden verantwortlich.",
        ],
      },
      {
        title: "7. Drittanbieter-Bewertungsplattformen: Haftungsausschluss",
        content: [
          "Die Plattform erleichtert Links zu Bewertungsprofilen auf Google Maps, Trustpilot, App Store, Google Play, Yelp und anderen Drittplattformen. Buy & Click, SL hat keine Geschäftsbeziehung mit diesen Plattformen.",
          "• Buy & Click, SL ist nicht für Entscheidungen von Google Maps, Trustpilot oder anderen Bewertungsplattformen verantwortlich.",
          "• Buy & Click, SL ist nicht für technische Probleme auf Drittplattformen verantwortlich.",
          "• Der Nutzer ist für die Einhaltung der Richtlinien jeder Bewertungsplattform verantwortlich.",
          "Der Nutzer stellt Buy & Click, SL von jeglichen Ansprüchen frei, die aus Maßnahmen von Drittanbieter-Bewertungsplattformen entstehen.",
        ],
      },
      {
        title: "8. Drittanbieterdienste",
        content: [
          "Die Plattform integriert Drittanbieterdienste. Die Nutzung dieser Dienste unterliegt deren eigenen Bedingungen:",
          "• Twilio: Anbieter des WhatsApp-Messaging-Dienstes.",
          "• Anthropic (Claude AI): Anbieter der KI-Stimmungsanalyse.",
          "• Supabase: Anbieter der Datenbank- und Authentifizierungsinfrastruktur.",
          "• Stripe: Anbieter der Zahlungsabwicklung.",
          "• Vercel: Anbieter der Hosting-Infrastruktur.",
          "• Google Maps / Google Business Profile: Drittanbieter-Bewertungsplattform.",
          "Buy & Click, SL garantiert nicht die kontinuierliche Verfügbarkeit von Drittanbieterdiensten.",
        ],
      },
      {
        title: "9. Geistiges und gewerbliches Eigentum",
        content: [
          "Alle Rechte des geistigen und gewerblichen Eigentums an der Plattform sind ausschließliches Eigentum von Buy & Click, SL oder deren Lizenzgebern.",
          "Dem Nutzer wird eine begrenzte, nicht exklusive, nicht übertragbare und widerrufliche Lizenz zur Nutzung der Plattform gemäß diesen Bedingungen gewährt.",
          "Der Nutzer behält das Eigentum an den Kundendaten, die in die Plattform eingegeben werden.",
        ],
      },
      {
        title: "10. Dienstverfügbarkeit und -qualität",
        content: [
          "Buy & Click, SL wird sich bemühen, die Plattform kontinuierlich verfügbar zu halten, garantiert jedoch keine 100%ige Verfügbarkeit. Der Dienst kann vorübergehend unterbrochen werden durch:",
          "• Geplante oder ungeplante Wartungsarbeiten.",
          "• Ausfälle integrierter Drittanbieterdienste.",
          "• Höhere Gewalt oder Zufallsereignisse.",
          "• Unterbrechungen der Infrastrukturdienste.",
          "Buy & Click, SL garantiert nicht, dass die durch den Dienst erzielten Ergebnisse spezifisch oder vorhersehbar sein werden.",
        ],
      },
      {
        title: "11. Haftungsbeschränkung",
        content: [
          "Im maximal zulässigen Umfang des anwendbaren Rechts haftet Buy & Click, SL nicht für:",
          "• Direkte, indirekte, zufällige, besondere oder Folgeschäden aus der Nutzung des Dienstes.",
          "• Verlust von Gewinnen, Einnahmen, Daten oder Unternehmensreputation.",
          "• Den Inhalt KI-generierter Nachrichten.",
          "• Den Inhalt von Nachrichten, die Endkunden über WhatsApp senden.",
          "• Auf Google Maps, Trustpilot oder anderen Plattformen veröffentlichte Bewertungen.",
          "• Handlungen oder Entscheidungen der Endkunden des Nutzers.",
          "• Technische Probleme oder Maßnahmen von Drittanbieter-Bewertungsplattformen.",
          "• Die Nichteinhaltung von Datenschutzverpflichtungen durch den Nutzer.",
          "Die maximale Haftung von Buy & Click, SL übersteigt nicht den in den drei (3) Monaten vor dem schadenauslösenden Ereignis gezahlten Gesamtbetrag.",
        ],
      },
      {
        title: "13. Kontosperrung und -kündigung",
        content: [
          "Buy & Click, SL behält sich das Recht vor, das Konto eines Nutzers mit oder ohne Vorankündigung zu sperren oder zu kündigen bei:",
          "• Verstoß gegen diese Bedingungen oder die Nutzungsrichtlinien integrierter Drittanbieterdienste.",
          "• Nichtzahlung der Abonnementgebühren.",
          "• Betrügerischer, missbräuchlicher oder rechtswidriger Nutzung des Dienstes.",
          "• Aufforderung durch eine zuständige Behörde.",
          "Nach der Kontokündigung kann Buy & Click, SL alle zugehörigen Daten nach Ablauf der in der Datenschutzrichtlinie festgelegten Aufbewahrungsfrist dauerhaft löschen.",
        ],
      },
      {
        title: "14. Datenverarbeitung im Auftrag des Nutzers (Art. 28 DSGVO)",
        content: [
          "Im Rahmen der Dienstleistungserbringung fungiert Buy & Click, SL als Auftragsverarbeiter für den Nutzer (Unternehmen), der als Verantwortlicher fungiert.",
          "Gemäß Artikel 28 der Verordnung (EU) 2016/679 (DSGVO) verpflichtet sich Buy & Click, SL, personenbezogene Daten nur gemäß den dokumentierten Weisungen des Verantwortlichen zu verarbeiten und alle geeigneten Sicherheitsmaßnahmen zu ergreifen.",
          "Der Nutzer als Verantwortlicher garantiert, dass er über eine ausreichende Rechtsgrundlage für die Verarbeitung der Kundendaten verfügt.",
        ],
      },
      {
        title: "15. Änderung der Bedingungen",
        content: [
          "Buy & Click, SL behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Änderungen werden dem Nutzer mindestens 15 Tage vor Inkrafttreten per E-Mail oder Plattformhinweis mitgeteilt. Die weitere Nutzung des Dienstes nach Inkrafttreten der Änderungen gilt als Zustimmung.",
        ],
      },
      {
        title: "16. Anwendbares Recht und Gerichtsstand",
        content: [
          "Diese Bedingungen unterliegen dem spanischen Recht. Für die Beilegung von Streitigkeiten unterwerfen sich die Parteien den Gerichten Spaniens.",
          "Für Beschwerden von Verbrauchern in der Europäischen Union ist auch die Online-Streitbeilegungsplattform der EU verfügbar.",
        ],
      },
    ],
  },

  it: {
    metaTitle: "Termini e Condizioni | ReseñasYa",
    metaDesc: "Condizioni generali di utilizzo del servizio ReseñasYa.",
    legalDoc: "Documento legale",
    pageTitle: "Termini e Condizioni d'Uso",
    lastUpdatedDate: "28 maggio 2026",
    sections: [
      {
        title: "2. Descrizione del servizio",
        content: [
          "ReseñasYa è una piattaforma SaaS (Software as a Service) che consente alle attività locali di automatizzare la raccolta di recensioni su Google Maps e altre piattaforme inviando messaggi WhatsApp ai propri clienti. Il servizio include:",
          "• Invio di messaggi WhatsApp personalizzati ai clienti tramite l'API Twilio.",
          "• Analisi automatica del sentiment delle risposte dei clienti tramite intelligenza artificiale (Claude AI di Anthropic).",
          "• Generazione automatica di messaggi di follow-up tramite intelligenza artificiale, senza revisione umana prima dell'invio.",
          "• Reindirizzamento dei clienti soddisfatti al profilo Google Maps o ad altre piattaforme di recensioni dell'attività.",
          "• Dashboard di gestione con statistiche e metriche di soddisfazione dei clienti.",
          "• Personalizzazione del tono e dei messaggi di comunicazione.",
          "• Sistema di incentivi opzionale (piano Pro) per incoraggiare la pubblicazione di recensioni.",
        ],
      },
      {
        title: "3. Condizioni di accesso e registrazione",
        content: [
          "Per utilizzare la Piattaforma è necessario completare il processo di registrazione fornendo un indirizzo e-mail valido e una password. Registrandoti, garantisci che:",
          "• Hai più di 18 anni o disponi della capacità giuridica sufficiente per stipulare contratti.",
          "• Agisci per conto proprio o hai l'autorizzazione espressa per rappresentare l'azienda che registri.",
          "• Le informazioni fornite sono veritiere, accurate e complete.",
          "• Manterrai aggiornate le informazioni del tuo account.",
          "Sei responsabile della riservatezza delle tue credenziali di accesso. Devi notificarci immediatamente qualsiasi utilizzo non autorizzato del tuo account.",
        ],
      },
      {
        title: "4. Uso accettabile del servizio",
        content: [
          "L'utente si impegna a utilizzare la Piattaforma in conformità con la legge, la morale, l'ordine pubblico, le presenti Condizioni e le politiche di utilizzo accettabile dei servizi di terze parti integrati.",
          "Sono espressamente vietati:",
          "• L'invio di messaggi WhatsApp a persone che non hanno acconsentito a ricevere comunicazioni commerciali, conformemente al GDPR.",
          "• L'utilizzo della Piattaforma per inviare spam, messaggi fraudolenti, ingannevoli o con contenuto illecito.",
          "• L'utilizzo del servizio per attività che violano i diritti di terzi.",
          "• Tentativi di accesso ai dati di altri utenti registrati sulla Piattaforma.",
          "• Ingegneria inversa, decompilazione o disassemblaggio di componenti software.",
          "• Sovraccarico dei sistemi della Piattaforma tramite attacchi automatizzati.",
          "• Rivendita o sub-licenza dell'accesso al servizio a terzi senza autorizzazione espressa.",
        ],
      },
      {
        title: "5. Intelligenza artificiale: funzionamento, limitazioni ed esclusione di responsabilità",
        content: [
          "La Piattaforma utilizza tecnologia di intelligenza artificiale (Claude AI di Anthropic) per due funzioni principali: (i) analizzare il sentiment delle risposte ricevute dai clienti finali dell'utente e (ii) generare automaticamente messaggi di follow-up inviati a tali clienti tramite WhatsApp.",
          "L'utente riconosce ed accetta espressamente quanto segue:",
          "• I messaggi generati dall'IA non vengono revisionati da Buy & Click, SL prima dell'invio. Il processo è completamente automatico.",
          "• Buy & Click, SL non è responsabile del contenuto dei messaggi generati dall'IA.",
          "• L'IA può commettere errori nella classificazione del sentiment.",
          "• L'utente si assume la responsabilità dell'impatto dei messaggi generati dall'IA.",
          "• La disponibilità del servizio IA dipende da Anthropic.",
        ],
      },
      {
        title: "6. Risposte dei clienti finali e contenuto delle recensioni",
        content: [
          "L'utilizzo della Piattaforma implica la comunicazione con i clienti finali dell'utente tramite WhatsApp. Buy & Click, SL non ha alcun controllo sulle risposte che tali clienti possono inviare né sulle recensioni che possono pubblicare.",
          "• Buy & Click, SL non è responsabile del contenuto delle risposte dei clienti finali.",
          "• Buy & Click, SL non è responsabile delle recensioni pubblicate su piattaforme di terze parti.",
          "• Buy & Click, SL non garantisce che i clienti lascino recensioni positive.",
          "• L'utente è responsabile della gestione delle comunicazioni con i propri clienti.",
        ],
      },
      {
        title: "7. Piattaforme di recensioni di terze parti: esclusione di responsabilità",
        content: [
          "La Piattaforma facilita i collegamenti ai profili di recensioni su Google Maps, Trustpilot, App Store, Google Play, Yelp e altre piattaforme di terze parti. Buy & Click, SL non ha alcuna relazione commerciale con tali piattaforme.",
          "• Buy & Click, SL non è responsabile delle decisioni di Google Maps, Trustpilot o di altre piattaforme di recensioni.",
          "• Buy & Click, SL non è responsabile dei problemi tecnici delle piattaforme di terze parti.",
          "• L'utente è responsabile del rispetto delle politiche di ciascuna piattaforma di recensioni.",
          "L'utente terrà indenne Buy & Click, SL da qualsiasi reclamo, sanzione o danno derivante da azioni di piattaforme di recensioni di terze parti.",
        ],
      },
      {
        title: "8. Servizi di terze parti",
        content: [
          "La Piattaforma integra servizi di terze parti per il suo funzionamento. L'utilizzo di questi servizi è soggetto alle loro condizioni:",
          "• Twilio: fornitore del servizio di messaggistica WhatsApp.",
          "• Anthropic (Claude AI): fornitore del servizio di analisi del sentiment tramite IA.",
          "• Supabase: fornitore dell'infrastruttura di database e autenticazione.",
          "• Stripe: fornitore del servizio di elaborazione dei pagamenti.",
          "• Vercel: fornitore dell'infrastruttura di hosting.",
          "• Google Maps / Google Business Profile: piattaforma di recensioni di terze parti.",
          "Buy & Click, SL non garantisce la disponibilità continua dei servizi di terze parti.",
        ],
      },
      {
        title: "9. Proprietà intellettuale e industriale",
        content: [
          "Tutti i diritti di proprietà intellettuale e industriale sulla Piattaforma sono di proprietà esclusiva di Buy & Click, SL o dei suoi licenziatari.",
          "All'utente viene concessa una licenza d'uso limitata, non esclusiva, non trasferibile e revocabile per accedere alla Piattaforma.",
          "L'utente mantiene la proprietà dei dati dei propri clienti inseriti nella Piattaforma.",
        ],
      },
      {
        title: "10. Disponibilità e qualità del servizio",
        content: [
          "Buy & Click, SL farà del suo meglio per mantenere la Piattaforma disponibile in modo continuativo, ma non garantisce una disponibilità del 100%. Il servizio può essere interrotto temporaneamente per:",
          "• Attività di manutenzione programmate o non programmate.",
          "• Guasti nei servizi di terze parti integrati.",
          "• Cause di forza maggiore o eventi fortuiti.",
          "• Interruzioni dei servizi infrastrutturali.",
          "Buy & Click, SL non garantisce che i risultati ottenuti tramite il servizio siano specifici o prevedibili.",
        ],
      },
      {
        title: "11. Limitazione di responsabilità",
        content: [
          "Nella massima misura consentita dalla legge applicabile, Buy & Click, SL non sarà responsabile per:",
          "• Danni diretti, indiretti, incidentali, speciali o consequenziali derivanti dall'utilizzo del servizio.",
          "• Perdita di profitti, entrate, dati o reputazione commerciale.",
          "• Il contenuto dei messaggi generati dall'intelligenza artificiale.",
          "• Il contenuto dei messaggi inviati dai clienti finali tramite WhatsApp.",
          "• Le recensioni pubblicate dai clienti su Google Maps, Trustpilot o altre piattaforme.",
          "• Le azioni o decisioni dei clienti finali dell'utente.",
          "• Problemi tecnici o decisioni delle piattaforme di recensioni di terze parti.",
          "• Il mancato rispetto da parte dell'utente degli obblighi legali in materia di protezione dei dati.",
          "La responsabilità massima di Buy & Click, SL non supererà l'importo totale pagato nei tre (3) mesi precedenti all'evento che ha dato origine al reclamo.",
        ],
      },
      {
        title: "13. Sospensione e cancellazione dell'account",
        content: [
          "Buy & Click, SL si riserva il diritto di sospendere o cancellare l'account di un utente, con o senza preavviso, nei seguenti casi:",
          "• Violazione delle presenti Condizioni o delle politiche di utilizzo dei servizi di terze parti integrati.",
          "• Mancato pagamento delle quote di abbonamento.",
          "• Utilizzo fraudolento, abusivo o illecito del servizio.",
          "• Richiesta di un'autorità competente.",
          "Dopo la cancellazione dell'account, Buy & Click, SL potrà eliminare definitivamente tutti i dati associati una volta trascorso il periodo di conservazione stabilito nella Politica sulla Privacy.",
        ],
      },
      {
        title: "14. Trattamento dei dati per conto dell'utente (Art. 28 GDPR)",
        content: [
          "Nell'ambito della prestazione del servizio, Buy & Click, SL agisce come responsabile del trattamento per conto dell'utente (attività), che agisce come titolare del trattamento.",
          "Ai sensi dell'articolo 28 del Regolamento (UE) 2016/679 (GDPR), Buy & Click, SL si impegna a trattare i dati personali solo secondo le istruzioni documentate del titolare del trattamento e ad applicare tutte le misure di sicurezza appropriate.",
          "L'utente, come titolare del trattamento, garantisce di disporre di una base giuridica sufficiente per trattare i dati dei propri clienti.",
        ],
      },
      {
        title: "15. Modifica delle Condizioni",
        content: [
          "Buy & Click, SL si riserva il diritto di modificare le presenti Condizioni in qualsiasi momento. Le modifiche saranno comunicate all'utente tramite e-mail o avviso sulla Piattaforma con almeno 15 giorni di anticipo. L'uso continuato del servizio dopo l'entrata in vigore delle modifiche implica l'accettazione delle nuove Condizioni.",
        ],
      },
      {
        title: "16. Legge applicabile e giurisdizione",
        content: [
          "Le presenti Condizioni sono regolate dalla legge spagnola. Per la risoluzione di qualsiasi controversia, le parti si sottomettono alla giurisdizione dei tribunali spagnoli.",
          "Per i reclami dei consumatori dell'Unione Europea è disponibile anche la piattaforma di risoluzione delle controversie online dell'UE.",
        ],
      },
    ],
  },

  pt: {
    metaTitle: "Termos e Condições | ReseñasYa",
    metaDesc: "Condições gerais de utilização do serviço ReseñasYa.",
    legalDoc: "Documento legal",
    pageTitle: "Termos e Condições de Utilização",
    lastUpdatedDate: "28 de maio de 2026",
    sections: [
      {
        title: "2. Descrição do serviço",
        content: [
          "ReseñasYa é uma plataforma SaaS (Software as a Service) que permite a negócios locais automatizar a captação de avaliações no Google Maps e outras plataformas através do envio de mensagens WhatsApp aos seus clientes. O serviço inclui:",
          "• Envio de mensagens WhatsApp personalizadas a clientes através da API Twilio.",
          "• Análise automática do sentimento das respostas dos clientes mediante inteligência artificial (Claude AI da Anthropic).",
          "• Geração automática de mensagens de acompanhamento mediante inteligência artificial, sem revisão humana prévia ao envio.",
          "• Redirecionamento de clientes satisfeitos para o perfil do Google Maps ou outras plataformas de avaliações do negócio.",
          "• Painel de gestão com estatísticas e métricas de satisfação dos clientes.",
          "• Personalização do tom e das mensagens de comunicação.",
          "• Sistema de incentivos opcional (plano Pro) para encorajar a publicação de avaliações.",
        ],
      },
      {
        title: "3. Condições de acesso e registo",
        content: [
          "Para utilizar a Plataforma, é necessário completar o processo de registo fornecendo um endereço de e-mail válido e uma palavra-passe. Ao registar-se, garante que:",
          "• Tem mais de 18 anos ou dispõe de capacidade jurídica suficiente para contratar.",
          "• Age em nome próprio ou tem autorização expressa para representar a empresa que regista.",
          "• Os dados fornecidos são verdadeiros, precisos e completos.",
          "• Manterá as informações da sua conta atualizadas.",
          "É responsável pela confidencialidade das suas credenciais de acesso. Deve notificar-nos imediatamente de qualquer utilização não autorizada da sua conta.",
        ],
      },
      {
        title: "4. Utilização aceitável do serviço",
        content: [
          "O utilizador compromete-se a utilizar a Plataforma em conformidade com a lei, a moral, a ordem pública, as presentes Condições e as políticas de utilização aceitável dos serviços de terceiros integrados.",
          "É expressamente proibido:",
          "• Enviar mensagens WhatsApp a pessoas que não tenham consentido em receber comunicações comerciais, em conformidade com o RGPD.",
          "• Utilizar a Plataforma para enviar spam, mensagens fraudulentas, enganosas ou com conteúdo ilícito.",
          "• Usar o serviço para atividades que violem direitos de terceiros.",
          "• Tentar aceder a dados de outros utilizadores registados na Plataforma.",
          "• Realizar engenharia inversa, descompilar ou desmontar qualquer componente do software.",
          "• Sobrecarregar os sistemas da Plataforma através de ataques automatizados.",
          "• Revender ou sub-licenciar o acesso ao serviço a terceiros sem autorização expressa.",
        ],
      },
      {
        title: "5. Inteligência artificial: funcionamento, limitações e isenção de responsabilidade",
        content: [
          "A Plataforma utiliza tecnologia de inteligência artificial (Claude AI da Anthropic) para duas funções principais: (i) analisar o sentimento das respostas recebidas dos clientes finais do utilizador, e (ii) gerar automaticamente mensagens de acompanhamento enviadas a esses clientes via WhatsApp.",
          "O utilizador reconhece e aceita expressamente o seguinte:",
          "• As mensagens geradas pela IA não são revistas pela Buy & Click, SL antes do envio. O processo é completamente automático.",
          "• A Buy & Click, SL não é responsável pelo conteúdo das mensagens geradas pela IA.",
          "• A IA pode falhar na classificação do sentimento.",
          "• O utilizador assume a responsabilidade pelo impacto das mensagens geradas pela IA.",
          "• A disponibilidade do serviço de IA depende da Anthropic.",
        ],
      },
      {
        title: "6. Respostas de clientes finais e conteúdo de avaliações",
        content: [
          "A utilização da Plataforma implica a comunicação com os clientes finais do utilizador via WhatsApp. A Buy & Click, SL não tem qualquer controlo sobre as respostas que esses clientes possam enviar nem sobre as avaliações que possam publicar.",
          "• A Buy & Click, SL não é responsável pelo conteúdo das respostas dos clientes finais.",
          "• A Buy & Click, SL não é responsável pelas avaliações publicadas em plataformas de terceiros.",
          "• A Buy & Click, SL não garante que os clientes deixem avaliações positivas.",
          "• O utilizador é responsável pela gestão das comunicações com os seus clientes.",
        ],
      },
      {
        title: "7. Plataformas de avaliações de terceiros: isenção de responsabilidade",
        content: [
          "A Plataforma facilita ligações a perfis de avaliações no Google Maps, Trustpilot, App Store, Google Play, Yelp e outras plataformas de terceiros. A Buy & Click, SL não tem qualquer relação comercial com essas plataformas.",
          "• A Buy & Click, SL não é responsável pelas decisões do Google Maps, Trustpilot ou de outras plataformas de avaliações.",
          "• A Buy & Click, SL não é responsável por problemas técnicos nas plataformas de terceiros.",
          "• O utilizador é responsável pelo cumprimento das políticas de cada plataforma de avaliações.",
          "O utilizador isentará a Buy & Click, SL de qualquer reclamação, sanção ou dano decorrente de ações de plataformas de avaliações de terceiros.",
        ],
      },
      {
        title: "8. Serviços de terceiros",
        content: [
          "A Plataforma integra serviços de terceiros para o seu funcionamento. A utilização destes serviços está sujeita às suas próprias condições:",
          "• Twilio: fornecedor do serviço de mensagens WhatsApp.",
          "• Anthropic (Claude AI): fornecedor do serviço de análise de sentimento por IA.",
          "• Supabase: fornecedor da infraestrutura de base de dados e autenticação.",
          "• Stripe: fornecedor do serviço de processamento de pagamentos.",
          "• Vercel: fornecedor da infraestrutura de alojamento.",
          "• Google Maps / Google Business Profile: plataforma de avaliações de terceiros.",
          "A Buy & Click, SL não garante a disponibilidade contínua dos serviços de terceiros.",
        ],
      },
      {
        title: "9. Propriedade intelectual e industrial",
        content: [
          "Todos os direitos de propriedade intelectual e industrial sobre a Plataforma são propriedade exclusiva da Buy & Click, SL ou dos seus licenciantes.",
          "É concedida ao utilizador uma licença de utilização limitada, não exclusiva, não transferível e revogável para aceder à Plataforma.",
          "O utilizador conserva a propriedade dos dados dos seus clientes introduzidos na Plataforma.",
        ],
      },
      {
        title: "10. Disponibilidade e qualidade do serviço",
        content: [
          "A Buy & Click, SL fará os seus melhores esforços para manter a Plataforma disponível de forma contínua, mas não garante uma disponibilidade de 100%. O serviço pode ser interrompido temporariamente por:",
          "• Tarefas de manutenção programadas ou não programadas.",
          "• Falhas nos serviços de terceiros integrados.",
          "• Causas de força maior ou caso fortuito.",
          "• Interrupções nos serviços de infraestrutura.",
          "A Buy & Click, SL não garante que os resultados obtidos através da utilização do serviço sejam específicos ou previsíveis.",
        ],
      },
      {
        title: "11. Limitação de responsabilidade",
        content: [
          "Na medida máxima permitida pela legislação aplicável, a Buy & Click, SL não será responsável por:",
          "• Danos diretos, indiretos, incidentais, especiais ou consequentes decorrentes da utilização do serviço.",
          "• Perda de lucros, receitas, dados ou reputação comercial.",
          "• O conteúdo das mensagens geradas pela inteligência artificial.",
          "• O conteúdo das mensagens enviadas pelos clientes finais do utilizador via WhatsApp.",
          "• As avaliações publicadas por clientes no Google Maps, Trustpilot ou outras plataformas.",
          "• As ações, omissões ou decisões dos clientes finais do utilizador.",
          "• Problemas técnicos ou decisões de plataformas de avaliações de terceiros.",
          "• O incumprimento por parte do utilizador das suas obrigações legais em matéria de proteção de dados.",
          "A responsabilidade máxima da Buy & Click, SL não excederá o montante total pago nos três (3) meses anteriores ao evento que originou a reclamação.",
        ],
      },
      {
        title: "13. Suspensão e cancelamento da conta",
        content: [
          "A Buy & Click, SL reserva-se o direito de suspender ou cancelar a conta de um utilizador, com ou sem aviso prévio, nas seguintes circunstâncias:",
          "• Incumprimento das presentes Condições ou das políticas de utilização dos serviços de terceiros integrados.",
          "• Falta de pagamento das quotas de subscrição.",
          "• Utilização fraudulenta, abusiva ou ilícita do serviço.",
          "• Pedido de uma autoridade competente.",
          "Após o cancelamento da conta, a Buy & Click, SL poderá eliminar permanentemente todos os dados associados uma vez decorrido o período de retenção estabelecido na Política de Privacidade.",
        ],
      },
      {
        title: "14. Tratamento de dados por conta do utilizador (Art. 28 RGPD)",
        content: [
          "No âmbito da prestação do serviço, a Buy & Click, SL atua como subcontratante por conta do utilizador (negócio), que atua como responsável pelo tratamento.",
          "Nos termos do artigo 28.º do Regulamento (UE) 2016/679 (RGPD), a Buy & Click, SL compromete-se a tratar os dados pessoais apenas de acordo com as instruções documentadas do responsável pelo tratamento e a aplicar todas as medidas de segurança adequadas.",
          "O utilizador, como responsável pelo tratamento, garante que dispõe de base jurídica suficiente para tratar os dados dos seus clientes.",
        ],
      },
      {
        title: "15. Modificação das Condições",
        content: [
          "A Buy & Click, SL reserva-se o direito de modificar as presentes Condições a qualquer momento. As modificações serão comunicadas ao utilizador por e-mail ou aviso na Plataforma com um mínimo de 15 dias de antecedência. A utilização continuada do serviço após a entrada em vigor das alterações implica a aceitação das novas Condições.",
        ],
      },
      {
        title: "16. Legislação aplicável e jurisdição",
        content: [
          "As presentes Condições são regidas pela legislação espanhola. Para a resolução de qualquer litígio, as partes submetem-se à jurisdição dos Tribunais de Espanha.",
          "Para reclamações de consumidores da União Europeia, está também disponível a plataforma de resolução de litígios em linha da UE.",
        ],
      },
    ],
  },
};

export function getTermsContent(locale: string): TermsContent {
  return CONTENT[locale] ?? CONTENT.es;
}
