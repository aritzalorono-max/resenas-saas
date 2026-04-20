# ReseñasYa — Documentación técnica

SaaS para negocios locales que automatiza la captación de reseñas en Google Maps mediante WhatsApp. El negocio introduce el teléfono del cliente, se envía un WhatsApp preguntando por su experiencia, Claude analiza la respuesta y dirige automáticamente a los clientes satisfechos a dejar reseña en Google.

---

## Arquitectura del sistema

```
┌────────────────────────────────────────────────────────────────┐
│  Next.js 15 App Router (Vercel / Node.js)                      │
│                                                                │
│  ┌──────────────┐    ┌─────────────────────────────────────┐   │
│  │  App Router  │    │  API Routes                         │   │
│  │  /dashboard  │    │  POST /api/send-review-request      │   │
│  │  /clientes   │    │  POST /api/twilio-webhook           │   │
│  │  /resenas    │    │  GET  /api/auth/callback            │   │
│  │  /config     │    └──────────────┬──────────────────────┘   │
│  └──────────────┘                   │                          │
└─────────────────────────────────────┼──────────────────────────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
        ┌─────▼──────┐        ┌───────▼──────┐       ┌───────▼──────┐
        │  Supabase  │        │    Twilio    │       │  Anthropic   │
        │ PostgreSQL │        │  WhatsApp    │       │ Claude Sonnet│
        │    Auth    │        │   Business   │       │  (sentiment) │
        └────────────┘        └─────────────┘       └─────────────┘
```

### Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth + DB | Supabase (PostgreSQL + RLS) |
| Mensajería | Twilio WhatsApp Business |
| IA | Anthropic Claude (`claude-sonnet-4-6`) |
| Estilos | Tailwind CSS 4 |
| Tipado | TypeScript strict |
| Despliegue | Vercel (serverless) |

### Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/          # Páginas login y registro (sin sidebar)
│   ├── (dashboard)/     # Páginas protegidas con layout compartido
│   │   ├── dashboard/   # Resumen y estadísticas
│   │   ├── clientes/    # Envío de solicitudes
│   │   ├── resenas/     # Historial de reseñas
│   │   └── configuracion/
│   ├── api/
│   │   ├── send-review-request/  # Envío WhatsApp + creación registro
│   │   ├── twilio-webhook/       # Recepción respuestas + análisis IA
│   │   └── auth/callback/        # OAuth callback de Supabase
│   └── layout.tsx       # Root layout: metadata PWA, viewport
│
├── components/
│   └── layout/
│       ├── BottomNav.tsx  # Navegación inferior móvil
│       └── LogoutButton.tsx
│
├── lib/
│   ├── supabase/         # Clientes server / client / middleware
│   ├── constants.ts      # Plantillas de mensajes (única fuente de verdad)
│   ├── messages.ts       # Construcción de mensajes de seguimiento
│   ├── claude.ts         # Análisis de sentimiento con Anthropic
│   ├── twilio.ts         # Cliente Twilio, envío, formateo de números
│   ├── business.ts       # CRUD negocio en Supabase
│   ├── review-requests.ts # CRUD solicitudes de reseña
│   ├── validation.ts     # Validación de inputs (nombre, teléfono, URL)
│   ├── rate-limit.ts     # Rate limiting basado en DB (serverless-safe)
│   └── logger.ts         # Logger con prefijo [ReseñasYa]
│
├── types/index.ts        # Tipos TypeScript globales
└── middleware.ts         # Protección de rutas con Supabase Auth
```

---

## Base de datos

### Tablas

**`businesses`** — Un registro por usuario autenticado.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | PK |
| `user_id` | UUID | FK → `auth.users(id)` |
| `name` | TEXT | Nombre del negocio |
| `description` | TEXT | Descripción corta (opcional) |
| `website_url` | TEXT | URL de la web (opcional) |
| `google_maps_url` | TEXT | URL de reseñas de Google Maps |
| `welcome_message` | TEXT | Mensaje inicial con `{nombre}` y `{negocio}` |
| `tone` | TEXT | `tuteo` \| `usted` \| `juvenil` |

**`review_requests`** — Una fila por solicitud enviada.

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | UUID | PK |
| `business_id` | UUID | FK → `businesses(id)` |
| `customer_name` | TEXT | Nombre del cliente |
| `customer_phone` | TEXT | Teléfono en formato E.164 (`+34612345678`) |
| `status` | TEXT | `pending` \| `positive` \| `negative` \| `neutral` \| `no_response` |
| `customer_response` | TEXT | Texto libre enviado por el cliente |
| `sentiment_score` | FLOAT | 0.0–1.0 (1.0 = máximo positivo) |
| `twilio_message_sid` | TEXT | ID de mensaje de Twilio |
| `follow_up_sent` | BOOLEAN | Si ya se envió el mensaje de seguimiento |
| `created_at` | TIMESTAMPTZ | Fecha de envío |
| `responded_at` | TIMESTAMPTZ | Fecha de respuesta del cliente |

**`business_stats`** — Vista calculada (no tabla).

Agrega `total_requests`, `positive_count`, `negative_count`, `neutral_count`, `pending_count`, `no_response_count` y `positive_rate` (%) por negocio.

### Row Level Security (RLS)

- `businesses`: usuarios solo acceden a su propio negocio (`auth.uid() = user_id`).
- `review_requests`: usuarios solo acceden a solicitudes de su negocio.
- El webhook de Twilio usa un **service client** (bypasa RLS) para poder leer solicitudes de cualquier negocio sin contexto de usuario.

---

## Variables de entorno

Copia `.env.local.example` a `.env.local` y rellena todos los valores.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=        # URL del proyecto Supabase (ej: https://xxx.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Clave anon del proyecto (pública, para cliente)
SUPABASE_SERVICE_ROLE_KEY=       # Clave service_role (secreta, solo servidor)

# Twilio WhatsApp
TWILIO_ACCOUNT_SID=              # Account SID de Twilio (ACxxxxxxxx)
TWILIO_AUTH_TOKEN=               # Auth token de Twilio (secreto, para validar webhooks)
TWILIO_WHATSAPP_NUMBER=          # Número con prefijo: whatsapp:+14155238886

# Anthropic
ANTHROPIC_API_KEY=               # API key de Anthropic (sk-ant-...)

# App
NEXT_PUBLIC_APP_URL=             # URL pública de la app (ej: https://resenasya.com)
                                 # Se usa en CORS/CSP de next.config.ts
```

> **Importante**: `SUPABASE_SERVICE_ROLE_KEY` bypasa RLS. Nunca exponerla al cliente. Solo se usa en el webhook de Twilio que corre en servidor.

---

## Endpoints de la API

### `POST /api/send-review-request`

Envía un WhatsApp al cliente y crea el registro en BD.

**Autenticación**: Requiere sesión activa (cookie de Supabase SSR).

**Request body:**
```json
{
  "customer_name": "María García",
  "customer_phone": "+34612345678"
}
```

**Validaciones:**
- `customer_name`: string, máx. 100 caracteres, se sanean caracteres de control.
- `customer_phone`: formato E.164 estricto (`^\+[1-9]\d{6,14}$`).

**Rate limiting (por negocio):**
- Máx. 20 envíos en 5 minutos.
- Máx. 200 envíos en 24 horas.
- Basado en conteo en BD (serverless-safe, no requiere Redis).

**Respuestas:**

| Status | Cuándo |
|--------|--------|
| `200` | Todo OK. Devuelve `{ success: true, data: ReviewRequest }` |
| `400` | Input inválido (nombre o teléfono mal formateado) |
| `401` | No hay sesión activa |
| `404` | El usuario no tiene negocio creado en BD |
| `429` | Rate limit superado |
| `502` | Error de Twilio al enviar el WhatsApp |
| `500` | WhatsApp enviado pero fallo al guardar en BD |

**Flujo interno:**
1. Verifica sesión con `supabase.auth.getUser()`
2. Valida inputs con `validateCustomerName` / `validatePhone`
3. Obtiene negocio con `getBusinessByUserId`
4. Comprueba rate limit con `checkRateLimit`
5. Envía WhatsApp via `sendWhatsAppMessage` (Twilio)
6. Guarda registro con `createReviewRequest`

