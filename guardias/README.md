# Guardias Urología · Hospital de Galdakao

Aplicación web para la gestión de guardias del Servicio de Urología del Hospital de Galdakano (Osakidetza).

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 15 (App Router) |
| Auth + DB | Supabase (PostgreSQL + RLS) |
| Estilos | Tailwind CSS 3 |
| Tipado | TypeScript strict |

## Fase 1 — Estructura y usuarios (implementado)

### Roles de usuario

| Rol | Permisos |
|-----|----------|
| **Administrador** | Control total: gestión de usuarios, festivos, penosidad, guardias |
| **Gestor** | Planificador: puede editar festivos, penosidad y asignar guardias |
| **Médico** | Usuario final: solo lectura del calendario y sus propias guardias |

> El primer usuario que se registre obtiene rol `admin` automáticamente.

### Perfil del médico

- Nombre completo
- Categoría profesional: R1, R2, R3, R4, R5, Adjunto, Jefe de Sección, Jefe de Servicio
- Número de colegiado (opcional)
- Año de incorporación al servicio
- Contador acumulado de guardias por tipo de día y año
- Puntos acumulados (basados en jerarquía de penosidad)

### Calendario de festivos

Incluye festivos pre-configurados para 2025 y 2026:

- **Nacionales** (España): Año Nuevo, Reyes, Viernes Santo, Día del Trabajador, etc.
- **Euskadi**: Jueves Santo, Aberri Eguna, San Ignacio, San Esteban
- **Galdakao**: San Pedro Apóstol, Fiestas Patronales
- **Especiales** (máxima penosidad): Nochebuena, Nochevieja, Víspera de Reyes

El Gestor puede añadir, editar y eliminar festivos en cualquier momento, así como designar **días de puente** manualmente.

### Clasificación de días

| Tipo | Descripción |
|------|-------------|
| `festivo_especial` | Navidad, Año Nuevo, Reyes y festivos marcados como especiales |
| `festivo` | Festivos nacionales, autonómicos o locales |
| `domingo` | Domingos no festivos |
| `puente` | Días de puente designados manualmente |
| `sabado` | Sábados no festivos |
| `vispera` | Día anterior a un festivo |
| `laborable` | Resto de días |

La vista `guardias_day_classifications` clasifica automáticamente todos los días entre 2025 y 2027.

### Jerarquía de penosidad

Configurable por el Gestor. Por defecto (nivel 1 = máxima penosidad):

1. **Festivo Especial** — 3.00 pts
2. **Domingo** — 2.50 pts
3. **Festivo** — 2.00 pts
4. **Puente** — 1.75 pts
5. **Sábado** — 1.50 pts
6. **Víspera** — 1.25 pts
7. **Laborable** — 1.00 pts

## Instalación

```bash
cd guardias
cp .env.local.example .env.local
# Rellenar variables de entorno con los valores del proyecto Supabase
npm install
npm run dev
# App disponible en http://localhost:3001
```

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://rxyitbhzzriwecjgqqrg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key del proyecto>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>  # no usado en Fase 1
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Estructura de carpetas

```
src/
├── app/
│   ├── (auth)/login/          # Login
│   ├── (auth)/registro/       # Registro (1er usuario → admin)
│   ├── (dashboard)/
│   │   ├── dashboard/         # Inicio con estadísticas
│   │   ├── medicos/           # Gestión de médicos y contadores
│   │   ├── calendario/        # Vista mensual color-coded
│   │   ├── festivos/          # Gestión de festivos y puentes
│   │   └── penosidad/         # Jerarquía de penosidad
│   └── api/auth/callback/
├── components/
│   ├── layout/                # Sidebar, MobileNav
│   ├── medicos/               # MedicoFormModal, MedicosClient
│   ├── festivos/              # FestivoFormModal, SpecialDayModal, FestivosClient
│   ├── penosidad/             # PenosidadList
│   └── calendario/            # CalendarioView
└── lib/
    ├── supabase/              # server, client, middleware
    └── actions/               # auth, doctors, holidays, penosidad
```
