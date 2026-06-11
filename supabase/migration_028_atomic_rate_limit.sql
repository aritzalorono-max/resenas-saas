-- Migration 028: Función RPC para rate limiting atómico
--
-- El problema: la app hace dos COUNT separados (ventana 5 min + ventana 24h).
-- Entre el COUNT y el INSERT en review_requests existe una ventana de tiempo
-- donde dos peticiones simultáneas pueden pasar ambas aunque una debería fallar.
--
-- La solución: pg_advisory_xact_lock serializa las llamadas por negocio.
-- Solo un request por business_id puede ejecutar la función a la vez.
-- La ventana de race se reduce de ~segundos a ~0ms.

CREATE OR REPLACE FUNCTION check_business_rate_limit(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_short_count INT;
  v_day_count   INT;
BEGIN
  -- Bloqueo exclusivo por negocio: serializa peticiones concurrentes.
  -- El número se deriva del UUID del negocio de forma determinista.
  PERFORM pg_advisory_xact_lock(
    ('x' || substring(md5(p_business_id::text), 1, 16))::bit(64)::bigint
  );

  SELECT COUNT(*) INTO v_short_count
  FROM review_requests
  WHERE business_id = p_business_id
    AND created_at  >= now() - INTERVAL '5 minutes';

  IF v_short_count >= 20 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'count',   v_short_count,
      'reason',  'short_window'
    );
  END IF;

  SELECT COUNT(*) INTO v_day_count
  FROM review_requests
  WHERE business_id = p_business_id
    AND created_at  >= now() - INTERVAL '24 hours';

  IF v_day_count >= 200 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'count',   v_day_count,
      'reason',  'day_window'
    );
  END IF;

  RETURN jsonb_build_object('allowed', true, 'count', v_short_count);
END;
$$;

-- Permite que el rol autenticado llame a esta función
GRANT EXECUTE ON FUNCTION check_business_rate_limit(UUID) TO authenticated;
