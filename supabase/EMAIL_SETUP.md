# Configuración de emails en producción

Guía paso a paso para aplicar las plantillas de marca y configurar el SMTP.
Tiempo estimado: 15-20 minutos.

---

## Índice

1. [Crear cuenta en Resend y verificar el dominio](#1-crear-cuenta-en-resend-y-verificar-el-dominio)
2. [Generar la API Key de Resend](#2-generar-la-api-key-de-resend)
3. [Configurar el SMTP en Supabase](#3-configurar-el-smtp-en-supabase)
4. [Configurar el Site URL y los redirects](#4-configurar-el-site-url-y-los-redirects)
5. [Aplicar las plantillas HTML](#5-aplicar-las-plantillas-html)
6. [Verificar que todo funciona](#6-verificar-que-todo-funciona)

---

## 1. Crear cuenta en Resend y verificar el dominio

Resend es el servicio SMTP recomendado. Plan gratuito: 3.000 emails/mes, 100/día.
Sin SMTP propio los emails salen desde `noreply@mail.supabase.io` (poco profesional y peor entregabilidad).

### 1.1 Crea la cuenta

1. Ve a **https://resend.com** y haz clic en **Get Started** o **Sign Up**.
2. Regístrate con tu email o con GitHub.
3. Confirma el email de verificación que te envíen.

### 1.2 Añade tu dominio

Una vez dentro del dashboard de Resend:

1. En el menú lateral izquierdo, haz clic en **Domains**.
2. Haz clic en el botón **Add Domain** (esquina superior derecha).
3. Escribe tu dominio: `resenasya.com` y haz clic en **Add**.
4. Resend te mostrará **3 registros DNS** que tienes que añadir en tu proveedor de dominio
   (Namecheap, GoDaddy, Cloudflare, etc.). Son registros de tipo TXT y MX. Anótalos.

### 1.3 Añade los registros DNS en tu proveedor

> El proceso varía según el proveedor. El ejemplo es para Cloudflare, que es el más común.

**Si usas Cloudflare:**

1. Ve a **https://dash.cloudflare.com** → selecciona `resenasya.com`.
2. Haz clic en **DNS** en el menú lateral.
3. Para cada uno de los 3 registros que te mostró Resend:
   - Haz clic en **Add record**.
   - Selecciona el tipo (TXT o MX según indique Resend).
   - En **Name** pon el valor del campo "Name" de Resend (suele ser `resend._domainkey` o similar).
   - En **Content** (o Value) pega el valor largo que te da Resend.
   - Deja el proxy **desactivado** (nube gris, no naranja).
   - Haz clic en **Save**.

**Si usas otro proveedor (Namecheap, GoDaddy...):**

La lógica es la misma: ir al panel de DNS y añadir los 3 registros que te indica Resend.
Busca en Google: `[nombre de tu proveedor] añadir registro TXT DNS`.

### 1.4 Verifica el dominio en Resend

1. Vuelve a Resend → **Domains**.
2. Junto a `resenasya.com` verás un botón **Verify** o el estado **Pending**.
3. Haz clic en **Verify DNS Records**.
4. Si los DNS propagaron correctamente, el estado cambiará a **Verified** (fondo verde).
   Si no, espera 5-10 minutos y vuelve a intentarlo. Los DNS pueden tardar hasta 48 horas
   en propagarse, aunque normalmente son minutos.

---

## 2. Generar la API Key de Resend

1. En el menú lateral de Resend, haz clic en **API Keys**.
2. Haz clic en **Create API Key**.
3. En **Name**, escribe algo descriptivo: `ReseñasYa Supabase SMTP`.
4. En **Permission**, selecciona **Sending access** (es suficiente para enviar emails).
5. En **Domain**, selecciona `resenasya.com` (el que acabas de verificar).
6. Haz clic en **Add**.
7. Resend te mostrará la API Key **una sola vez**. Tiene el formato `re_xxxxxxxxxxxxxxxx`.
   **Cópiala ahora** y guárdala en un lugar seguro (por ejemplo, en tu `.env.local`).

> Si cierras la ventana sin copiarla, tendrás que generar una nueva.

---

## 3. Configurar el SMTP en Supabase

1. Ve a **https://supabase.com/dashboard** y selecciona tu proyecto de ReseñasYa.
2. En el menú lateral izquierdo, haz clic en **Project Settings** (icono de engranaje, parte inferior).
3. Dentro de Project Settings, haz clic en **Authentication** en el submenú.
4. Baja hasta la sección **SMTP Settings**.
5. Activa el toggle **Enable Custom SMTP** (si no está activado).
6. Rellena los campos exactamente así:

   | Campo | Valor |
   |-------|-------|
   | **Sender name** | `ReseñasYa` |
   | **Sender email** | `hola@resenasya.com` |
   | **Host** | `smtp.resend.com` |
   | **Port number** | `465` |
   | **Username** | `resend` |
   | **Password** | pega aquí tu API Key de Resend (`re_xxxxxxxx...`) |

7. Haz clic en **Save** (o el botón equivalente al final de la sección).

> **Nota sobre el puerto:** Resend también soporta el puerto `587` con STARTTLS si el 465 no funciona.
> Prueba primero con 465. Si falla, cambia a 587.

---

## 4. Configurar el Site URL y los redirects

Esto es necesario para que los enlaces de los emails (`{{ .SiteURL }}`) apunten a tu dominio
y no a `localhost`.

1. Sigue en **Supabase → Project Settings → Authentication**.
2. Sube hasta la sección **URL Configuration**.
3. En **Site URL**, escribe: `https://resenasya.com`
4. En **Redirect URLs**, haz clic en **Add URL** y añade estas dos entradas:
   - `https://resenasya.com/**`
   - `https://*.vercel.app/**`

   La segunda permite que los enlaces funcionen también en los deploys de preview de Vercel
   (las URLs del tipo `resenas-ya-abc123.vercel.app`).

5. Haz clic en **Save**.

---

## 5. Aplicar las plantillas HTML

Ahora vas a reemplazar los emails genéricos de Supabase por las plantillas de ReseñasYa.
Son 4 emails. El proceso es igual para todos.

1. Ve a **Supabase Dashboard → Authentication** (menú lateral).
2. Haz clic en la pestaña **Email Templates** (suele estar en la parte superior de la sección Auth).

Verás un desplegable o pestañas con estos tipos:
- **Confirm signup** → usa `templates/confirmation.html`
- **Reset password** → usa `templates/recovery.html`
- **Change email address** → usa `templates/email-change.html`
- **Magic link** → usa `templates/magic-link.html`

### Para cada uno de los 4 emails:

**a) Selecciona el tipo** haciendo clic en su pestaña o desplegable.

**b) Cambia el Subject** (asunto del email):

| Tipo | Subject a poner |
|------|----------------|
| Confirm signup | `Activa tu cuenta de ReseñasYa ✉️` |
| Reset password | `Recupera el acceso a ReseñasYa 🔑` |
| Change email address | `Confirma tu nuevo email en ReseñasYa` |
| Magic link | `Tu enlace de acceso a ReseñasYa` |

**c) Copia el HTML de la plantilla:**

Abre el archivo correspondiente en tu editor de código o en GitHub:
- `supabase/templates/confirmation.html`
- `supabase/templates/recovery.html`
- `supabase/templates/email-change.html`
- `supabase/templates/magic-link.html`

Selecciona **todo el contenido** del archivo (Ctrl+A / Cmd+A) y cópialo.

**d) Pega el HTML en Supabase:**

En el campo **Body** del dashboard (el cuadro de texto grande), borra todo lo que haya
y pega el HTML que acabas de copiar.

**e) Guarda** haciendo clic en **Save**.

**f) Repite** con los otros 3 tipos de email.

