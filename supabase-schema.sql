-- Schema per Form Curso Studio83
-- Esegui questo SQL nel SQL Editor di Supabase

-- Tabella submissions
CREATE TABLE IF NOT EXISTS submissions (
  id BIGSERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  edad TEXT,
  formacion TEXT,
  tiempo_trabajo TEXT,
  areas TEXT[], -- Array di stringhe
  objetivo TEXT,
  modalidad TEXT,
  periodo TEXT,
  fecha_concreta TEXT,
  formato TEXT,
  objetivo_profesional TEXT[], -- Array di stringhe
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per ordinamento per data
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- Abilita Row Level Security (opzionale ma consigliato)
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy per permettere inserimenti anonimi (form pubblico)
CREATE POLICY "Allow anonymous inserts" ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy per permettere lettura solo con chiave service_role (admin)
CREATE POLICY "Allow service role full access" ON submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
