-- Migration 031: Revierte el trigger de migration_030 (rompía los INSERT)
--
-- PROBLEMA: REFRESH MATERIALIZED VIEW CONCURRENTLY no puede ejecutarse dentro
-- de una transacción, y los triggers siempre corren dentro de una. El trigger
-- de migration_030 hacía fallar TODOS los INSERT/UPDATE en review_requests:
--   ERROR: REFRESH MATERIALIZED VIEW CONCURRENTLY cannot be executed from a function
--
-- SOLUCIÓN: eliminar el trigger y la vista materializada. La vista regular
-- business_stats (que es la que usa el dashboard) funciona correctamente y
-- es suficientemente rápida con los índices existentes. Si en el futuro hace
-- falta cachear, la forma correcta es refrescar con pg_cron, no con triggers.

DROP TRIGGER IF EXISTS trg_refresh_business_stats ON review_requests;
DROP FUNCTION IF EXISTS refresh_business_stats_mat();
DROP FUNCTION IF EXISTS get_my_business_stats();
DROP MATERIALIZED VIEW IF EXISTS business_stats_mat;