---

## 6. Verificar que todo funciona

### Prueba 1 — Email de confirmación de cuenta

1. Abre una ventana de incógnito en tu navegador.
2. Ve a `https://resenasya.com/register`.
3. Regístrate con un email tuyo real (no el de la cuenta de admin).
4. Deberías recibir en segundos un email desde `hola@resenasya.com` con el asunto
   `Activa tu cuenta de ReseñasYa ✉️` y el diseño de la plantilla.
5. Haz clic en el botón "Confirmar mi cuenta →" para comprobar que el enlace funciona
   y redirige al dashboard.

### Prueba 2 — Email de recuperación de contraseña

1. Ve a `https://resenasya.com/recuperar`.
2. Introduce el email con el que te registraste en la prueba anterior.
3. Deberías recibir el email con asunto `Recupera el acceso a ReseñasYa 🔑`.
4. Comprueba que el botón "Crear nueva contraseña →" funciona y lleva a `/nueva-contrasena`.

### Si no llega el email

Comprueba en este orden:

1. **Carpeta de spam** — los primeros envíos a veces caen en spam hasta que el dominio
   gana reputación.
2. **Logs de Supabase** — ve a Supabase → **Logs** → **Auth** y busca errores de envío.
3. **Logs de Resend** — ve a Resend → **Emails** y verifica que aparece el intento de envío
   y que el estado es **Delivered** (no **Failed**).
4. **Verificación del dominio** — en Resend → **Domains**, confirma que `resenasya.com`
   aparece como **Verified**.
5. **Credenciales SMTP** — en Supabase → Project Settings → Authentication → SMTP Settings,
   comprueba que el password es exactamente la API Key de Resend (empieza por `re_`).

---

## Variables en las plantillas

Las plantillas usan estas variables que Supabase sustituye automáticamente:

| Variable | Qué contiene |
|----------|-------------|
| `{{ .ConfirmationURL }}` | El enlace de confirmación/reseteo generado por Supabase |
| `{{ .SiteURL }}` | La URL base de la app (`https://resenasya.com`) |

No toques estas variables al pegar las plantillas. Si aparecen literalmente en el email
recibido (sin sustituirse), es que el template no se guardó correctamente en Supabase.

---

## Límites del plan gratuito de Resend

| Métrica | Límite gratuito |
|---------|----------------|
| Emails al mes | 3.000 |
| Emails al día | 100 |
| Dominios | 1 |
| Contactos | Ilimitados |

Para un SaaS en fase inicial esto es más que suficiente. El plan de pago empieza en $20/mes
para 50.000 emails.
