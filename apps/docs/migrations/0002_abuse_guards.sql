-- Abuse guards: dedup identical submissions, hashed-IP rate limiting.
ALTER TABLE gallery ADD COLUMN ip_hash TEXT NOT NULL DEFAULT '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_gallery_unique ON gallery (viv, trig, subject);
CREATE INDEX IF NOT EXISTS idx_gallery_ip ON gallery (ip_hash, created_at);
