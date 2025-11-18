import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// Executa os CREATE TABLE
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE,
      password TEXT
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS convites (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      telefone TEXT,
      observacao TEXT,
      total_pessoas INTEGER NOT NULL DEFAULT 1,
      confirmados INTEGER NOT NULL DEFAULT 0,
      qr_code TEXT,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS convidados (
      id SERIAL PRIMARY KEY,
      convite_id INTEGER NOT NULL REFERENCES convites(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      confirmado INTEGER NOT NULL DEFAULT 0
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS presentes (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'Não Presentado',
      url TEXT NOT NULL,
      imagem TEXT NOT NULL,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

export { sql };
