-- DEA-HABBO-ES V5. D1 / SQLite. Historial inmutable desde la aplicación.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
  discord_id TEXT PRIMARY KEY, username TEXT NOT NULL, avatar_hash TEXT,
  updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, discord_id TEXT NOT NULL REFERENCES users(discord_id),
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_exp ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY, habbo_name TEXT NOT NULL, habbo_key TEXT NOT NULL UNIQUE,
  discord_id TEXT UNIQUE REFERENCES users(discord_id), rank_index INTEGER NOT NULL DEFAULT 0 CHECK(rank_index BETWEEN 0 AND 34),
  joined_at TEXT NOT NULL, last_promoted_at TEXT NOT NULL,
  created_by_discord_id TEXT NOT NULL REFERENCES users(discord_id)
);
CREATE INDEX IF NOT EXISTS idx_agents_rank ON agents(rank_index);
CREATE TABLE IF NOT EXISTS promotions (
  id TEXT PRIMARY KEY, agent_id TEXT NOT NULL REFERENCES agents(id),
  from_rank_index INTEGER NOT NULL, to_rank_index INTEGER NOT NULL,
  authorized_by_discord_id TEXT NOT NULL REFERENCES users(discord_id),
  presence_verified INTEGER NOT NULL CHECK(presence_verified=1),
  note TEXT NOT NULL DEFAULT '', promoted_at TEXT NOT NULL,
  UNIQUE(agent_id,from_rank_index,to_rank_index)
);
CREATE INDEX IF NOT EXISTS idx_promotions_agent ON promotions(agent_id,promoted_at DESC);
CREATE TABLE IF NOT EXISTS promotion_permissions (
 discord_id TEXT PRIMARY KEY REFERENCES users(discord_id), max_rank_index INTEGER NOT NULL CHECK(max_rank_index BETWEEN 0 AND 34),
 granted_by_discord_id TEXT NOT NULL REFERENCES users(discord_id), created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_events (
 id TEXT PRIMARY KEY, actor_discord_id TEXT NOT NULL REFERENCES users(discord_id),
 action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
 detail_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_audit_date ON audit_events(created_at DESC);
-- Prevenir edición o borrado accidental del historial desde cualquier conexión SQL.
CREATE TRIGGER IF NOT EXISTS prevent_promotions_update BEFORE UPDATE ON promotions BEGIN SELECT RAISE(ABORT,'Historial de ascensos inmutable'); END;
CREATE TRIGGER IF NOT EXISTS prevent_promotions_delete BEFORE DELETE ON promotions BEGIN SELECT RAISE(ABORT,'Historial de ascensos inmutable'); END;
CREATE TRIGGER IF NOT EXISTS prevent_audit_update BEFORE UPDATE ON audit_events BEGIN SELECT RAISE(ABORT,'Auditoría inmutable'); END;
CREATE TRIGGER IF NOT EXISTS prevent_audit_delete BEFORE DELETE ON audit_events BEGIN SELECT RAISE(ABORT,'Auditoría inmutable'); END;

-- V6: solicitudes web desde R2, normativa editable, nóminas y paga extra de asistencia.
CREATE TABLE IF NOT EXISTS applications (
 id TEXT PRIMARY KEY, discord_id TEXT NOT NULL UNIQUE REFERENCES users(discord_id),
 habbo_name TEXT NOT NULL, habbo_key TEXT NOT NULL UNIQUE,
 status TEXT NOT NULL DEFAULT 'pendiente' CHECK(status IN ('pendiente','aprobada','rechazada')),
 created_at TEXT NOT NULL, reviewed_by TEXT REFERENCES users(discord_id), reviewed_at TEXT,
 rejection_note TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS idx_applications_state ON applications(status,created_at);
CREATE TABLE IF NOT EXISTS rank_rules (
 category TEXT PRIMARY KEY, period_label TEXT NOT NULL, min_seconds INTEGER,
 payroll_hours REAL, payroll_credits INTEGER, updated_by TEXT, updated_at TEXT NOT NULL
);
INSERT OR IGNORE INTO rank_rules VALUES
 ('R1','Cada 15 minutos',900,NULL,NULL,NULL,'2026-10-01'),
 ('R2','2 horas',7200,3,7,NULL,'2026-10-01'),
 ('R3','4 horas',14400,6,12,NULL,'2026-10-01'),
 ('R4','12 horas',43200,7,14,NULL,'2026-10-01'),
 ('R5','5 días',432000,8,16,NULL,'2026-10-01'),
 ('R6','15 días',1296000,8,18,NULL,'2026-10-01'),
 ('R7','25 días',2160000,NULL,22,NULL,'2026-10-01'),
 ('R8','Por méritos',NULL,NULL,33,NULL,'2026-10-01'),
 ('R9','Elección Founders',NULL,NULL,NULL,NULL,'2026-10-01'),
 ('R10','Dirección superior',NULL,NULL,NULL,NULL,'2026-10-01');
CREATE TABLE IF NOT EXISTS payments (
 id TEXT PRIMARY KEY, agent_id TEXT NOT NULL REFERENCES agents(id),
 kind TEXT NOT NULL CHECK(kind IN ('miercoles','domingo','extra')),
 payment_date TEXT NOT NULL, hours_verified REAL,
 credits INTEGER NOT NULL CHECK(credits >= 0),
 verified_by_discord_id TEXT NOT NULL REFERENCES users(discord_id),
 paid_at TEXT NOT NULL, note TEXT NOT NULL DEFAULT '',
 UNIQUE(agent_id,kind,payment_date)
);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);
CREATE TABLE IF NOT EXISTS extra_sessions (
 payment_date TEXT PRIMARY KEY, credits_per_agent INTEGER NOT NULL CHECK(credits_per_agent>=0),
 created_by_discord_id TEXT NOT NULL REFERENCES users(discord_id), created_at TEXT NOT NULL,
 note TEXT NOT NULL DEFAULT ''
);
CREATE TRIGGER IF NOT EXISTS prevent_payments_update BEFORE UPDATE ON payments BEGIN SELECT RAISE(ABORT,'Pago inmutable; rectificar mediante movimiento nuevo'); END;
CREATE TRIGGER IF NOT EXISTS prevent_payments_delete BEFORE DELETE ON payments BEGIN SELECT RAISE(ABORT,'Pago inmutable'); END;
