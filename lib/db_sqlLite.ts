import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: './casamento.db',
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS gifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT
      )
    `);

    await db.exec(`
      CREATE TABLE IF NOT EXISTS convites (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          telefone TEXT,
          total_pessoas INTEGER NOT NULL DEFAULT 1,
          confirmados INTEGER NOT NULL DEFAULT 0,
          qr_code TEXT,
          criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS convidados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          convite_id INTEGER NOT NULL,
          nome TEXT NOT NULL,
          confirmado INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (convite_id) REFERENCES convites(id) ON DELETE CASCADE
      );
    `);
  }
  
  return db;
}