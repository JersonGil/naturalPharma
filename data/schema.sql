-- Natural's Pharma — Database schema
-- SQLite / libSQL compatible.
-- Idempotent: safe to run multiple times.

CREATE TABLE IF NOT EXISTS products (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT NOT NULL,
  category     TEXT NOT NULL,
  priceBs      REAL NOT NULL,
  priceUsd     REAL NOT NULL,
  image        TEXT NOT NULL,
  stock        INTEGER NOT NULL DEFAULT 0,
  badge        TEXT,
  rating       REAL,
  presentation TEXT,
  ingredients  TEXT,
  benefits     TEXT,        -- JSON array serializado
  usage        TEXT,
  createdAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id           TEXT PRIMARY KEY,
  username     TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  createdAt    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);