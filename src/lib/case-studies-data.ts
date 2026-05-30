import { Utensils, Dumbbell, ShoppingBag, Stethoscope, Smartphone, Coffee, type LucideIcon } from "lucide-react";

export interface CaseStudyItem {
  Icon: LucideIcon;
  sector: string;
  name: string;
  before: string;
  after: string;
  stats: { label: string; value: string }[];
}

const CASE_STUDIES: Record<string, CaseStudyItem[]> = {
  es: [
    {
      Icon: Utensils,
      sector: "Restauración · Google Maps",
      name: "Pizzería Napoli · Sevilla",
      before: "23 reseñas en 2 años. Solo llegaban en momentos de queja.",
      after: "97 reseñas y 4.7★ en 2 meses. Apareció en el top 3 local y llenó la lista de espera los fines de semana.",
      stats: [
        { label: "Reseñas nuevas", value: "+74" },
        { label: "Media Google", value: "4.7★" },
        { label: "Tiempo", value: "2 meses" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Incentivo",
      name: "FitBody Gym · Valencia",
      before: "58 reseñas en 4 años con NPS de 72. Los socios estaban satisfechos pero no dejaban valoraciones.",
      after: "Incentivo: 5★ + captura = 10% dto. en cuota. La IA verifica y envía el código al instante. 134 reseñas en 6 semanas.",
      stats: [
        { label: "Reseñas nuevas", value: "+134" },
        { label: "Media Google", value: "4.9★" },
        { label: "Conversión incentivo", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-commerce · Trustpilot",
      name: "ModaTrend · Barcelona",
      before: "Alta satisfacción pero cero presencia en Trustpilot, donde sus compradores decidían si comprar.",
      after: "WhatsApp automático 48 h post-entrega. En 4 meses: 289 valoraciones con 4.7★ y +22% de conversión.",
      stats: [
        { label: "Reseñas Trustpilot", value: "289" },
        { label: "Media", value: "4.7★" },
        { label: "Conversión web", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Salud · Google Maps + Trustpilot",
      name: "Clínica Dental Ortiz · Zaragoza",
      before: "Sector sensible: necesitaban captar opiniones positivas sin que las negativas llegaran a publicarse.",
      after: "62 reseñas nuevas en 4 meses. Las opiniones negativas se gestionaron en privado. Ninguna llegó a publicarse.",
      stats: [
        { label: "Reseñas nuevas", value: "+62" },
        { label: "Reseñas negativas públicas", value: "0" },
        { label: "Satisfacción", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "App móvil · App Store + Play Store",
      name: "RecetApp · Madrid",
      before: "18.000 usuarios activos pero solo 312 valoraciones en total. Ratio bajo que lastraba el ranking.",
      after: "WhatsApps por dispositivo: App Store para iOS, Play Store para Android. +520 valoraciones y top 10 en su categoría.",
      stats: [
        { label: "Valoraciones nuevas", value: "+520" },
        { label: "Plataformas", value: "2" },
        { label: "Posición", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Cafetería · Google Maps + Incentivo",
      name: "Bloom Coffee · Zaragoza",
      before: "31 reseñas y 4.2★. La competencia de enfrente tenía 180 y aparecía siempre primera en Google.",
      after: "5★ + captura = café de cortesía verificado por IA. Sin fricción. De 31 a 97 reseñas y 4.8★ en 3 semanas.",
      stats: [
        { label: "Reseñas nuevas", value: "+66" },
        { label: "Media Google", value: "4.8★" },
        { label: "Tiempo", value: "3 semanas" },
      ],
    },
  ],

  en: [
    {
      Icon: Utensils,
      sector: "Restaurant · Google Maps",
      name: "Tony's Trattoria · New York",
      before: "23 reviews in 2 years. Only complaints came in — happy customers never bothered.",
      after: "97 reviews and 4.7★ in 2 months. Ranked in the local top 3 and had a waiting list on weekends.",
      stats: [
        { label: "New reviews", value: "+74" },
        { label: "Google rating", value: "4.7★" },
        { label: "Time", value: "2 months" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Incentive",
      name: "IronCore Gym · Chicago",
      before: "58 reviews in 4 years with an NPS of 72. Members were happy but never left ratings.",
      after: "Incentive: 5★ + screenshot = 10% off next month. AI verifies and sends the code instantly. 134 reviews in 6 weeks.",
      stats: [
        { label: "New reviews", value: "+134" },
        { label: "Google rating", value: "4.9★" },
        { label: "Incentive conversion", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-commerce · Trustpilot",
      name: "StyleNest · Los Angeles",
      before: "High satisfaction but zero Trustpilot presence — that's where buyers decided whether to purchase.",
      after: "Automated WhatsApp 48h after delivery. In 4 months: 289 reviews with 4.7★ and +22% conversion.",
      stats: [
        { label: "Trustpilot reviews", value: "289" },
        { label: "Rating", value: "4.7★" },
        { label: "Web conversion", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Healthcare · Google Maps + Trustpilot",
      name: "Bright Smile Dental · Austin",
      before: "Sensitive sector: they needed to collect positive opinions without negative ones going public.",
      after: "62 new reviews in 4 months. Negative feedback handled privately. None made it to public platforms.",
      stats: [
        { label: "New reviews", value: "+62" },
        { label: "Public negative reviews", value: "0" },
        { label: "Satisfaction", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "Mobile app · App Store + Play Store",
      name: "FoodieApp · San Francisco",
      before: "18,000 active users but only 312 ratings. The low ratio was hurting their ranking.",
      after: "WhatsApp by device: App Store for iOS, Play Store for Android. +520 ratings and top 10 in their category.",
      stats: [
        { label: "New ratings", value: "+520" },
        { label: "Platforms", value: "2" },
        { label: "Position", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Café · Google Maps + Incentive",
      name: "Morning Bloom Café · Portland",
      before: "31 reviews and 4.2★. The café across the street had 180 and always appeared first on Google.",
      after: "5★ + screenshot = free pastry on next visit, verified by AI. No friction. From 31 to 97 reviews and 4.8★ in 3 weeks.",
      stats: [
        { label: "New reviews", value: "+66" },
        { label: "Google rating", value: "4.8★" },
        { label: "Time", value: "3 weeks" },
      ],
    },
  ],

  fr: [
    {
      Icon: Utensils,
      sector: "Restauration · Google Maps",
      name: "Pizzeria Bella Napoli · Paris",
      before: "23 avis en 2 ans. Seuls les mécontents prenaient la peine d'écrire.",
      after: "97 avis et 4,7★ en 2 mois. Apparition dans le top 3 local et liste d'attente le week-end.",
      stats: [
        { label: "Nouveaux avis", value: "+74" },
        { label: "Note Google", value: "4,7★" },
        { label: "Durée", value: "2 mois" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Incentive",
      name: "FitZone Gym · Lyon",
      before: "58 avis en 4 ans avec un NPS de 72. Les membres étaient satisfaits mais ne laissaient pas de notes.",
      after: "Incentive : 5★ + capture d'écran = 10% de réduction sur la prochaine mensualité. L'IA vérifie et envoie le code instantanément. 134 avis en 6 semaines.",
      stats: [
        { label: "Nouveaux avis", value: "+134" },
        { label: "Note Google", value: "4,9★" },
        { label: "Conv. incentive", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-commerce · Trustpilot",
      name: "ModeParis · Bordeaux",
      before: "Forte satisfaction mais zéro présence sur Trustpilot — là où les acheteurs décidaient d'acheter ou non.",
      after: "WhatsApp automatique 48h après la livraison. En 4 mois : 289 avis avec 4,7★ et +22% de conversion.",
      stats: [
        { label: "Avis Trustpilot", value: "289" },
        { label: "Note", value: "4,7★" },
        { label: "Conversion web", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Santé · Google Maps + Trustpilot",
      name: "Cabinet Dentaire Duval · Marseille",
      before: "Secteur sensible : ils devaient recueillir des avis positifs sans que les négatifs soient publiés.",
      after: "62 nouveaux avis en 4 mois. Les retours négatifs gérés en privé. Aucun n'a été publié.",
      stats: [
        { label: "Nouveaux avis", value: "+62" },
        { label: "Avis négatifs publics", value: "0" },
        { label: "Satisfaction", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "Application mobile · App Store + Play Store",
      name: "RecetteApp · Toulouse",
      before: "18 000 utilisateurs actifs mais seulement 312 notes. Ce ratio faible pénalisait le classement.",
      after: "WhatsApp selon l'appareil : App Store pour iOS, Play Store pour Android. +520 notes et top 10 dans leur catégorie.",
      stats: [
        { label: "Nouvelles notes", value: "+520" },
        { label: "Plateformes", value: "2" },
        { label: "Position", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Café · Google Maps + Incentive",
      name: "Café des Fleurs · Nantes",
      before: "31 avis et 4,2★. Le concurrent en face avait 180 avis et apparaissait toujours en premier sur Google.",
      after: "5★ + capture = café offert à la prochaine visite, vérifié par l'IA. Sans friction. De 31 à 97 avis et 4,8★ en 3 semaines.",
      stats: [
        { label: "Nouveaux avis", value: "+66" },
        { label: "Note Google", value: "4,8★" },
        { label: "Durée", value: "3 semaines" },
      ],
    },
  ],

  de: [
    {
      Icon: Utensils,
      sector: "Restaurant · Google Maps",
      name: "Trattoria Bella Italia · Berlin",
      before: "23 Bewertungen in 2 Jahren. Nur Unzufriedene schrieben — zufriedene Kunden schwiegen.",
      after: "97 Bewertungen und 4,7★ in 2 Monaten. Unter den Top 3 in der Umgebung und Warteliste am Wochenende.",
      stats: [
        { label: "Neue Bewertungen", value: "+74" },
        { label: "Google-Bewertung", value: "4,7★" },
        { label: "Zeitraum", value: "2 Monate" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Anreiz",
      name: "FitPower Gym · München",
      before: "58 Bewertungen in 4 Jahren bei einem NPS von 72. Die Mitglieder waren zufrieden, hinterließen aber keine Bewertungen.",
      after: "Anreiz: 5★ + Screenshot = 10% Rabatt auf den nächsten Monat. KI prüft und sendet den Code sofort. 134 Bewertungen in 6 Wochen.",
      stats: [
        { label: "Neue Bewertungen", value: "+134" },
        { label: "Google-Bewertung", value: "4,9★" },
        { label: "Anreiz-Conversion", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-Commerce · Trustpilot",
      name: "ModeTrend · Hamburg",
      before: "Hohe Zufriedenheit, aber null Trustpilot-Präsenz — dort entschieden Käufer, ob sie kauften.",
      after: "Automatische WhatsApp 48 Std. nach Lieferung. In 4 Monaten: 289 Bewertungen mit 4,7★ und +22% Conversion.",
      stats: [
        { label: "Trustpilot-Bewertungen", value: "289" },
        { label: "Bewertung", value: "4,7★" },
        { label: "Web-Conversion", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Gesundheit · Google Maps + Trustpilot",
      name: "Zahnarztpraxis Müller · Frankfurt",
      before: "Sensibles Umfeld: positive Meinungen sammeln, ohne dass negative veröffentlicht werden.",
      after: "62 neue Bewertungen in 4 Monaten. Negative Rückmeldungen privat gehandhabt. Keine wurde veröffentlicht.",
      stats: [
        { label: "Neue Bewertungen", value: "+62" },
        { label: "Öffentl. neg. Bewertungen", value: "0" },
        { label: "Zufriedenheit", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "Mobile App · App Store + Play Store",
      name: "RezeptApp · Köln",
      before: "18.000 aktive Nutzer, aber nur 312 Bewertungen. Das niedrige Verhältnis schadete dem Ranking.",
      after: "WhatsApp nach Gerät: App Store für iOS, Play Store für Android. +520 Bewertungen und Top 10 in der Kategorie.",
      stats: [
        { label: "Neue Bewertungen", value: "+520" },
        { label: "Plattformen", value: "2" },
        { label: "Position", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Café · Google Maps + Anreiz",
      name: "Café Sonnenschein · Düsseldorf",
      before: "31 Bewertungen und 4,2★. Das Café gegenüber hatte 180 und erschien immer als Erstes bei Google.",
      after: "5★ + Screenshot = kostenloses Getränk beim nächsten Besuch, von KI geprüft. Ohne Aufwand. Von 31 auf 97 Bewertungen und 4,8★ in 3 Wochen.",
      stats: [
        { label: "Neue Bewertungen", value: "+66" },
        { label: "Google-Bewertung", value: "4,8★" },
        { label: "Zeitraum", value: "3 Wochen" },
      ],
    },
  ],

  it: [
    {
      Icon: Utensils,
      sector: "Ristorazione · Google Maps",
      name: "Pizzeria Napoli Vera · Roma",
      before: "23 recensioni in 2 anni. Arrivavano solo nei momenti di lamentela.",
      after: "97 recensioni e 4,7★ in 2 mesi. Entrata nella top 3 locale e lista d'attesa nei weekend.",
      stats: [
        { label: "Nuove recensioni", value: "+74" },
        { label: "Media Google", value: "4,7★" },
        { label: "Tempo", value: "2 mesi" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Incentivo",
      name: "FitGym Milano · Milano",
      before: "58 recensioni in 4 anni con NPS di 72. I soci erano soddisfatti ma non lasciavano valutazioni.",
      after: "Incentivo: 5★ + screenshot = 10% di sconto sulla prossima quota. L'IA verifica e invia il codice all'istante. 134 recensioni in 6 settimane.",
      stats: [
        { label: "Nuove recensioni", value: "+134" },
        { label: "Media Google", value: "4,9★" },
        { label: "Conv. incentivo", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-commerce · Trustpilot",
      name: "ModaItalia · Torino",
      before: "Alta soddisfazione ma zero presenza su Trustpilot — dove i compratori decidevano se acquistare.",
      after: "WhatsApp automatico 48h dopo la consegna. In 4 mesi: 289 recensioni con 4,7★ e +22% di conversione.",
      stats: [
        { label: "Recensioni Trustpilot", value: "289" },
        { label: "Media", value: "4,7★" },
        { label: "Conversione web", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Salute · Google Maps + Trustpilot",
      name: "Studio Dentistico Rossi · Firenze",
      before: "Settore sensibile: dovevano raccogliere opinioni positive senza che quelle negative venissero pubblicate.",
      after: "62 nuove recensioni in 4 mesi. Feedback negativi gestiti in privato. Nessuno è stato pubblicato.",
      stats: [
        { label: "Nuove recensioni", value: "+62" },
        { label: "Recensioni negative pubbliche", value: "0" },
        { label: "Soddisfazione", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "App mobile · App Store + Play Store",
      name: "RicettaApp · Bologna",
      before: "18.000 utenti attivi ma solo 312 valutazioni. Il basso rapporto penalizzava il ranking.",
      after: "WhatsApp per dispositivo: App Store per iOS, Play Store per Android. +520 valutazioni e top 10 nella categoria.",
      stats: [
        { label: "Nuove valutazioni", value: "+520" },
        { label: "Piattaforme", value: "2" },
        { label: "Posizione", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Caffè · Google Maps + Incentivo",
      name: "Caffè dei Fiori · Venezia",
      before: "31 recensioni e 4,2★. Il concorrente di fronte ne aveva 180 e appariva sempre primo su Google.",
      after: "5★ + screenshot = caffè omaggio alla prossima visita, verificato dall'IA. Senza attrito. Da 31 a 97 recensioni e 4,8★ in 3 settimane.",
      stats: [
        { label: "Nuove recensioni", value: "+66" },
        { label: "Media Google", value: "4,8★" },
        { label: "Tempo", value: "3 settimane" },
      ],
    },
  ],

  pt: [
    {
      Icon: Utensils,
      sector: "Restauração · Google Maps",
      name: "Pizzaria Nápoles · Lisboa",
      before: "23 avaliações em 2 anos. Só chegavam em momentos de reclamação.",
      after: "97 avaliações e 4,7★ em 2 meses. Apareceu no top 3 local e encheu a lista de espera aos fins de semana.",
      stats: [
        { label: "Novas avaliações", value: "+74" },
        { label: "Média Google", value: "4,7★" },
        { label: "Tempo", value: "2 meses" },
      ],
    },
    {
      Icon: Dumbbell,
      sector: "Fitness · Google Maps + Incentivo",
      name: "FitClub Gym · Porto",
      before: "58 avaliações em 4 anos com NPS de 72. Os sócios estavam satisfeitos mas não deixavam avaliações.",
      after: "Incentivo: 5★ + captura = 10% de desconto na próxima mensalidade. A IA verifica e envia o código de imediato. 134 avaliações em 6 semanas.",
      stats: [
        { label: "Novas avaliações", value: "+134" },
        { label: "Média Google", value: "4,9★" },
        { label: "Conv. incentivo", value: "62%" },
      ],
    },
    {
      Icon: ShoppingBag,
      sector: "E-commerce · Trustpilot",
      name: "ModaPortugal · Braga",
      before: "Alta satisfação mas zero presença no Trustpilot — onde os compradores decidiam se comprar.",
      after: "WhatsApp automático 48h após a entrega. Em 4 meses: 289 avaliações com 4,7★ e +22% de conversão.",
      stats: [
        { label: "Avaliações Trustpilot", value: "289" },
        { label: "Média", value: "4,7★" },
        { label: "Conversão web", value: "+22%" },
      ],
    },
    {
      Icon: Stethoscope,
      sector: "Saúde · Google Maps + Trustpilot",
      name: "Clínica Dentária Silva · Coimbra",
      before: "Setor sensível: precisavam de recolher opiniões positivas sem que as negativas fossem publicadas.",
      after: "62 novas avaliações em 4 meses. Opiniões negativas geridas em privado. Nenhuma foi publicada.",
      stats: [
        { label: "Novas avaliações", value: "+62" },
        { label: "Avaliações neg. públicas", value: "0" },
        { label: "Satisfação", value: "94%" },
      ],
    },
    {
      Icon: Smartphone,
      sector: "App móvel · App Store + Play Store",
      name: "ReceitaApp · Setúbal",
      before: "18.000 utilizadores ativos mas apenas 312 avaliações. O baixo rácio prejudicava o ranking.",
      after: "WhatsApp por dispositivo: App Store para iOS, Play Store para Android. +520 avaliações e top 10 na categoria.",
      stats: [
        { label: "Novas avaliações", value: "+520" },
        { label: "Plataformas", value: "2" },
        { label: "Posição", value: "Top 10" },
      ],
    },
    {
      Icon: Coffee,
      sector: "Café · Google Maps + Incentivo",
      name: "Café das Flores · Aveiro",
      before: "31 avaliações e 4,2★. O concorrente em frente tinha 180 e aparecia sempre primeiro no Google.",
      after: "5★ + captura = café de cortesia na próxima visita, verificado pela IA. Sem fricção. De 31 para 97 avaliações e 4,8★ em 3 semanas.",
      stats: [
        { label: "Novas avaliações", value: "+66" },
        { label: "Média Google", value: "4,8★" },
        { label: "Tempo", value: "3 semanas" },
      ],
    },
  ],
};

export function getCaseStudies(locale: string): CaseStudyItem[] {
  return CASE_STUDIES[locale] ?? CASE_STUDIES["en"];
}
