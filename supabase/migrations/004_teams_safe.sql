-- ── Limpiar políticas existentes ─────────────────────────────────────────────
DROP POLICY IF EXISTS "teams_select"          ON guardias_teams;
DROP POLICY IF EXISTS "teams_update"          ON guardias_teams;
DROP POLICY IF EXISTS "teams_insert"          ON guardias_teams;
DROP POLICY IF EXISTS "team_members_select"   ON guardias_team_members;
DROP POLICY IF EXISTS "team_members_insert"   ON guardias_team_members;
DROP POLICY IF EXISTS "team_members_update"   ON guardias_team_members;
DROP POLICY IF EXISTS "team_members_delete"   ON guardias_team_members;
DROP POLICY IF EXISTS "invitations_select"    ON guardias_team_invitations;
DROP POLICY IF EXISTS "invitations_insert"    ON guardias_team_invitations;
DROP POLICY IF EXISTS "invitations_update"    ON guardias_team_invitations;
DROP POLICY IF EXISTS "invitations_delete"    ON guardias_team_invitations;
DROP POLICY IF EXISTS "dp_select"    ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "dp_insert"    ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "dp_update"    ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "dp_delete"    ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "sc_select"    ON guardias_shift_counters;
DROP POLICY IF EXISTS "sc_upsert"    ON guardias_shift_counters;
DROP POLICY IF EXISTS "hol_select"   ON guardias_holidays;
DROP POLICY IF EXISTS "hol_insert"   ON guardias_holidays;
DROP POLICY IF EXISTS "hol_update"   ON guardias_holidays;
DROP POLICY IF EXISTS "hol_delete"   ON guardias_holidays;
DROP POLICY IF EXISTS "sd_select"    ON guardias_special_days;
DROP POLICY IF EXISTS "sd_insert"    ON guardias_special_days;
DROP POLICY IF EXISTS "sd_delete"    ON guardias_special_days;
DROP POLICY IF EXISTS "pen_select"   ON guardias_penosidad_config;
DROP POLICY IF EXISTS "pen_update"   ON guardias_penosidad_config;
DROP POLICY IF EXISTS "pen_insert"   ON guardias_penosidad_config;
DROP POLICY IF EXISTS "ext_select"   ON guardias_extras;
DROP POLICY IF EXISTS "ext_insert"   ON guardias_extras;
DROP POLICY IF EXISTS "ext_delete"   ON guardias_extras;
DROP POLICY IF EXISTS "abs_select"   ON guardias_absences;
DROP POLICY IF EXISTS "abs_insert"   ON guardias_absences;
DROP POLICY IF EXISTS "abs_delete"   ON guardias_absences;
DROP POLICY IF EXISTS "asgn_select"  ON guardias_assignments;
DROP POLICY IF EXISTS "asgn_insert"  ON guardias_assignments;
DROP POLICY IF EXISTS "asgn_update"  ON guardias_assignments;
DROP POLICY IF EXISTS "asgn_delete"  ON guardias_assignments;
DROP POLICY IF EXISTS "rc_select"    ON guardias_rules_config;
DROP POLICY IF EXISTS "rc_update"    ON guardias_rules_config;
DROP POLICY IF EXISTS "rc_insert"    ON guardias_rules_config;

-- Limpiar políticas antiguas
DROP POLICY IF EXISTS "Admins and gestors can manage doctor profiles" ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "Users can view doctor profiles"               ON guardias_doctor_profiles;
DROP POLICY IF EXISTS "Users can view shift counters"                ON guardias_shift_counters;
DROP POLICY IF EXISTS "Admins and gestors can manage shift counters" ON guardias_shift_counters;
DROP POLICY IF EXISTS "Admins and gestors can manage holidays"       ON guardias_holidays;
DROP POLICY IF EXISTS "Users can view holidays"                      ON guardias_holidays;
DROP POLICY IF EXISTS "Admins and gestors can manage special days"   ON guardias_special_days;
DROP POLICY IF EXISTS "Users can view special days"                  ON guardias_special_days;
DROP POLICY IF EXISTS "Admins and gestors can manage penosidad"      ON guardias_penosidad_config;
DROP POLICY IF EXISTS "Users can view penosidad"                     ON guardias_penosidad_config;
DROP POLICY IF EXISTS "assignments_select"                           ON guardias_assignments;
DROP POLICY IF EXISTS "assignments_insert"                           ON guardias_assignments;
DROP POLICY IF EXISTS "assignments_update"                           ON guardias_assignments;
DROP POLICY IF EXISTS "assignments_delete"                           ON guardias_assignments;
DROP POLICY IF EXISTS "rules_config_select"                          ON guardias_rules_config;
DROP POLICY IF EXISTS "rules_config_update"                          ON guardias_rules_config;
DROP POLICY IF EXISTS "extras_select"    ON guardias_extras;
DROP POLICY IF EXISTS "extras_insert"    ON guardias_extras;
DROP POLICY IF EXISTS "extras_delete"    ON guardias_extras;
DROP POLICY IF EXISTS "absences_select"  ON guardias_absences;
DROP POLICY IF EXISTS "absences_insert"  ON guardias_absences;
DROP POLICY IF EXISTS "absences_delete"  ON guardias_absences;

