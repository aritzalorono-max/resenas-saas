-- ============================================================
-- Hospital de Galdakao · Guardias de Urología
-- Migración 001: Esquema inicial completo
--
-- INSTRUCCIONES:
--   1. Crea un proyecto en https://supabase.com
--   2. Ve a SQL Editor y ejecuta este script completo
--   3. Copia las claves (URL, anon key, service_role) a .env.local
-- ============================================================

-- ─── Tablas ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guardias_profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT        NOT NULL,
  role       TEXT        NOT NULL DEFAULT 'medico'
                         CHECK (role IN ('admin','gestor','medico')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardias_doctor_profiles (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id    UUID        NOT NULL UNIQUE REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  categoria     TEXT        NOT NULL
                            CHECK (categoria IN ('R1','R2','R3','R4','R5','Adjunto','Jefe_Seccion','Jefe_Servicio')),
  num_colegiado TEXT,
  especialidad  TEXT        NOT NULL DEFAULT 'Urología',
  anio_inicio   INT,
  activo        BOOLEAN     NOT NULL DEFAULT true,
  notas         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardias_shift_counters (
  id                        UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id                UUID         NOT NULL REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  anio                      INT          NOT NULL,
  total_guardias            INT          NOT NULL DEFAULT 0,
  guardias_laborable        INT          NOT NULL DEFAULT 0,
  guardias_sabado           INT          NOT NULL DEFAULT 0,
  guardias_domingo          INT          NOT NULL DEFAULT 0,
  guardias_festivo          INT          NOT NULL DEFAULT 0,
  guardias_vispera          INT          NOT NULL DEFAULT 0,
  guardias_puente           INT          NOT NULL DEFAULT 0,
  guardias_festivo_especial INT          NOT NULL DEFAULT 0,
  puntos_acumulados         NUMERIC(8,2) NOT NULL DEFAULT 0,
  updated_at                TIMESTAMPTZ  NOT NULL DEFAULT now(),
  UNIQUE(profile_id, anio)
);

CREATE TABLE IF NOT EXISTS guardias_holidays (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre        TEXT        NOT NULL,
  fecha         DATE        NOT NULL,
  tipo          TEXT        NOT NULL
                            CHECK (tipo IN ('nacional','euskadi','bizkaia','galdakao','especial')),
  es_recurrente BOOLEAN     NOT NULL DEFAULT false,
  notas         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID        REFERENCES guardias_profiles(id) ON DELETE SET NULL,
  UNIQUE(fecha, tipo, nombre)
);

CREATE TABLE IF NOT EXISTS guardias_special_days (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha         DATE        NOT NULL UNIQUE,
  tipo_override TEXT        NOT NULL
                            CHECK (tipo_override IN ('puente','vispera','festivo_especial')),
  motivo        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by    UUID        REFERENCES guardias_profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS guardias_penosidad_config (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo_dia    TEXT         NOT NULL UNIQUE
                           CHECK (tipo_dia IN ('laborable','sabado','domingo','festivo','vispera','puente','festivo_especial')),
  nivel       INT          NOT NULL,
  etiqueta    TEXT         NOT NULL,
  descripcion TEXT,
  color       TEXT         NOT NULL DEFAULT '#6b7280',
  puntos_base NUMERIC(4,2) NOT NULL DEFAULT 1.0,
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_by  UUID         REFERENCES guardias_profiles(id) ON DELETE SET NULL
);

-- ─── Row Level Security ────────────────────────────────────

ALTER TABLE guardias_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_doctor_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_shift_counters   ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_holidays         ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_special_days     ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_penosidad_config ENABLE ROW LEVEL SECURITY;

-- guardias_profiles
CREATE POLICY "gp_select" ON guardias_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "gp_insert" ON guardias_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "gp_update" ON guardias_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id OR EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
CREATE POLICY "gp_delete" ON guardias_profiles FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- guardias_doctor_profiles
CREATE POLICY "gdp_select" ON guardias_doctor_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "gdp_insert" ON guardias_doctor_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = profile_id OR EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gdp_update" ON guardias_doctor_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = profile_id OR EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gdp_delete" ON guardias_doctor_profiles FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- guardias_shift_counters
CREATE POLICY "gsc_select" ON guardias_shift_counters FOR SELECT TO authenticated USING (true);
CREATE POLICY "gsc_insert" ON guardias_shift_counters FOR INSERT TO authenticated
  WITH CHECK (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gsc_update" ON guardias_shift_counters FOR UPDATE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gsc_delete" ON guardias_shift_counters FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));

-- guardias_holidays
CREATE POLICY "gh_select" ON guardias_holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "gh_insert" ON guardias_holidays FOR INSERT TO authenticated
  WITH CHECK (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gh_update" ON guardias_holidays FOR UPDATE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gh_delete" ON guardias_holidays FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));

-- guardias_special_days
CREATE POLICY "gsd_select" ON guardias_special_days FOR SELECT TO authenticated USING (true);
CREATE POLICY "gsd_insert" ON guardias_special_days FOR INSERT TO authenticated
  WITH CHECK (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gsd_update" ON guardias_special_days FOR UPDATE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gsd_delete" ON guardias_special_days FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));

