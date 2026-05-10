-- ─── Fase 2: Cuadrante y reglas de asignación ─────────────────────────────────

-- Tabla de configuración de reglas (singleton)
CREATE TABLE IF NOT EXISTS guardias_rules_config (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  descanso_minimo_horas    int  NOT NULL DEFAULT 12,
  descanso_activo          bool NOT NULL DEFAULT true,
  max_guardias_mes         int  NOT NULL DEFAULT 8,
  max_guardias_mes_activo  bool NOT NULL DEFAULT true,
  updated_at               timestamptz NOT NULL DEFAULT now(),
  updated_by               uuid REFERENCES guardias_profiles(id)
);

-- Tabla de asignaciones de guardia (una por día)
CREATE TABLE IF NOT EXISTS guardias_assignments (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha       date        NOT NULL UNIQUE,
  profile_id  uuid        NOT NULL REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  tipo_dia    text        NOT NULL,
  puntos      numeric(4,2) NOT NULL DEFAULT 0,
  notas       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  created_by  uuid REFERENCES guardias_profiles(id),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  uuid REFERENCES guardias_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_assignments_fecha       ON guardias_assignments(fecha);
CREATE INDEX IF NOT EXISTS idx_assignments_profile_id  ON guardias_assignments(profile_id);
CREATE INDEX IF NOT EXISTS idx_assignments_anio        ON guardias_assignments(EXTRACT(year FROM fecha));

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE guardias_rules_config   ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_assignments    ENABLE ROW LEVEL SECURITY;

-- rules_config: todos los autenticados pueden leer; solo admin/gestor pueden escribir
CREATE POLICY "rules_config_select" ON guardias_rules_config
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "rules_config_update" ON guardias_rules_config
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

-- assignments: todos los autenticados pueden leer; solo admin/gestor pueden escribir
CREATE POLICY "assignments_select" ON guardias_assignments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "assignments_insert" ON guardias_assignments
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

CREATE POLICY "assignments_update" ON guardias_assignments
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

CREATE POLICY "assignments_delete" ON guardias_assignments
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

-- ─── Seed: reglas por defecto ──────────────────────────────────────────────────

INSERT INTO guardias_rules_config
  (descanso_minimo_horas, descanso_activo, max_guardias_mes, max_guardias_mes_activo)
VALUES
  (12, true, 8, true)
ON CONFLICT DO NOTHING;