---

### `POST /api/twilio-webhook`

Recibe los mensajes de respuesta de los clientes vía Twilio.

**Autenticación**: Validación de firma HMAC-SHA1 de Twilio (solo en `NODE_ENV=production`). En desarrollo/test se omite para facilitar pruebas locales.

**Request body** (form-urlencoded, enviado por Twilio):
```
From=whatsapp%3A%2B34612345678&Body=Todo+perfecto%2C+muy+buen+servicio&...
```

**Respuesta:** Siempre `200 OK` con `<Response/>` (TwiML vacío). Twilio requiere 2xx para no reintentar.

**Flujo interno:**
1. Valida firma de Twilio (`X-Twilio-Signature` header)
2. Extrae `From` y `Body` del body form-urlencoded
3. Genera variantes del número (`getPhoneVariants`): Twilio envía `whatsapp:+34612345678`, pero en BD puede estar como `+34612345678`, `34612345678`, `612345678` o `0034612345678`
4. Busca solicitud `pending` con `findPendingRequestByPhone` (JOIN con `businesses`)
5. Analiza sentimiento con `analyzeSentiment` (Claude Sonnet)
6. Actualiza `status`, `customer_response`, `sentiment_score`, `responded_at` en BD
7. Construye mensaje de seguimiento con `buildFollowUpMessage` según sentimiento y tono del negocio
8. Envía el mensaje de seguimiento via Twilio

> Si el paso 6 (actualizar BD) falla, el flujo continúa igualmente para enviar el mensaje de seguimiento al cliente.

---

### `GET /api/auth/callback`

Callback OAuth de Supabase Auth. Intercambia el `code` por una sesión y redirige a `/dashboard`.

---

## Flujo completo paso a paso

```
Negocio introduce nombre + teléfono del cliente
              │
              ▼
POST /api/send-review-request
   ├── Valida sesión y datos
   ├── Comprueba rate limit
   ├── Personaliza welcome_message con {nombre} y {negocio}
   ├── Twilio envía WhatsApp al cliente
   └── Se guarda review_request con status=pending

              │
              ▼ (minutos/horas después)

Cliente responde por WhatsApp: "¡Todo genial, muy recomendable!"
              │
              ▼
POST /api/twilio-webhook  ← Twilio llama a este endpoint
   ├── Valida firma HMAC de Twilio
   ├── Extrae número y mensaje
   ├── Busca review_request pending para ese número
   ├── Claude analiza: { sentiment: "positive", score: 0.92, summary: "..." }
   ├── BD: status=positive, customer_response=..., responded_at=now()
   └── Twilio envía follow-up: "¡Qué alegría! ¿Te animarías a dejar tu opinión en Google Maps? 👉 [url]"

              │
              ▼

Dashboard actualiza estadísticas en tiempo real
(la vista business_stats recalcula al recargar)
```

### Mensajes de seguimiento por sentimiento y tono

| Sentimiento | Acción |
|-------------|--------|
| `positive` | Mensaje entusiasta + enlace a Google Maps para dejar reseña |
| `negative` | Mensaje empático sin enlace, invita a contar qué pasó |
| `neutral` | Mensaje neutral + enlace a Google Maps |
| `fallback` | Se activa cuando no hay `google_maps_url` configurada |

Los textos completos de cada mensaje están en `src/lib/constants.ts` (plantillas) y se construyen en `src/lib/messages.ts`. Para cambiar el copy, edita `constants.ts` directamente — es la única fuente de verdad para todos los textos de WhatsApp.

---

## Configuración de Twilio