-- guardias_penosidad_config
CREATE POLICY "gpc_select" ON guardias_penosidad_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "gpc_insert" ON guardias_penosidad_config FOR INSERT TO authenticated
  WITH CHECK (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gpc_update" ON guardias_penosidad_config FOR UPDATE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','gestor')));
CREATE POLICY "gpc_delete" ON guardias_penosidad_config FOR DELETE TO authenticated
  USING (EXISTS(SELECT 1 FROM guardias_profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ─── Vista: clasificación automática de días ───────────────

CREATE OR REPLACE VIEW guardias_day_classifications AS
WITH serie AS (
  SELECT generate_series('2025-01-01'::date, '2027-12-31'::date, '1 day'::interval)::date AS fecha
)
SELECT
  s.fecha,
  EXTRACT(YEAR  FROM s.fecha)::INT AS anio,
  EXTRACT(MONTH FROM s.fecha)::INT AS mes,
  EXTRACT(DOW   FROM s.fecha)::INT AS dia_semana,   -- 0=domingo 6=sábado
  CASE
    WHEN sd.tipo_override IS NOT NULL THEN sd.tipo_override
    WHEN EXISTS(SELECT 1 FROM guardias_holidays h WHERE h.fecha = s.fecha AND h.tipo = 'especial')
         THEN 'festivo_especial'
    WHEN EXISTS(SELECT 1 FROM guardias_holidays h WHERE h.fecha = s.fecha)
         THEN 'festivo'
    WHEN EXTRACT(DOW FROM s.fecha) = 0 THEN 'domingo'
    WHEN EXTRACT(DOW FROM s.fecha) = 6 THEN 'sabado'
    WHEN EXISTS(SELECT 1 FROM guardias_holidays h WHERE h.fecha = s.fecha + 1)
         THEN 'vispera'
    ELSE 'laborable'
  END AS tipo_dia,
  (
    SELECT h.nombre FROM guardias_holidays h
    WHERE h.fecha = s.fecha
    ORDER BY CASE h.tipo
      WHEN 'especial'  THEN 1 WHEN 'nacional' THEN 2
      WHEN 'euskadi'   THEN 3 WHEN 'bizkaia'  THEN 4
      WHEN 'galdakao'  THEN 5 ELSE 6
    END LIMIT 1
  ) AS nombre_festivo,
  sd.motivo AS motivo_especial
FROM serie s
LEFT JOIN guardias_special_days sd ON sd.fecha = s.fecha;

-- ─── Seed: penosidad por defecto ──────────────────────────

INSERT INTO guardias_penosidad_config (tipo_dia, nivel, etiqueta, descripcion, color, puntos_base) VALUES
  ('festivo_especial', 1, 'Festivo Especial',  'Navidad, Año Nuevo, Reyes. Máxima penosidad.',        '#dc2626', 3.00),
  ('domingo',          2, 'Domingo',            'Domingos no festivos.',                               '#ea580c', 2.50),
  ('festivo',          3, 'Festivo',            'Festivos nacionales, autonómicos o locales.',         '#d97706', 2.00),
  ('puente',           4, 'Puente',             'Días de puente designados manualmente.',              '#ca8a04', 1.75),
  ('sabado',           5, 'Sábado',             'Sábados no festivos.',                                '#65a30d', 1.50),
  ('vispera',          6, 'Víspera',            'Día anterior a un festivo o festivo especial.',       '#16a34a', 1.25),
  ('laborable',        7, 'Laborable',          'Día laborable ordinario. Menor penosidad.',           '#2563eb', 1.00)
ON CONFLICT (tipo_dia) DO NOTHING;

-- ─── Seed: festivos 2025 ───────────────────────────────────

-- Nacionales
INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente) VALUES
  ('Año Nuevo',                  '2025-01-01', 'nacional', true),
  ('Epifanía del Señor',         '2025-01-06', 'nacional', true),
  ('Viernes Santo',              '2025-04-18', 'nacional', false),
  ('Día del Trabajador',         '2025-05-01', 'nacional', true),
  ('Asunción de la Virgen',      '2025-08-15', 'nacional', true),
  ('Fiesta Nacional de España',  '2025-10-12', 'nacional', true),
  ('Todos los Santos',           '2025-11-01', 'nacional', true),
  ('Día de la Constitución',     '2025-12-06', 'nacional', true),
  ('Inmaculada Concepción',      '2025-12-08', 'nacional', true),
  ('Navidad',                    '2025-12-25', 'nacional', true)
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

-- Euskadi
INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente) VALUES
  ('Jueves Santo',               '2025-04-17', 'euskadi', false),
  ('Aberri Eguna',               '2025-04-20', 'euskadi', false),
  ('San Ignacio de Loyola',      '2025-07-31', 'euskadi', true),
  ('San Esteban',                '2025-12-26', 'euskadi', true)
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

-- Galdakao
INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente, notas) VALUES
  ('San Pedro Apóstol',          '2025-06-29', 'galdakao', true,  'Patrón de Galdakao'),
  ('Fiestas Patronales',         '2025-08-04', 'galdakao', false, 'Verificar fecha exacta cada año.')
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

