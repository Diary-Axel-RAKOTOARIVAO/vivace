-- Upvotes: one per entry per voter key (a persistent per-browser id;
-- the GitHub name is display/accountability only, not verified).
CREATE TABLE IF NOT EXISTS votes (
	entry_id INTEGER NOT NULL REFERENCES gallery(id) ON DELETE CASCADE,
	voter TEXT NOT NULL,
	gh TEXT NOT NULL DEFAULT '',
	created_at TEXT NOT NULL DEFAULT (datetime('now')),
	PRIMARY KEY (entry_id, voter)
);

CREATE INDEX IF NOT EXISTS idx_votes_entry ON votes (entry_id);
