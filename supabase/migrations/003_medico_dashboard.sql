-- ─── Fase 3: Dashboard personal del Médico ────────────────────────────────────

-- Trabajos extraordinarios (peonadas, autoconciertos, guardias localizadas, etc.)
CREATE TABLE IF NOT EXISTS guardias_extras (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid        NOT NULL REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  fecha        date        NOT NULL,
  tipo         text        NOT NULL CHECK (tipo IN ('peonada','autoconcierto','guardia_localizada','otro')),
  descripcion  text,
  horas        numeric(4,1) NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_extras_profile_id ON guardias_extras(profile_id);
CREATE INDEX IF NOT EXISTS idx_extras_fecha       ON guardias_extras(fecha);

-- Ausencias (bajas, vacaciones, asuntos propios, etc.)
CREATE TABLE IF NOT EXISTS guardias_absences (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id   uuid        NOT NULL REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  fecha_inicio date        NOT NULL,
  fecha_fin    date        NOT NULL,
  tipo         text        NOT NULL CHECK (tipo IN ('baja','vacaciones','asuntos_propios','otro')),
  motivo       text,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_absences_profile_id ON guardias_absences(profile_id);
CREATE INDEX IF NOT EXISTS idx_absences_fechas      ON guardias_absences(fecha_inicio, fecha_fin);

-- ─── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE guardias_extras    ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_absences  ENABLE ROW LEVEL SECURITY;

-- Extras: cada médico ve y edita solo los suyos; admin/gestor ven todos
CREATE POLICY "extras_select" ON guardias_extras
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

CREATE POLICY "extras_insert" ON guardias_extras
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "extras_delete" ON guardias_extras
  FOR DELETE TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

-- Absences: igual que extras
CREATE POLICY "absences_select" ON guardias_absences
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );

CREATE POLICY "absences_insert" ON guardias_absences
  FOR INSERT TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "absences_delete" ON guardias_absences
  FOR DELETE TO authenticated
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM guardias_profiles
      WHERE id = auth.uid() AND role IN ('admin','gestor')
    )
  );
