-- Migration 030: Vista materializada para business_stats
--
-- La vista regular recalcula los COUNT en cada consulta. Con muchos negocios
-- (página de admin) o muchas review_requests, esto escala mal.
--
-- La vista materializada precalcula y almacena los resultados. Un trigger
-- la refresca automáticamente cada vez que cambia un review_request.
-- Las consultas de dashboard y admin pasan de O(n requests) a O(1).
--
-- NOTA: Las vistas materializadas no admiten RLS. El acceso se controla
-- mediante la función get_business_stats() que filtra por user_id.

-- ── 1. Crear la vista materializada ─────────────────────────────────────────

CREATE MATERIALIZED VIEW IF NOT EXISTS business_stats_mat AS
SELECT
  b.id      AS business_id,
  b.user_id,
  COUNT(rr.id) AS total_requests,
  COUNT(CASE WHEN rr.status IN ('positive', 'awaiting_screenshot', 'rewarded') THEN 1 END) AS positive_count,
  COUNT(CASE WHEN rr.status = 'negative'    THEN 1 END) AS negative_count,
  COUNT(CASE WHEN rr.status = 'neutral'     THEN 1 END) AS neutral_count,
  COUNT(CASE WHEN rr.status = 'pending'     THEN 1 END) AS pending_count,
  COUNT(CASE WHEN rr.status = 'no_response' THEN 1 END) AS no_response_count,
  ROUND(
    CASE
      WHEN COUNT(CASE WHEN rr.status IN ('positive','negative','neutral','awaiting_screenshot','rewarded') THEN 1 END) > 0
      THEN COUNT(CASE WHEN rr.status IN ('positive','awaiting_screenshot','rewarded') THEN 1 END)::NUMERIC * 100
           / COUNT(CASE WHEN rr.status IN ('positive','negative','neutral','awaiting_screenshot','rewarded') THEN 1 END)
      ELSE 0
    END, 1
  ) AS positive_rate
FROM businesses b
LEFT JOIN review_requests rr ON rr.business_id = b.id
GROUP BY b.id, b.user_id
WITH DATA;

-- Índice para que el dashboard (filtro por user_id) sea O(1)
CREATE UNIQUE INDEX IF NOT EXISTS idx_business_stats_mat_business
  ON business_stats_mat(business_id);

CREATE INDEX IF NOT EXISTS idx_business_stats_mat_user
  ON business_stats_mat(user_id);

-- ── 2. Trigger para refrescar automáticamente ────────────────────────────────

CREATE OR REPLACE FUNCTION refresh_business_stats_mat()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- CONCURRENTLY permite leer la vista mientras se refresca (sin lock de tabla).
  -- Requiere el índice único creado arriba.
  REFRESH MATERIALIZED VIEW CONCURRENTLY business_stats_mat;
  RETURN NULL;
END;
$$;

-- Se dispara tras INSERT o UPDATE en review_requests (los dos eventos que
-- cambian los contadores del dashboard).
DROP TRIGGER IF EXISTS trg_refresh_business_stats ON review_requests;
CREATE TRIGGER trg_refresh_business_stats
  AFTER INSERT OR UPDATE OF status ON review_requests
  FOR EACH STATEMENT
  EXECUTE FUNCTION refresh_business_stats_mat();

-- ── 3. Función segura para consultar la vista (sustituye acceso directo) ─────
--
-- Como la vista materializada no tiene RLS, esta función SECURITY DEFINER
-- garantiza que cada usuario solo ve sus propios datos.

CREATE OR REPLACE FUNCTION get_my_business_stats()
RETURNS SETOF business_stats_mat
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT *
  FROM   business_stats_mat
  WHERE  user_id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION get_my_business_stats() TO authenticated;

-- ── 4. Mantener la vista regular para compatibilidad ─────────────────────────
-- La vista business_stats original queda como está. El dashboard puede
-- seguir usando .from("business_stats") — funciona igual, solo que más lento.
-- Para usar la versión cacheada, llama a get_my_business_stats() via RPC.