-- ── Tablas ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS guardias_teams (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       text        NOT NULL,
  descripcion  text,
  hospital     text,
  especialidad text,
  codigo       text        NOT NULL UNIQUE,
  created_by   uuid        REFERENCES guardias_profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS guardias_team_members (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid        NOT NULL REFERENCES guardias_teams(id) ON DELETE CASCADE,
  profile_id  uuid        NOT NULL REFERENCES guardias_profiles(id) ON DELETE CASCADE,
  role        text        NOT NULL CHECK (role IN ('gestor','medico')) DEFAULT 'medico',
  status      text        NOT NULL CHECK (status IN ('active','pending')) DEFAULT 'active',
  joined_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(team_id, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team    ON guardias_team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_profile ON guardias_team_members(profile_id);

CREATE TABLE IF NOT EXISTS guardias_team_invitations (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id     uuid        NOT NULL REFERENCES guardias_teams(id) ON DELETE CASCADE,
  email       text        NOT NULL,
  role        text        NOT NULL CHECK (role IN ('gestor','medico')) DEFAULT 'medico',
  token       uuid        NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  invited_by  uuid        REFERENCES guardias_profiles(id),
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_invitations_team  ON guardias_team_invitations(team_id);
CREATE INDEX IF NOT EXISTS idx_invitations_email ON guardias_team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON guardias_team_invitations(token);

-- ── Columnas ──────────────────────────────────────────────────────────────────

ALTER TABLE guardias_profiles ADD COLUMN IF NOT EXISTS active_team_id uuid REFERENCES guardias_teams(id);

ALTER TABLE guardias_doctor_profiles ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_holidays         ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_special_days     ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_penosidad_config ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_shift_counters   ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_extras           ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);
ALTER TABLE guardias_absences         ADD COLUMN IF NOT EXISTS team_id uuid REFERENCES guardias_teams(id);

CREATE INDEX IF NOT EXISTS idx_doctor_profiles_team ON guardias_doctor_profiles(team_id);
CREATE INDEX IF NOT EXISTS idx_holidays_team         ON guardias_holidays(team_id);
CREATE INDEX IF NOT EXISTS idx_shift_counters_team   ON guardias_shift_counters(team_id);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE guardias_teams            ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_team_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardias_team_invitations ENABLE ROW LEVEL SECURITY;

-- Teams
CREATE POLICY "teams_select" ON guardias_teams
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardias_team_members
      WHERE team_id = guardias_teams.id AND profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "teams_insert" ON guardias_teams
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "teams_update" ON guardias_teams
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM guardias_team_members
      WHERE team_id = guardias_teams.id AND profile_id = auth.uid() AND role = 'gestor' AND status = 'active'
    )
  );

-- Team members
CREATE POLICY "team_members_select" ON guardias_team_members
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "team_members_insert" ON guardias_team_members
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "team_members_update" ON guardias_team_members
  FOR UPDATE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active'
    )
    OR profile_id = auth.uid()
  );

CREATE POLICY "team_members_delete" ON guardias_team_members
  FOR DELETE TO authenticated
  USING (
    profile_id = auth.uid()
    OR team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active'
    )
  );

-- Invitations
CREATE POLICY "invitations_select" ON guardias_team_invitations
  FOR SELECT TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "invitations_insert" ON guardias_team_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active'
    )
  );

