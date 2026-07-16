-- Community gallery: shared compositions.
CREATE TABLE IF NOT EXISTS gallery (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	author TEXT NOT NULL,
	viv TEXT NOT NULL,
	trig TEXT NOT NULL DEFAULT 'load',
	subject TEXT NOT NULL DEFAULT 'card',
	created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gallery_created ON gallery (created_at DESC);