-- Especiales (máxima penosidad)
INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente, notas) VALUES
  ('Nochebuena',                 '2025-12-24', 'especial', true, 'Víspera de Navidad'),
  ('Nochevieja',                 '2025-12-31', 'especial', true, 'Víspera de Año Nuevo'),
  ('Víspera de Reyes',           '2025-01-05', 'especial', true, 'Cabalgata de Reyes')
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

-- ─── Seed: festivos 2026 ───────────────────────────────────

INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente) VALUES
  ('Año Nuevo',                  '2026-01-01', 'nacional', true),
  ('Epifanía del Señor',         '2026-01-06', 'nacional', true),
  ('Viernes Santo',              '2026-04-03', 'nacional', false),
  ('Día del Trabajador',         '2026-05-01', 'nacional', true),
  ('Asunción de la Virgen',      '2026-08-15', 'nacional', true),
  ('Fiesta Nacional de España',  '2026-10-12', 'nacional', true),
  ('Todos los Santos',           '2026-11-01', 'nacional', true),
  ('Día de la Constitución',     '2026-12-06', 'nacional', true),
  ('Inmaculada Concepción',      '2026-12-08', 'nacional', true),
  ('Navidad',                    '2026-12-25', 'nacional', true)
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente) VALUES
  ('Jueves Santo',               '2026-04-02', 'euskadi', false),
  ('Aberri Eguna',               '2026-04-05', 'euskadi', false),
  ('San Ignacio de Loyola',      '2026-07-31', 'euskadi', true),
  ('San Esteban',                '2026-12-26', 'euskadi', true)
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente, notas) VALUES
  ('San Pedro Apóstol',          '2026-06-29', 'galdakao', true,  'Patrón de Galdakao'),
  ('Fiestas Patronales',         '2026-08-03', 'galdakao', false, 'Verificar fecha exacta cada año.')
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;

INSERT INTO guardias_holidays (nombre, fecha, tipo, es_recurrente, notas) VALUES
  ('Nochebuena',                 '2026-12-24', 'especial', true, 'Víspera de Navidad'),
  ('Nochevieja',                 '2026-12-31', 'especial', true, 'Víspera de Año Nuevo'),
  ('Víspera de Reyes',           '2026-01-05', 'especial', true, 'Cabalgata de Reyes')
ON CONFLICT (fecha, tipo, nombre) DO NOTHING;
