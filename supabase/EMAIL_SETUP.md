# Configuración de emails en producción

## Plantillas disponibles

| Plantilla | Archivo | Asunto recomendado |
|-----------|---------|-------------------|
| Confirmación de cuenta | `templates/confirmation.html` | `Activa tu cuenta de ReseñasYa ✉️` |
| Recuperación de contraseña | `templates/recovery.html` | `Recupera el acceso a ReseñasYa 🔑` |
| Cambio de email | `templates/email-change.html` | `Confirma tu nuevo email en ReseñasYa` |
| Magic link | `templates/magic-link.html` | `Tu enlace de acceso a ReseñasYa` |

---

## Paso 1 — Configura el SMTP (recomendado: Resend)

Sin SMTP propio, los emails salen desde `noreply@mail.supabase.io` con el dominio de Supabase.
Con Resend los emails salen desde `hola@resenasya.com` (o el dominio que uses) y tienen
mejor entregabilidad.

### Opción A — Resend (recomendado, gratis hasta 3.000 emails/mes)

1. Crea cuenta en [resend.com](https://resend.com)
2. Añade y verifica tu dominio (`resenasya.com`)
3. Crea una API Key
4. En Supabase → Project Settings → Authentication → SMTP Settings:
   - **Host**: `smtp.resend.com`
   - **Port**: `465`
   - **User**: `resend`
   - **Password**: tu API key de Resend
   - **Sender name**: `ReseñasYa`
   - **Sender email**: `hola@resenasya.com`

### Opción B — Brevo (antes Sendinblue, gratis hasta 300 emails/día)

1. Crea cuenta en [brevo.com](https://brevo.com)
2. Activa el SMTP transaccional y genera credenciales
3. En Supabase → Project Settings → Authentication → SMTP Settings:
   - **Host**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **User**: tu email de Brevo
   - **Password**: tu SMTP key de Brevo

---

## Paso 2 — Aplica las plantillas HTML en el dashboard

1. Ve a **Supabase Dashboard → Authentication → Email Templates**
2. Para cada plantilla:
   a. Selecciona el tipo de email (Confirm signup, Reset password, etc.)
   b. Cambia el **Subject** por el asunto recomendado de la tabla de arriba
   c. Abre el archivo HTML correspondiente de `supabase/templates/`
   d. Copia todo el contenido
   e. Pégalo en el campo **Body** del dashboard
   f. Guarda

> **Variables de Supabase** ya incluidas en las plantillas:
> - `{{ .ConfirmationURL }}` — enlace de confirmación/reseteo
> - `{{ .SiteURL }}` — URL base de la app (configura en Auth Settings → Site URL)

---

## Paso 3 — Configura el Site URL

En **Supabase → Authentication → URL Configuration**:
- **Site URL**: `https://resenasya.com`
- **Redirect URLs** (añadir):
  - `https://resenasya.com/**`
  - `https://*.vercel.app/**` (para previews de Vercel)

---

## Paso 4 — Desactiva el límite de emails en producción

Por defecto Supabase limita a 2 emails/hora en el plan free. Con SMTP propio este límite desaparece.

---

## Desarrollo local

Para desarrollo local con `supabase start`, el `config.toml` ya está configurado
para usar estas plantillas. Los emails se capturan en **Inbucket** (http://localhost:54324)
y nunca se envían de verdad.
