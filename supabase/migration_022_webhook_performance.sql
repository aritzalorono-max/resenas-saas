-- migration_022: Índices de rendimiento para webhook y rate limiting
--
-- Estos índices son críticos con miles de usuarios y millones de registros.
-- El webhook de Twilio busca solicitudes por teléfono + status en cada mensaje
-- entrante. Sin estos índices, hace full scan de review_requests.

-- Webhook: busca "pending" por customer_phone (múltiples variantes de formato)
-- findPendingRequestByPhone hace: WHERE customer_phone IN (...) AND status = 'pending'
CREATE INDEX IF NOT EXISTS idx_review_requests_phone_status
  ON review_requests(customer_phone, status)
  WHERE status = 'pending';

-- Webhook: también busca conversaciones activas recientes para evitar duplicados
CREATE INDEX IF NOT EXISTS idx_review_requests_phone_created
  ON review_requests(customer_phone, created_at DESC);

-- Rate limiting: busca por key + created_at para contar intentos en ventana de tiempo
-- checkGeneralRateLimit hace: WHERE key = $1 AND created_at > now() - interval
CREATE INDEX IF NOT EXISTS idx_rate_limits_key_created
  ON rate_limits(key, created_at DESC);

-- Limpieza automática de rate limits expirados (si tienes un cron de limpieza)
-- Este índice ayuda a DELETE WHERE created_at < now() - interval
CREATE INDEX IF NOT EXISTS idx_rate_limits_created
  ON rate_limits(created_at);

-- business_stats view: si se convierte en tabla materializada, este índice
-- acelera el JOIN con auth.users
CREATE INDEX IF NOT EXISTS idx_businesses_user_id
  ON businesses(user_id);
