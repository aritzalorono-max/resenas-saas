-- Migration 029: Función RPC para asignación atómica de código de pool
--
-- El problema: la app hace SELECT (busca primer código disponible) y luego
-- UPDATE (lo marca como usado) en dos queries separadas. Con dos peticiones
-- simultáneas, ambas pueden leer el mismo código antes de que alguna lo marque
-- como usado → el mismo código se asigna a dos clientes distintos.
--
-- La solución: UPDATE ... WHERE id = (subquery con FOR UPDATE SKIP LOCKED)
-- es una sola operación atómica. PostgreSQL garantiza que cada código
-- solo puede ser asignado a una petición, sin importar la concurrencia.

CREATE OR REPLACE FUNCTION assign_pool_discount_code(
  p_business_id       UUID,
  p_review_request_id UUID
)
RETURNS TEXT        -- devuelve el código asignado, o NULL si no hay disponibles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_code TEXT;
BEGIN
  UPDATE discount_codes
  SET
    status            = 'used',
    review_request_id = p_review_request_id,
    used_at           = now()
  WHERE id = (
    SELECT id
    FROM   discount_codes
    WHERE  business_id = p_business_id
      AND  type        = 'pool'
      AND  status      = 'available'
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE SKIP LOCKED   -- clave: descarta filas bloqueadas por otra transacción
  )
  RETURNING code INTO v_code;

  RETURN v_code;  -- NULL si no había códigos disponibles
END;
$$;

GRANT EXECUTE ON FUNCTION assign_pool_discount_code(UUID, UUID) TO service_role;