CREATE POLICY "invitations_update" ON guardias_team_invitations
  FOR UPDATE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "invitations_delete" ON guardias_team_invitations
  FOR DELETE TO authenticated
  USING (
    team_id IN (
      SELECT team_id FROM guardias_team_members
      WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active'
    )
  );

-- Doctor profiles
CREATE POLICY "dp_select" ON guardias_doctor_profiles
  FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND status = 'active')
    OR team_id IS NULL
  );

CREATE POLICY "dp_insert" ON guardias_doctor_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "dp_update" ON guardias_doctor_profiles
  FOR UPDATE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "dp_delete" ON guardias_doctor_profiles
  FOR DELETE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

-- Shift counters
CREATE POLICY "sc_select" ON guardias_shift_counters
  FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND status = 'active')
    OR team_id IS NULL
  );

CREATE POLICY "sc_upsert" ON guardias_shift_counters
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Holidays
CREATE POLICY "hol_select" ON guardias_holidays
  FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND status = 'active')
    OR team_id IS NULL
  );

CREATE POLICY "hol_insert" ON guardias_holidays
  FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "hol_update" ON guardias_holidays
  FOR UPDATE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "hol_delete" ON guardias_holidays
  FOR DELETE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

-- Special days
CREATE POLICY "sd_select" ON guardias_special_days
  FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND status = 'active')
    OR team_id IS NULL
  );

CREATE POLICY "sd_insert" ON guardias_special_days
  FOR INSERT TO authenticated
  WITH CHECK (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "sd_delete" ON guardias_special_days
  FOR DELETE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

-- Penosidad
CREATE POLICY "pen_select" ON guardias_penosidad_config
  FOR SELECT TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND status = 'active')
    OR team_id IS NULL
  );

CREATE POLICY "pen_update" ON guardias_penosidad_config
  FOR UPDATE TO authenticated
  USING (
    team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "pen_insert" ON guardias_penosidad_config
  FOR INSERT TO authenticated WITH CHECK (true);

-- Extras
CREATE POLICY "ext_select" ON guardias_extras
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "ext_insert" ON guardias_extras
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "ext_delete" ON guardias_extras
  FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- Absences
CREATE POLICY "abs_select" ON guardias_absences
  FOR SELECT TO authenticated
  USING (
    profile_id = auth.uid()
    OR team_id IN (SELECT team_id FROM guardias_team_members WHERE profile_id = auth.uid() AND role = 'gestor' AND status = 'active')
  );

CREATE POLICY "abs_insert" ON guardias_absences
  FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());

CREATE POLICY "abs_delete" ON guardias_absences
  FOR DELETE TO authenticated USING (profile_id = auth.uid());

-- ── Auto-migrar datos existentes ──────────────────────────────────────────────

DO $$
DECLARE
  admin_id   uuid;
  new_team   uuid;
  team_code  text;
BEGIN
  SELECT id INTO admin_id FROM guardias_profiles
  WHERE role = 'admin' ORDER BY created_at LIMIT 1;

  IF admin_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM guardias_teams LIMIT 1) THEN
    team_code := UPPER(
      SUBSTRING(MD5(RANDOM()::TEXT), 1, 3) || '-' ||
      SUBSTRING(MD5(RANDOM()::TEXT), 1, 3)
    );

    INSERT INTO guardias_teams (nombre, codigo, created_by)
    VALUES ('Mi Equipo', team_code, admin_id)
    RETURNING id INTO new_team;

    INSERT INTO guardias_team_members (team_id, profile_id, role, status)
    VALUES (new_team, admin_id, 'gestor', 'active')
    ON CONFLICT (team_id, profile_id) DO NOTHING;

    UPDATE guardias_profiles SET active_team_id = new_team WHERE id = admin_id;

    UPDATE guardias_doctor_profiles  SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_holidays          SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_special_days      SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_penosidad_config  SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_shift_counters    SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_extras            SET team_id = new_team WHERE team_id IS NULL;
    UPDATE guardias_absences          SET team_id = new_team WHERE team_id IS NULL;

    RAISE NOTICE 'Equipo creado: % (código: %)', new_team, team_code;
  END IF;
END $$;
