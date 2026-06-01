-- Tabla general de eventos para rate limiting basado en DB.
-- Usada por rutas públicas (webhook, registro) para limitar por IP o por clave arbitraria.
--
-- RLS intencionalmente desactivada: esta tabla solo se accede desde el servidor
-- usando createServiceClient() (service_role key), nunca desde el cliente/browser.
-- No contiene datos de usuario sensibles — solo claves opacas + timestamps.
-- Activar RLS añadiría overhead sin beneficio de seguridad real aquí.

CREATE TABLE IF NOT EXISTS rate_limit_events (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_events_key_time
  ON rate_limit_events (key, created_at DESC);

-- Limpieza automática de eventos con más de 24 horas (evita crecer indefinidamente)
CREATE OR REPLACE FUNCTION cleanup_rate_limit_events() RETURNS void AS $$
BEGIN
  DELETE FROM rate_limit_events WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;
