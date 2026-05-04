-- Migration 015: Corrige business_stats para que awaiting_screenshot y rewarded
-- cuenten como respuestas positivas, ya que ambos estados implican satisfacción del cliente.
CREATE OR REPLACE VIEW business_stats AS
SELECT
  b.id   AS business_id,
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
      THEN COUNT(CASE WHEN rr.status IN ('positive', 'awaiting_screenshot', 'rewarded') THEN 1 END)::NUMERIC * 100
           / COUNT(CASE WHEN rr.status IN ('positive','negative','neutral','awaiting_screenshot','rewarded') THEN 1 END)
      ELSE 0
    END, 1
  ) AS positive_rate
FROM businesses b
LEFT JOIN review_requests rr ON rr.business_id = b.id
GROUP BY b.id, b.user_id;
