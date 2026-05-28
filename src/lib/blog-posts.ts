export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "como-conseguir-mas-resenas-google-maps",
    title: "Cómo conseguir más reseñas en Google Maps: guía definitiva para negocios locales",
    description: "Aprende las estrategias más efectivas para multiplicar tus reseñas en Google Maps, mejorar tu posicionamiento local y atraer más clientes.",
    date: "2026-05-28",
    readTime: "7 min",
    category: "Google Maps",
    content: `
## Por qué las reseñas en Google Maps son tan importantes

Cuando alguien busca «restaurante cerca de mí» o «peluquería en Barcelona», Google Maps muestra los resultados ordenados por relevancia. Y uno de los factores más importantes de esa relevancia son las reseñas: cuántas tienes y qué nota media tienen.

Un negocio con 150 reseñas y 4.7★ aparecerá sistemáticamente por encima de uno con 15 reseñas y 4.9★. El volumen importa, y mucho.

Además, el impacto va más allá del posicionamiento. Según estudios de comportamiento del consumidor:

- El **92% de los usuarios** lee reseñas online antes de visitar un negocio local.
- Una mejora de **media estrella** (de 4.0 a 4.5) puede aumentar los ingresos entre un **19 y un 24%**.
- Los negocios con más de **50 reseñas** generan significativamente más clics desde Google Maps.

## El problema: los clientes satisfechos no dejan reseñas (solos)

Aquí está el gran paradox: los clientes satisfechos rara vez dejan reseñas de forma espontánea. Las personas que sí lo hacen sin que nadie se lo pida suelen estar en los extremos: muy satisfechas o muy insatisfechas.

El resultado es una distorsión sistemática: tus clientes mediocres sobrerepresentados en tu perfil, y tus clientes encantados invisibles.

¿La solución? Pedir la reseña en el momento justo, de la forma correcta.

## Las 5 estrategias más efectivas para conseguir reseñas

### 1. Pide la reseña en el momento de máxima satisfacción

El momento más eficaz es justo cuando el cliente acaba de tener la experiencia positiva: al terminar la comida, al salir de la peluquería, al recibir el pedido. Cuanto más tiempo pase, menor es la probabilidad de que actúe.

**Clave**: no esperes días. Si vas a pedirla, hazlo en las primeras 24-48 horas.

### 2. Haz que sea ridículamente fácil

Cada paso extra que el cliente tenga que dar reduce la conversión a la mitad. Si tienes que decirle «busca mi negocio en Google, haz clic en reseñas, luego en escribir reseña...» habrás perdido el 80% antes de que llegue.

La URL directa de reseña de Google Maps (del tipo `g.page/tu-negocio/review`) lleva al cliente directamente a la pantalla de escritura. Sin pasos intermedios.

### 3. Usa WhatsApp, no el correo electrónico

La tasa de apertura de emails comerciales está en torno al 20-25%. La de los mensajes de WhatsApp supera el 98%.

Un WhatsApp personalizado («Hola María, ¿qué tal la experiencia en nuestra clínica?») tiene una tasa de respuesta incomparablemente mayor que cualquier email automatizado.

### 4. Filtra el sentimiento antes de pedir la reseña

No pidas la reseña directamente. Primero pregunta por la experiencia. Si la respuesta es positiva, entonces envía el enlace a Google Maps.

Si la respuesta es negativa o neutra, responde con empatía e intenta resolver el problema en privado. De esta forma:
- Evitas reseñas negativas que podrían no haberse publicado.
- Generas una segunda oportunidad de mejorar la experiencia antes de que llegue a Google.

Esto es exactamente lo que hace ReseñasYa con su análisis de sentimiento por IA.

### 5. Automatiza el proceso para que sea escalable

Pedir reseñas manualmente funciona cuando tienes 5 clientes al día. Con 50, se vuelve imposible sin un sistema.

La automatización por WhatsApp permite enviar el mensaje personalizado a cada cliente sin intervención manual, asegurando que ningún cliente satisfecho se quede sin recibir la petición.

## Qué evitar

**No ofrecer incentivos directamente a cambio de una reseña positiva** en plataformas que lo prohíben expresamente (como Google). Puedes ofrecer un incentivo por dejar una reseña honesta, pero nunca condicionado a que sea positiva.

**No compres reseñas**. Google detecta patrones de reseñas falsas y puede eliminarlas o penalizar tu perfil.

**No respondas a las reseñas negativas de forma agresiva**. Tu respuesta la ven todos los potenciales clientes, no solo quien la escribió. Una respuesta empática y profesional convierte un comentario negativo en una demostración de calidad de servicio.

## Conclusión

Conseguir más reseñas en Google Maps no es cuestión de suerte ni de rogar a tus clientes. Es cuestión de sistema: el momento correcto, el canal correcto (WhatsApp), el mensaje correcto y el filtro de sentimiento que protege tu reputación.

Los negocios que automatizan este proceso consiguen entre 3 y 10 veces más reseñas que los que lo dejan al azar.
    `.trim(),
  },
  {
    slug: "por-que-clientes-no-dejan-resenas-whatsapp",
    title: "Por qué los clientes no dejan reseñas (y cómo solucionarlo con WhatsApp)",
    description: "Descubre la psicología detrás de por qué los clientes satisfechos no dejan reseñas y qué estrategias funcionan de verdad para cambiar ese comportamiento.",
    date: "2026-05-22",
    readTime: "5 min",
    category: "Estrategia",
    content: `
## El problema que tiene todo negocio local

Tienes clientes que adoran tu negocio. Te lo dicen en persona, te recomiendan a sus amigos, vuelven una y otra vez. Pero en Google Maps tienes 18 reseñas con una media de 3.9★.

¿Qué pasa?

## La psicología de las reseñas

Los seres humanos tenemos una tendencia natural a actuar cuando estamos en los extremos emocionales. Si algo nos ha molestado mucho, lo contamos. Si algo nos ha impresionado tanto que nos ha sorprendido, también.

Pero la gran mayoría de experiencias positivas quedan en «fue muy bien». Y «fue muy bien» no se traduce en acción sin un catalizador externo.

Esto crea lo que se llama **sesgo de negatividad en las reseñas**: los clientes insatisfechos están sobrerrepresentados porque su motivación para actuar es mayor.

### Las 4 razones por las que los clientes satisfechos no dejan reseñas

**1. No recuerdan hacerlo**

La intención existe justo cuando salen del negocio. Pero en cuanto llegan a casa, otras cosas llenan su mente. Al día siguiente, la motivación ha desaparecido.

**2. No saben cómo hacerlo**

Mucha gente, especialmente de más de 45 años, no sabe exactamente cómo llegar a la pantalla de «escribir una reseña» en Google Maps. Si el proceso tiene más de 2 pasos, abandonan.

**3. No ven el impacto**

«¿Para qué sirve que yo lo ponga? Ya tienen muchas reseñas». Los clientes subestiman el impacto individual de su reseña. Si les explicas que con 50 reseñas pueden ayudarte a aparecer entre los primeros resultados, la percepción cambia.

**4. Nadie se lo ha pedido**

Esta es la causa más frecuente y la más solucionable. La mayoría de negocios simplemente nunca piden la reseña. O la piden de forma tan genérica («si quieres dejarnos una reseña...») que no genera ninguna acción.

## Por qué WhatsApp funciona mejor que cualquier alternativa

### Email: visible pero ignorado

Los emails de «valora tu experiencia» tienen tasas de apertura del 20% en el mejor caso, y tasas de clic mucho menores. Son fáciles de ignorar, acabar en spam y olvidar.

### QR en el local: la fricción mata la conversión

Los carteles con QR funcionan cuando el cliente está en el local y tiene el móvil en mano. Pero la mayoría de los clientes que salen satisfechos no se paran a escanear nada.

### Google te pide que lo hagas: no funciona

Las peticiones automáticas de Google en Maps («¿Has visitado X? Deja una reseña») generan muy poca conversión porque son frías, sin contexto y se mezclan con notificaciones de otras apps.

### WhatsApp: el canal de máxima atención

- **Tasa de apertura: >98%**. El cliente lo abre casi siempre.
- **Es personal**. Un mensaje con el nombre del cliente («Hola Miguel, ¿qué tal te fue ayer?») se lee diferente a un email corporativo.
- **El enlace está a un clic**. Sin buscar nada, sin pasos intermedios.
- **El momento es controlable**. Puedes enviarlo exactamente cuando el cliente está más satisfecho.

## La fórmula que funciona

1. **Espera el momento justo**: entre 30 minutos y 48 horas después de la experiencia.
2. **Pregunta por la experiencia primero**, no pidas la reseña directamente.
3. **Si la respuesta es positiva**, entonces envía el enlace a Google Maps con un mensaje entusiasta.
4. **Si la respuesta es negativa**, responde con empatía y gestiona el problema en privado.

Este proceso, que es exactamente lo que automatiza ReseñasYa, convierte entre el 25% y el 40% de los clientes contactados en nuevas reseñas positivas.

## Qué decirles

El mensaje no debe sonar a plantilla corporativa. Tiene que sonar como lo que es: un negocio que se preocupa por sus clientes.

**Ejemplo que funciona:**
> «Hola María, ayer fue un placer tenerte en nuestra clínica. ¿Cómo te fue con el tratamiento?»

Si responde positivamente:
> «¡Qué alegría saberlo! Si tienes un momento, nos ayudaría muchísimo que lo compartieras en Google Maps. Te dejo el enlace directo para que no tengas que buscar nada 👉 [enlace]»

El tono cercano, el agradecimiento genuino y la facilidad del enlace directo son los tres ingredientes del mensaje que convierte.
    `.trim(),
  },
  {
    slug: "gestionar-resenas-negativas",
    title: "Reseñas negativas: cómo gestionarlas para ganar más clientes (no perderlos)",
    description: "Una reseña negativa bien gestionada puede convertirse en tu mejor argumento de venta. Aprende la estrategia correcta para responder y proteger tu reputación.",
    date: "2026-05-15",
    readTime: "6 min",
    category: "Reputación",
    content: `
## La paradoja de las reseñas negativas

Parece contraintuitivo, pero los negocios con alguna reseña negativa bien gestionada generan más confianza que los que tienen solo reseñas perfectas.

¿Por qué? Porque el consumidor moderno es escéptico. Un perfil con 200 reseñas de 5★ sin una sola queja parece falso. Un perfil con 4.7★, algunas críticas puntuales y respuestas profesionales parece auténtico.

La clave no es evitar las reseñas negativas a toda costa. La clave es gestionarlas bien.

## El doble impacto de una reseña negativa

Cuando alguien deja una reseña negativa en tu negocio, el impacto es doble:

1. **La reseña en sí**: la ven los potenciales clientes que consultan tu perfil.
2. **Tu respuesta**: la ven exactamente las mismas personas. Y tu respuesta dice tanto sobre tu negocio como la queja original.

Una queja sobre tiempo de espera respondida con un «Entendemos tu frustración, estamos mejorando nuestros procesos» demuestra que eres un negocio que escucha. Una respuesta agresiva o defensiva confirma la peor versión del negocio.

## La estrategia de 4 pasos para responder

### Paso 1: Respira y espera antes de responder

Nunca respondas en caliente. Si la reseña es injusta o exagerada, es fácil reaccionar defensivamente. Dale unas horas, o incluso un día, y redacta la respuesta en frío.

### Paso 2: Agradece y valida

Empieza siempre agradeciendo el feedback, aunque te parezca injusto.

> «Gracias por tomarte el tiempo de compartir tu experiencia, [nombre]. Lamentamos que no haya sido lo que esperabas.»

Este comienzo desescala inmediatamente el tono del intercambio.

### Paso 3: Reconoce (si procede) y explica (sin excusas)

Si la queja tiene base, reconócela. Si hay contexto relevante, compártelo con calma y sin excusas.

> «El día que nos visitaste tuvimos una incidencia con uno de nuestros proveedores que afectó a los tiempos. Entendemos que esto no es aceptable para la experiencia que queremos ofrecer.»

### Paso 4: Ofrece una solución e invita al diálogo privado

No resuelvas el problema en público. Ofrece canales privados.

> «Nos gustaría compensarte por la experiencia. Si puedes contactarnos en [email] o llamarnos al [teléfono], nos ocuparemos personalmente de que tu próxima visita sea muy diferente.»

Este movimiento tiene dos efectos: muestra a todos los lectores que te importa resolverlo, y extrae la conversación del espacio público.

## Qué hacer con reseñas falsas o malintencionadas

Las reseñas claramente falsas (de personas que nunca han visitado tu negocio) o que contienen información falsa pueden reportarse a Google para su revisión.

Para reportarlas:
1. Entra en tu perfil de Google Business Profile.
2. Haz clic en los tres puntos junto a la reseña.
3. Selecciona «Marcar como inapropiada».
4. Selecciona el motivo adecuado (contenido falso, spam, etc.).

Google no elimina siempre todas las reseñas reportadas, pero sí revisa los casos con evidencia clara.

## La mejor defensa: un volumen alto de reseñas positivas

La forma más efectiva de neutralizar una reseña negativa no es quitarla, sino diluirla con un volumen mucho mayor de reseñas positivas.

Un negocio con 3 reseñas donde una es negativa tiene un 33% de su perfil en rojo. El mismo negocio con 150 reseñas y esa misma reseña negativa tiene un impacto mínimo.

Por eso la captación activa de reseñas positivas no es solo una estrategia de crecimiento: es también la mejor estrategia defensiva.

## Cómo evitar que las reseñas negativas lleguen a publicarse

La mejor estrategia es detectar la insatisfacción antes de que llegue a Google.

El proceso que usa ReseñasYa:
1. Se envía un WhatsApp al cliente preguntando por su experiencia.
2. Si la respuesta expresa insatisfacción, la IA responde con empatía e invita al diálogo privado.
3. Solo los clientes con respuestas positivas reciben el enlace a Google Maps.

Esto no elimina todas las reseñas negativas (los clientes siempre pueden ir directamente a Google), pero reduce significativamente su frecuencia porque los problemas se gestionan antes de que lleguen al espacio público.

## Conclusión

Las reseñas negativas son inevitables. La pregunta no es cómo evitarlas, sino cómo convertirlas en una oportunidad para demostrar la calidad de tu servicio.

Un negocio que responde con profesionalidad, empatía y soluciones concretas demuestra exactamente los valores que sus potenciales clientes quieren ver antes de tomar una decisión.
    `.trim(),
  },
  {
    slug: "algoritmo-google-maps-reputacion-local",
    title: "El algoritmo local de Google: qué son las reseñas y cómo afectan tu posición",
    description: "Entiende cómo funciona el algoritmo de Google Maps para negocios locales y por qué las reseñas son uno de los factores más determinantes para aparecer en los primeros resultados.",
    date: "2026-05-08",
    readTime: "6 min",
    category: "SEO Local",
    content: `
## ¿Qué es el «pack local» de Google?

Cuando buscas «fontanero en Madrid» o «pizza cerca de mí», Google muestra un bloque especial con 3 negocios destacados antes de los resultados web habituales. Esto se llama el **Local Pack** o paquete local.

Aparecer ahí es, para un negocio local, el equivalente a estar en la primera página de resultados. Los tres negocios del pack local reciben entre el 44% y el 60% de todos los clics de esa búsqueda.

## Los 3 pilares del algoritmo local de Google

Google usa tres factores principales para decidir qué negocios aparecen en el pack local:

### 1. Relevancia
¿Tu negocio hace lo que el usuario busca? Google cruza las categorías de tu ficha, las palabras clave en tu descripción y los términos que aparecen en tus reseñas.

Si tu negocio es una clínica dental y los clientes mencionan «blanqueamiento dental» o «ortodoncia» en sus reseñas, esos términos ayudan a Google a entender lo que haces.

### 2. Proximidad
¿Qué tan cerca está tu negocio del usuario que busca? Google prioriza los negocios físicamente más cercanos al punto de búsqueda.

Este factor no puedes controlarlo directamente (no puedes mover tu negocio), pero sí puedes compensarlo con más señales de relevancia y prominencia.

### 3. Prominencia
¿Qué tan conocido y valorado es tu negocio? Este es el factor donde las reseñas tienen un peso determinante.

La prominencia se calcula a partir de:
- **Número total de reseñas**
- **Puntuación media (★)**
- **Frecuencia y recencia de las reseñas** (reseñas recientes pesan más)
- **Respuestas del negocio a las reseñas**
- **Menciones en la web y en otros directorios**

## Cómo afectan las reseñas al ranking

### El volumen importa más que la perfección

Un negocio con 4.6★ y 200 reseñas supera sistemáticamente a uno con 4.9★ y 20 reseñas. Google interpreta el volumen como una señal de confianza y actividad real.

### La recencia es un factor activo

Una reseña de hace 3 años pesa menos que una de la semana pasada. Google premia a los negocios que siguen recibiendo reseñas de forma continua. Si tuviste un pico de reseñas hace un año y luego nada, el algoritmo lo nota.

Por eso la captación de reseñas tiene que ser un proceso continuo, no una campaña puntual.

### Las palabras clave en las reseñas ayudan al SEO local

Cuando un cliente escribe «el mejor sushi de Valencia» o «fisioterapeuta deportivo en Bilbao» en su reseña, esas palabras clave refuerzan tu relevancia para esas búsquedas.

No puedes (ni debes) pedirle a tus clientes que usen palabras concretas, pero sí puedes diseñar el momento de la petición para que respondan en el contexto del servicio que han recibido.

### Las respuestas del propietario también suman

Responder a las reseñas (tanto positivas como negativas) es una señal de actividad que Google valora positivamente. Además, tus respuestas pueden incluir términos relevantes de forma natural.

## La estrategia de reseñas como ventaja competitiva

Muchos negocios locales no tienen una estrategia activa de captación de reseñas. Eso significa que si tú sí la tienes, en poco tiempo puedes superar a competidores que llevan más años en el mercado.

**Caso habitual:** un restaurante que lleva 10 años abierto con 40 reseñas acumuladas vs. uno que lleva 1 año con un sistema activo y ya tiene 120 reseñas. El segundo aparece primero en Google Maps.

El volumen y la recencia pueden compensar años de ventaja competitiva.

## Qué no funciona (y puede hacerte daño)

**Comprar reseñas falsas**: Google tiene algoritmos específicos para detectar patrones de reseñas inauténticas. Pueden eliminar las reseñas, penalizar tu perfil o en casos extremos eliminarte del pack local.

**Reseñas de empleados o familiares**: misma detección, mismo riesgo.

**Pedir reseñas a cambio de algo concreto**: depende de la plataforma. Google no lo permite explícitamente, aunque la línea entre incentivo y compra de reseña puede ser ambigua (ver nuestro artículo sobre el tema legal).

## Conclusión

El algoritmo de Google Maps no es un misterio. Premia a los negocios que tienen muchas reseñas reales, recientes y variadas, que responden a sus clientes y que se mantienen activos.

La buena noticia: este es un campo donde el tamaño o la antigüedad del negocio importan menos que la consistencia. Un sistema de captación activa de reseñas puede cambiar completamente tu visibilidad local en cuestión de meses.
    `.trim(),
  },
  {
    slug: "legal-pedir-resenas-whatsapp-rgpd",
    title: "¿Es legal pedir reseñas a clientes por WhatsApp? RGPD, LSSICE y buenas prácticas",
    description: "Resuelve todas las dudas legales sobre el envío de WhatsApps para pedir reseñas: qué dice el RGPD, qué base legitimadora aplica y cómo hacerlo correctamente.",
    date: "2026-05-01",
    readTime: "7 min",
    category: "Legal",
    content: `
## La pregunta que frena a muchos negocios

«¿Puedo enviar un WhatsApp a mis clientes para pedirles una reseña?»

La respuesta corta es: **sí, en la mayoría de los casos, si se hace correctamente**. La respuesta larga requiere entender un poco el marco legal aplicable.

> *Nota: Este artículo es informativo y no constituye asesoramiento legal. Consulta con un abogado especializado en protección de datos para tu caso concreto.*

## El marco legal aplicable en España

El envío de comunicaciones comerciales a clientes está regulado principalmente por dos normas:

1. **Reglamento (UE) 2016/679 (RGPD)**: regula el tratamiento de datos personales, incluyendo el número de teléfono.
2. **Ley 34/2002, de Servicios de la Sociedad de la Información (LSSICE)**: regula específicamente las comunicaciones comerciales electrónicas (incluyendo mensajes de WhatsApp).

## La base legitimadora: ¿consentimiento o interés legítimo?

Para enviar un WhatsApp a un cliente necesitas una **base legitimadora** conforme al RGPD. Las dos más relevantes en este contexto son:

### Consentimiento explícito (Art. 6.1.a RGPD)

El cliente ha dado su consentimiento expreso para recibir comunicaciones del negocio. Este es el camino más seguro y el más claro.

**Cómo obtenerlo**: en el formulario de contacto, en la hoja de reserva, en el ticket de compra o en cualquier momento previo al servicio, el cliente marca una casilla o firma indicando que acepta recibir comunicaciones del negocio por WhatsApp.

### Interés legítimo (Art. 6.1.f RGPD)

El tratamiento es necesario para satisfacer un interés legítimo del responsable o de terceros, siempre que no prevalezcan los intereses o derechos fundamentales del interesado.

Pedir opinión a un cliente sobre un servicio que acaba de recibir puede considerarse un interés legítimo del negocio, especialmente cuando:
- El número de teléfono fue facilitado voluntariamente por el cliente.
- La comunicación está directamente relacionada con la relación comercial existente.
- El cliente puede oponerse fácilmente a recibir futuras comunicaciones.

**Importante**: el interés legítimo no es un comodín. Requiere un balance entre el interés del negocio y los derechos del cliente, y puede ser cuestionado. El consentimiento explícito es siempre más sólido.

## La LSSICE y las comunicaciones no solicitadas

El artículo 21 de la LSSICE prohíbe el envío de comunicaciones comerciales electrónicas no solicitadas «por correo electrónico u otro medio de comunicación electrónica equivalente».

WhatsApp puede considerarse un medio de comunicación electrónica equivalente, lo que significa que:
- El envío de publicidad pura o no solicitada está prohibido sin consentimiento previo.
- Sin embargo, las comunicaciones relacionadas directamente con la relación comercial existente tienen un tratamiento distinto.

## ¿Pedir una reseña es una comunicación comercial?

Aquí está el matiz que más confusión genera: **pedir una reseña no es exactamente una comunicación comercial** en el sentido estricto (no estás vendiendo nada).

Es más bien una comunicación de seguimiento del servicio prestado, similar a preguntar «¿cómo te fue?». Eso la aleja del supuesto de publicidad no solicitada y la acerca al interés legítimo.

Ahora bien, si el mensaje incluye una oferta, un descuento o cualquier elemento promocional (como el sistema de incentivos), entonces sí tiene componente comercial y el consentimiento explícito es más importante.

## Buenas prácticas para hacerlo correctamente

### 1. Usa el número que el cliente te dio voluntariamente

El número debe haber sido proporcionado directamente por el cliente en el contexto de la relación comercial (reserva, compra, registro). No uses bases de datos externas ni números obtenidos de terceros.

### 2. Informa al cliente en el momento del servicio

Lo más limpio: en el momento en que el cliente te da su número, informarle de que podrías enviarle un mensaje de seguimiento sobre su experiencia. Una frase en el ticket, en el formulario o verbalmente basta.

### 3. Incluye siempre la opción de no recibir más mensajes

Cada mensaje debe ofrecer al cliente una forma fácil de darse de baja. Un simple «si no deseas recibir más mensajes, responde STOP» cumple con la obligación de respetar el derecho de oposición.

### 4. No almacenes los números más tiempo del necesario

Los datos personales (número de teléfono) deben conservarse solo durante el tiempo necesario para la finalidad para la que fueron recogidos. Define una política de retención clara (por ejemplo, 12 meses desde el último contacto).

### 5. Documenta el consentimiento o la base legitimadora

En caso de inspección de la AEPD (Agencia Española de Protección de Datos), debes poder demostrar la base sobre la que trataste los datos. Guarda registro de cómo obtuviste el número y en qué condiciones.

## Resumen: ¿puedo enviar el WhatsApp?

| Situación | Recomendación |
|-----------|--------------|
| Cliente te dio el número voluntariamente + relación comercial reciente | Sí, con base en interés legítimo o consentimiento |
| Cliente consintió expresamente recibir comunicaciones | Sí, sin dudas |
| Número obtenido de fuente externa | No recomendable sin consentimiento claro |
| Incluyes oferta o incentivo en el mensaje | Aconsejable tener consentimiento explícito |

La captación de reseñas por WhatsApp es una práctica legal y habitual cuando se hace con los datos correctos, en el contexto adecuado y respetando el derecho de oposición del cliente.
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
