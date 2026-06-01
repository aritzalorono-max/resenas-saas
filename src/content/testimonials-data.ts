export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  business: string;
  platform: string;
  platformType: "googlemaps" | "appstore" | "playstore" | "trustpilot" | "multi" | "incentive";
  metric: string;
}

const TESTIMONIALS: Record<string, TestimonialItem[]> = {
  es: [
    {
      quote: "En solo 3 semanas pasamos de 47 a 89 reseñas en Google Maps. Lo mejor es que nos avisa si un cliente no está satisfecho antes de que lo publique en Google.",
      name: "Ana Martínez", role: "Propietaria", business: "La Taberna del Sol · Madrid",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 reseñas en 3 semanas",
    },
    {
      quote: "Lo implantamos para nuestros usuarios activos y en 5 semanas subimos de 3.8 a 4.6★ en App Store. Los ratings son esenciales para el ASO y esto lo cambia todo.",
      name: "Javier Moreno", role: "CEO", business: "FinTrack App · Barcelona",
      platform: "App Store", platformType: "appstore", metric: "3.8→4.6★ en App Store",
    },
    {
      quote: "Pusimos el incentivo: reseña de 5★ en Google + captura = 10% de descuento en la próxima cuota. La IA lo verifica sola y manda el código al instante. En un mes, 90 reseñas nuevas.",
      name: "Diego Herrera", role: "Director", business: "FitLife Gym · Sevilla",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "90 reseñas en 1 mes",
    },
    {
      quote: "Como psicóloga necesitaba algo discreto. El tono de la IA es tan cálido que los pacientes responden con naturalidad. Ya tengo 38 reseñas nuevas en Google sin pedirlas yo directamente.",
      name: "Elena Domínguez", role: "Psicóloga", business: "Centro de Psicología Domínguez · Bilbao",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 reseñas en 2 meses",
    },
    {
      quote: "Teníamos clientes muy contentos pero cero reseñas en Trustpilot — que es donde nos buscan antes de comprar. En 4 meses, 180 valoraciones con 4.7★. La conversión subió un 18%.",
      name: "Marta Giménez", role: "Fundadora", business: "BabyTrends · E-commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 reseñas en Trustpilot",
    },
    {
      quote: "El filtro de sentimiento es lo que más me gusta. Si un huésped no está contento, gestionamos el problema en privado. Las malas reseñas han caído un 80%.",
      name: "Miguel Fernández", role: "Director", business: "Hotel Boutique Costa · Málaga",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% reseñas negativas",
    },
    {
      quote: "Nuestra app está en iOS y Android. Configuré dos enlaces: App Store y Play Store. El cliente elige. En 2 meses sumamos más de 500 valoraciones nuevas entre las dos plataformas.",
      name: "Pablo Torres", role: "Product Manager", business: "RecetApp · Madrid",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 valoraciones",
    },
    {
      quote: "Activamos el incentivo en la cafetería: captura de 5★ en Google = café de cortesía en la próxima visita, verificado automáticamente. En 3 semanas: de 31 a 97 reseñas.",
      name: "Lucía Fernández", role: "Propietaria", business: "Bloom Coffee · Zaragoza",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "31→97 reseñas en 3 semanas",
    },
    {
      quote: "Enviamos WhatsApps a Google Maps y a Trustpilot según el perfil del paciente. Los más jóvenes van a Google, los mayores a Trustpilot. Tenemos presencia en las dos y cada vez más reseñas.",
      name: "Carlos Bernal", role: "Director médico", business: "Clínica Bernal · Alicante",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 reseñas en 2 plataformas",
    },
    {
      quote: "Como despacho de abogados, la reputación digital es fundamental. Ahora tenemos más de 90 reseñas en Google y el 96% son de 5★. Ha cambiado completamente cómo nos encuentran los nuevos clientes.",
      name: "Patricia Olmedo", role: "Socia fundadora", business: "Olmedo & Asociados Abogados · Sevilla",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% reseñas de 5★",
    },
  ],

  en: [
    {
      quote: "In just 3 weeks we went from 47 to 89 reviews on Google Maps. The best part is it warns us when a customer isn't happy before they post publicly on Google.",
      name: "Sarah Johnson", role: "Owner", business: "The Golden Fork · New York",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 reviews in 3 weeks",
    },
    {
      quote: "We rolled it out to our active users and in 5 weeks went from 3.8 to 4.6★ on the App Store. Ratings are critical for ASO and this changes everything.",
      name: "Michael Chen", role: "CEO", business: "SpendSmart App · San Francisco",
      platform: "App Store", platformType: "appstore", metric: "3.8→4.6★ on App Store",
    },
    {
      quote: "We set up the incentive: 5★ Google review + screenshot = 10% off your next membership. The AI verifies it automatically and sends the code instantly. 90 new reviews in one month.",
      name: "David Williams", role: "Director", business: "Iron Forge Gym · Chicago",
      platform: "Google Maps + incentive", platformType: "incentive", metric: "90 reviews in 1 month",
    },
    {
      quote: "As a therapist I needed something discreet. The AI's tone is so warm that clients respond naturally. I now have 38 new Google reviews without asking them directly.",
      name: "Emily Carter", role: "Therapist", business: "Carter Therapy Center · Austin",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 reviews in 2 months",
    },
    {
      quote: "We had happy customers but zero Trustpilot reviews — that's where buyers check before purchasing. In 4 months, 180 reviews with 4.7★. Conversion went up 18%.",
      name: "Jessica Torres", role: "Founder", business: "LittleLux · E-commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 reviews on Trustpilot",
    },
    {
      quote: "The sentiment filter is what I love most. If a guest isn't happy, we handle it privately. Negative reviews have dropped 80%.",
      name: "James Miller", role: "Manager", business: "Coastal Boutique Hotel · Miami",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% negative reviews",
    },
    {
      quote: "Our app is on iOS and Android. I set up two links: App Store and Play Store. The user chooses. In 2 months we added over 500 new ratings across both platforms.",
      name: "Ryan Thompson", role: "Product Manager", business: "FoodieApp · Seattle",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 ratings",
    },
    {
      quote: "We ran the incentive at the café: 5★ Google review + screenshot = free pastry on your next visit, verified automatically. In 3 weeks: from 31 to 97 reviews.",
      name: "Amanda Lee", role: "Owner", business: "Morning Bloom Café · Portland",
      platform: "Google Maps + incentive", platformType: "incentive", metric: "31→97 reviews in 3 weeks",
    },
    {
      quote: "We direct patients to Google Maps or Trustpilot based on their profile. Younger patients go to Google, older ones to Trustpilot. Our presence on both keeps growing.",
      name: "Daniel Scott", role: "Medical Director", business: "Scott Medical Group · Boston",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 reviews on 2 platforms",
    },
    {
      quote: "As a law firm, digital reputation is everything. We now have over 90 Google reviews and 96% are 5★. It's completely changed how new clients find us.",
      name: "Laura Adams", role: "Founding Partner", business: "Adams & Reed Law · Los Angeles",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% 5★ reviews",
    },
  ],

  fr: [
    {
      quote: "En seulement 3 semaines, nous sommes passés de 47 à 89 avis sur Google Maps. Le mieux c'est qu'il nous prévient si un client n'est pas satisfait avant qu'il publie sur Google.",
      name: "Sophie Lefebvre", role: "Propriétaire", business: "La Petite Brasserie · Paris",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 avis en 3 semaines",
    },
    {
      quote: "On l'a déployé pour nos utilisateurs actifs et en 5 semaines on est passé de 3.8 à 4.6★ sur l'App Store. Les notes sont essentielles pour l'ASO et ça change tout.",
      name: "Thomas Dubois", role: "PDG", business: "BudgetPro App · Lyon",
      platform: "App Store", platformType: "appstore", metric: "3.8→4.6★ sur l'App Store",
    },
    {
      quote: "On a activé l'incentive : avis 5★ sur Google + capture d'écran = 10% de réduction sur le prochain mois. L'IA vérifie automatiquement et envoie le code instantanément. 90 nouveaux avis en un mois.",
      name: "Pierre Martin", role: "Directeur", business: "FitZone Gym · Marseille",
      platform: "Google Maps + incentive", platformType: "incentive", metric: "90 avis en 1 mois",
    },
    {
      quote: "En tant que psychologue j'avais besoin de quelque chose de discret. Le ton de l'IA est tellement chaleureux que les patients répondent naturellement. J'ai maintenant 38 nouveaux avis Google sans les demander directement.",
      name: "Claire Bernard", role: "Psychologue", business: "Cabinet Bernard · Bordeaux",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 avis en 2 mois",
    },
    {
      quote: "On avait des clients très satisfaits mais zéro avis sur Trustpilot — c'est pourtant là où les acheteurs vérifient avant d'acheter. En 4 mois, 180 avis avec 4.7★. La conversion a augmenté de 18%.",
      name: "Julie Moreau", role: "Fondatrice", business: "BébéChic · E-commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 avis sur Trustpilot",
    },
    {
      quote: "Le filtre de sentiment est ce que j'aime le plus. Si un client n'est pas content, on gère le problème en privé. Les mauvais avis ont chuté de 80%.",
      name: "Nicolas Fontaine", role: "Directeur", business: "Hôtel Côte d'Azur · Nice",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% avis négatifs",
    },
    {
      quote: "Notre app est sur iOS et Android. J'ai configuré deux liens : App Store et Play Store. Le client choisit. En 2 mois on a ajouté plus de 500 nouvelles notes sur les deux plateformes.",
      name: "Antoine Leroy", role: "Product Manager", business: "RecetteApp · Toulouse",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 notes",
    },
    {
      quote: "On a activé l'incentive au café : 5★ sur Google + capture = café offert à la prochaine visite, vérifié automatiquement. En 3 semaines : de 31 à 97 avis.",
      name: "Camille Rousseau", role: "Propriétaire", business: "Café des Fleurs · Nantes",
      platform: "Google Maps + incentive", platformType: "incentive", metric: "31→97 avis en 3 semaines",
    },
    {
      quote: "On envoie des WhatsApps vers Google Maps ou Trustpilot selon le profil du patient. Les plus jeunes vont sur Google, les plus âgés sur Trustpilot. Notre présence sur les deux ne cesse de croître.",
      name: "Marc Girard", role: "Directeur médical", business: "Clinique Girard · Strasbourg",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 avis sur 2 plateformes",
    },
    {
      quote: "En tant que cabinet d'avocats, la réputation numérique est fondamentale. Nous avons maintenant plus de 90 avis Google et 96% sont à 5★. Ça a complètement changé la façon dont les nouveaux clients nous trouvent.",
      name: "Isabelle Dupont", role: "Associée fondatrice", business: "Dupont & Associés Avocats · Lille",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% d'avis 5★",
    },
  ],

  de: [
    {
      quote: "In nur 3 Wochen stiegen wir von 47 auf 89 Bewertungen auf Google Maps. Das Beste: Wir werden benachrichtigt, wenn ein Kunde unzufrieden ist, bevor er öffentlich auf Google postet.",
      name: "Anna Müller", role: "Inhaberin", business: "Gasthaus Zur Sonne · Berlin",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 Bewertungen in 3 Wochen",
    },
    {
      quote: "Wir haben es für unsere aktiven Nutzer eingeführt und sind in 5 Wochen von 3,8 auf 4,6★ im App Store gestiegen. Bewertungen sind entscheidend für das ASO — das ändert alles.",
      name: "Jonas Weber", role: "CEO", business: "BudgetApp · München",
      platform: "App Store", platformType: "appstore", metric: "3,8→4,6★ im App Store",
    },
    {
      quote: "Wir haben den Anreiz eingeführt: 5★-Bewertung bei Google + Screenshot = 10% Rabatt auf den nächsten Monat. Die KI prüft es automatisch und sendet den Code sofort. 90 neue Bewertungen in einem Monat.",
      name: "Tobias Schneider", role: "Leiter", business: "FitPower Gym · Hamburg",
      platform: "Google Maps + Anreiz", platformType: "incentive", metric: "90 Bewertungen in 1 Monat",
    },
    {
      quote: "Als Psychologin brauchte ich etwas Diskretes. Der Ton der KI ist so warm, dass Patienten ganz natürlich antworten. Ich habe jetzt 38 neue Google-Bewertungen, ohne sie direkt darum gebeten zu haben.",
      name: "Lena Fischer", role: "Psychologin", business: "Praxis Fischer · Frankfurt",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 Bewertungen in 2 Monaten",
    },
    {
      quote: "Wir hatten zufriedene Kunden, aber null Trustpilot-Bewertungen — dabei schauen Käufer dort vor dem Kauf nach. In 4 Monaten: 180 Bewertungen mit 4,7★. Die Conversion stieg um 18%.",
      name: "Nina Bauer", role: "Gründerin", business: "BabyStyle · E-Commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 Bewertungen auf Trustpilot",
    },
    {
      quote: "Der Sentiment-Filter ist mein Lieblingsfeature. Wenn ein Gast nicht zufrieden ist, klären wir es privat. Negative Bewertungen sind um 80% zurückgegangen.",
      name: "Markus Hoffmann", role: "Direktor", business: "Hotel Am See · Stuttgart",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% negative Bewertungen",
    },
    {
      quote: "Unsere App ist auf iOS und Android. Ich habe zwei Links konfiguriert: App Store und Play Store. Der Nutzer wählt. In 2 Monaten haben wir über 500 neue Bewertungen auf beiden Plattformen gesammelt.",
      name: "Felix Richter", role: "Product Manager", business: "RezeptApp · Köln",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 Bewertungen",
    },
    {
      quote: "Wir haben den Anreiz im Café aktiviert: 5★-Bewertung bei Google + Screenshot = Gratisgetränk beim nächsten Besuch, automatisch geprüft. In 3 Wochen: von 31 auf 97 Bewertungen.",
      name: "Julia Wagner", role: "Inhaberin", business: "Café Sonnenschein · Düsseldorf",
      platform: "Google Maps + Anreiz", platformType: "incentive", metric: "31→97 Bewertungen in 3 Wochen",
    },
    {
      quote: "Wir leiten Patienten je nach Profil zu Google Maps oder Trustpilot. Jüngere gehen zu Google, ältere zu Trustpilot. Unsere Präsenz auf beiden Plattformen wächst stetig.",
      name: "Stefan Koch", role: "Ärztlicher Direktor", business: "Klinik Koch · Leipzig",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 Bewertungen auf 2 Plattformen",
    },
    {
      quote: "Als Anwaltskanzlei ist der digitale Ruf entscheidend. Wir haben jetzt über 90 Google-Bewertungen und 96% sind 5★. Es hat völlig verändert, wie neue Mandanten uns finden.",
      name: "Monika Becker", role: "Gründungspartnerin", business: "Becker & Partner Rechtsanwälte · Hannover",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% 5★-Bewertungen",
    },
  ],

  it: [
    {
      quote: "In sole 3 settimane siamo passati da 47 a 89 recensioni su Google Maps. La cosa migliore è che ci avvisa se un cliente non è soddisfatto prima che lo pubblichi su Google.",
      name: "Giulia Rossi", role: "Titolare", business: "La Trattoria del Sole · Roma",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 recensioni in 3 settimane",
    },
    {
      quote: "L'abbiamo implementato per i nostri utenti attivi e in 5 settimane siamo passati da 3,8 a 4,6★ su App Store. Le valutazioni sono essenziali per l'ASO e questo cambia tutto.",
      name: "Marco Ferrari", role: "CEO", business: "BudgetApp · Milano",
      platform: "App Store", platformType: "appstore", metric: "3,8→4,6★ su App Store",
    },
    {
      quote: "Abbiamo attivato l'incentivo: recensione 5★ su Google + screenshot = 10% di sconto sulla prossima quota. L'IA lo verifica automaticamente e invia il codice all'istante. 90 nuove recensioni in un mese.",
      name: "Luca Romano", role: "Direttore", business: "FitGym · Napoli",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "90 recensioni in 1 mese",
    },
    {
      quote: "Come psicologa avevo bisogno di qualcosa di discreto. Il tono dell'IA è così caldo che i pazienti rispondono in modo naturale. Ho ora 38 nuove recensioni su Google senza chiederle direttamente.",
      name: "Chiara Esposito", role: "Psicologa", business: "Studio Esposito · Torino",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 recensioni in 2 mesi",
    },
    {
      quote: "Avevamo clienti molto soddisfatti ma zero recensioni su Trustpilot — eppure è lì che i compratori verificano prima di acquistare. In 4 mesi, 180 recensioni con 4,7★. La conversione è salita del 18%.",
      name: "Valentina Ricci", role: "Fondatrice", business: "BambiniChic · E-commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 recensioni su Trustpilot",
    },
    {
      quote: "Il filtro del sentiment è quello che amo di più. Se un ospite non è contento, gestiamo il problema in privato. Le recensioni negative sono calate dell'80%.",
      name: "Alessandro Conti", role: "Direttore", business: "Hotel Costa Azzurra · Firenze",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% recensioni negative",
    },
    {
      quote: "La nostra app è su iOS e Android. Ho configurato due link: App Store e Play Store. L'utente sceglie. In 2 mesi abbiamo aggiunto oltre 500 nuove valutazioni su entrambe le piattaforme.",
      name: "Davide Martinelli", role: "Product Manager", business: "RicettaApp · Bologna",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 valutazioni",
    },
    {
      quote: "Abbiamo attivato l'incentivo al caffè: 5★ su Google + screenshot = caffè omaggio alla prossima visita, verificato automaticamente. In 3 settimane: da 31 a 97 recensioni.",
      name: "Sofia Bruno", role: "Titolare", business: "Caffè dei Fiori · Venezia",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "31→97 recensioni in 3 settimane",
    },
    {
      quote: "Inviamo WhatsApp verso Google Maps o Trustpilot in base al profilo del paziente. I più giovani vanno su Google, i più anziani su Trustpilot. La nostra presenza su entrambi non smette di crescere.",
      name: "Roberto Gallo", role: "Direttore medico", business: "Clinica Gallo · Genova",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 recensioni su 2 piattaforme",
    },
    {
      quote: "Come studio legale, la reputazione digitale è fondamentale. Ora abbiamo più di 90 recensioni su Google e il 96% sono 5★. Ha completamente cambiato il modo in cui i nuovi clienti ci trovano.",
      name: "Paola Moretti", role: "Socia fondatrice", business: "Moretti & Associati Avvocati · Palermo",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% recensioni 5★",
    },
  ],

  pt: [
    {
      quote: "Em apenas 3 semanas passámos de 47 para 89 avaliações no Google Maps. O melhor é que nos avisa se um cliente não está satisfeito antes de publicar no Google.",
      name: "Ana Silva", role: "Proprietária", business: "Tasca do Sol · Lisboa",
      platform: "Google Maps", platformType: "googlemaps", metric: "+42 avaliações em 3 semanas",
    },
    {
      quote: "Implementámos para os nossos utilizadores ativos e em 5 semanas subimos de 3,8 para 4,6★ na App Store. As notas são essenciais para o ASO e isto muda tudo.",
      name: "Pedro Costa", role: "CEO", business: "FinApp · Porto",
      platform: "App Store", platformType: "appstore", metric: "3,8→4,6★ na App Store",
    },
    {
      quote: "Ativámos o incentivo: avaliação 5★ no Google + captura de ecrã = 10% de desconto na próxima mensalidade. A IA verifica automaticamente e envia o código de imediato. 90 novas avaliações num mês.",
      name: "João Santos", role: "Diretor", business: "FitClub Gym · Braga",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "90 avaliações em 1 mês",
    },
    {
      quote: "Como psicóloga precisava de algo discreto. O tom da IA é tão caloroso que os pacientes respondem naturalmente. Tenho agora 38 novas avaliações no Google sem as pedir diretamente.",
      name: "Mariana Ferreira", role: "Psicóloga", business: "Clínica Ferreira · Coimbra",
      platform: "Google Maps", platformType: "googlemaps", metric: "+38 avaliações em 2 meses",
    },
    {
      quote: "Tínhamos clientes muito satisfeitos mas zero avaliações no Trustpilot — que é onde os compradores verificam antes de comprar. Em 4 meses, 180 avaliações com 4,7★. A conversão subiu 18%.",
      name: "Catarina Oliveira", role: "Fundadora", business: "BebéStyle · E-commerce",
      platform: "Trustpilot", platformType: "trustpilot", metric: "180 avaliações no Trustpilot",
    },
    {
      quote: "O filtro de sentimento é o que mais gosto. Se um hóspede não está contente, gerimos o problema em privado. As avaliações negativas caíram 80%.",
      name: "Rui Rodrigues", role: "Diretor", business: "Hotel Costa Dourada · Faro",
      platform: "Google Maps", platformType: "googlemaps", metric: "−80% avaliações negativas",
    },
    {
      quote: "A nossa app está no iOS e Android. Configurei dois links: App Store e Play Store. O utilizador escolhe. Em 2 meses adicionámos mais de 500 novas avaliações nas duas plataformas.",
      name: "Tiago Pereira", role: "Product Manager", business: "ReceitaApp · Setúbal",
      platform: "App Store + Play Store", platformType: "multi", metric: "+500 avaliações",
    },
    {
      quote: "Ativámos o incentivo no café: 5★ no Google + captura = café de cortesia na próxima visita, verificado automaticamente. Em 3 semanas: de 31 para 97 avaliações.",
      name: "Inês Carvalho", role: "Proprietária", business: "Café das Flores · Aveiro",
      platform: "Google Maps + incentivo", platformType: "incentive", metric: "31→97 avaliações em 3 semanas",
    },
    {
      quote: "Enviamos WhatsApps para Google Maps ou Trustpilot consoante o perfil do paciente. Os mais jovens vão para o Google, os mais velhos para o Trustpilot. A nossa presença em ambos não para de crescer.",
      name: "Miguel Almeida", role: "Diretor clínico", business: "Clínica Almeida · Funchal",
      platform: "Google + Trustpilot", platformType: "multi", metric: "+110 avaliações em 2 plataformas",
    },
    {
      quote: "Como escritório de advogados, a reputação digital é fundamental. Temos agora mais de 90 avaliações no Google e 96% são de 5★. Mudou completamente a forma como os novos clientes nos encontram.",
      name: "Filipa Lopes", role: "Sócia fundadora", business: "Lopes & Associados Advogados · Évora",
      platform: "Google Maps", platformType: "googlemaps", metric: "96% avaliações 5★",
    },
  ],
};

export function getTestimonials(locale: string): TestimonialItem[] {
  return TESTIMONIALS[locale] ?? TESTIMONIALS["en"];
}
