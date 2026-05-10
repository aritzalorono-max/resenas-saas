# Guardias Urología · Hospital de Galdakao

Aplicación web para la gestión de guardias del Servicio de Urología del Hospital de Galdakano (Osakidetza).

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth + DB | Supabase (PostgreSQL + RLS) — cuenta propia |
| Estilos | Tailwind CSS 3 |
| Tipado | TypeScript strict |
| Despliegue | Vercel — cuenta propia |

## Primeros pasos

### 1. Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com) (cuenta del hospital)
2. Ve a **SQL Editor** y ejecuta el script completo:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   Esto crea todas las tablas, RLS, la vista de clasificación de días y los festivos 2025-2026 pre-cargados.
3. Copia las claves desde **Project Settings → API**

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
# Rellena las 3 variables con los valores de tu proyecto Supabase
```

### 3. Desarrollo local

```bash
npm install
npm run dev
# http://localhost:3000
```

### 4. Primer usuario

El **primer usuario** que se registre en `/registro` obtiene rol `admin` automáticamente. El admin puede luego cambiar el rol del resto desde la app.

### 5. Despliegue en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com) (cuenta del hospital)
2. Añade las variables de entorno (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`)
3. En Supabase, ve a **Authentication → URL Configuration** y añade tu dominio de Vercel como Redirect URL

---

## Roles

| Rol | Permisos |
|-----|----------|
| **admin** | Control total: usuarios, festivos, penosidad, guardias |
| **gestor** | Planificador: editar festivos, penosidad, asignar guardias |
| **medico** | Solo lectura del calendario y sus propias guardias |

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/login/          # Login
│   ├── (auth)/registro/       # Registro (1er usuario → admin)
│   ├── (dashboard)/
│   │   ├── dashboard/         # Inicio con estadísticas
│   │   ├── medicos/           # Perfiles, categorías y contadores
│   │   ├── calendario/        # Vista mensual con color-coding
│   │   ├── festivos/          # Festivos y días de puente
│   │   └── penosidad/         # Jerarquía de penosidad reordenable
│   └── api/auth/callback/
├── components/
│   ├── layout/                # Sidebar + MobileNav
│   ├── medicos/
│   ├── festivos/
│   ├── penosidad/
│   └── calendario/
└── lib/
    ├── supabase/              # Clientes server / client / middleware
    └── actions/               # Server actions: auth, doctors, holidays, penosidad

supabase/
└── migrations/
    └── 001_initial_schema.sql # SQL completo — ejecutar en Supabase SQL Editor
```

## Clasificación de días

La vista `guardias_day_classifications` clasifica automáticamente todos los días 2025-2027:

| Tipo | Descripción | Pts base |
|------|-------------|---------|
| `festivo_especial` | Navidad, Año Nuevo, Reyes | 3,00 |
| `domingo` | Domingos no festivos | 2,50 |
| `festivo` | Festivos nacionales / autonómicos / locales | 2,00 |
| `puente` | Designado manualmente por el gestor | 1,75 |
| `sabado` | Sábados no festivos | 1,50 |
| `vispera` | Día anterior a un festivo | 1,25 |
| `laborable` | Resto de días | 1,00 |

La jerarquía de penosidad y los puntos son reordenables por el gestor desde la app.