1. Crea una cuenta en [twilio.com](https://twilio.com).
2. Activa el **Sandbox de WhatsApp** en Twilio Console → Messaging → Try it out → WhatsApp.
3. El número de sandbox es `whatsapp:+14155238886`. Cópialo en `TWILIO_WHATSAPP_NUMBER`.
4. Los clientes deben enviar el código de activación del sandbox una vez antes de poder recibir mensajes.
5. En el sandbox, configura el webhook "When a message comes in" apuntando a:
   `https://tu-dominio.com/api/twilio-webhook`
6. En producción, usar un número dedicado de WhatsApp Business requiere aprobación de Meta.

---

## Cómo añadir nuevas funcionalidades

### Añadir un nuevo campo al perfil del negocio

1. **BD**: Añade la columna en `supabase/schema.sql` y crea una migración en `supabase/migration_NNN_nombre.sql`.
2. **Tipos**: Actualiza la interfaz `Business` en `src/types/index.ts`.
3. **Datos**: Actualiza `UpdateBusinessParams` en `src/lib/business.ts` si es editable.
4. **UI**: Añade el campo en `src/app/(dashboard)/configuracion/page.tsx`.

### Añadir un nuevo tono de comunicación

1. **Constantes**: Añade un nuevo objeto `ToneTemplates` en `src/lib/constants.ts` y agrégalo al mapa `MESSAGE_TEMPLATES`.
2. **Tipos**: Añade el nuevo valor al tipo `BusinessTone` en `src/types/index.ts`.
3. **BD**: Actualiza el `CHECK` constraint en `businesses.tone` con el nuevo valor.
4. **UI**: Añade la opción al selector de tono en `configuracion/page.tsx`.

### Añadir un nuevo endpoint de API

1. Crea `src/app/api/nombre-ruta/route.ts`.
2. Exporta funciones `GET`, `POST`, etc. según el método HTTP.
3. Usa `createClient()` de `@/lib/supabase/server` para operaciones autenticadas.
4. Usa `logger.info/warn/error` para logs con contexto.
5. Valida todos los inputs externos con funciones de `@/lib/validation.ts`.
6. Documenta el endpoint en este CLAUDE.md.

### Añadir un nuevo estado de reseña

1. Añade el valor al tipo `ReviewStatus` en `src/types/index.ts`.
2. Actualiza el `CHECK` constraint en `review_requests.status` en la BD.
3. Añade la etiqueta y color en `STATUS_LABELS` en `dashboard/page.tsx` y `resenas/page.tsx`.

### Cambiar el modelo de IA

El modelo se define en `src/lib/claude.ts` en la llamada a `anthropic.messages.create`. Cambia `"claude-sonnet-4-6"` por cualquier modelo de Anthropic. El modelo actual (Sonnet 4.6) es suficiente para análisis de sentimiento; considera Haiku 4.5 si el coste es prioritario.

### Añadir análisis adicional con IA

1. Añade una nueva función en `src/lib/claude.ts` (junto a `analyzeSentiment`).
2. Diseña un system prompt que devuelva JSON estructurado para facilitar el parsing.
3. Limita `max_tokens` al mínimo necesario para la respuesta esperada.

---

## Seguridad

- **Validación de inputs**: `src/lib/validation.ts` valida nombre (max 100 chars, sin caracteres de control), teléfono (E.164 estricto) y URL (solo `https://` o `http://`).
- **Rate limiting**: `src/lib/rate-limit.ts` limita 20 envíos/5min y 200/día por negocio, contando directamente en BD (funciona en entornos serverless multi-instancia como Vercel).
- **Firma de Twilio**: El webhook valida la cabecera `X-Twilio-Signature` con HMAC-SHA1 en producción.
- **RLS de Supabase**: Todas las tablas tienen Row Level Security. Los usuarios solo acceden a sus propios datos.
- **Cabeceras de seguridad HTTP**: Configuradas en `next.config.ts` — `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `HSTS`, `Referrer-Policy`, `Permissions-Policy`.
- **Service role key**: Solo se usa en el webhook (server-side), nunca expuesta al cliente.

---

## PWA (Progressive Web App)

La app está configurada como PWA instalable:

- `public/manifest.json`: define nombre, iconos, `display: standalone` y `start_url: /dashboard`.
- `public/icon.svg`: icono verde con estrella.
- `src/app/layout.tsx`: `viewport.viewportFit: "cover"` expone `safe-area-inset` en iPhones con notch.
- `tailwind.config.ts`: utilidad `.safe-bottom` con `padding-bottom: env(safe-area-inset-bottom)` para que el BottomNav no quede tapado por el home indicator de iPhone.
