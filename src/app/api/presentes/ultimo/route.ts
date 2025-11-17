// src/app/api/presentes/ultimos/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET() {
  try {
    const db = await getDb();

    // Busca os últimos 5 presentes comprados
    const ultimos = await db.all(`
      SELECT p.nome, c.nome as pessoa
      FROM presentes p
      JOIN convidados c ON c.id = p.convidado_id
      WHERE p.status = 'Presentado'
      ORDER BY p.id DESC
      LIMIT 5
    `);

    return NextResponse.json(ultimos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar últimos presentes" }, { status: 500 });
  }
}
