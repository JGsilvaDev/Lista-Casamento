// src/app/api/presentes/ultimos/route.ts
import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function GET() {
  try {
    const ultimos = await sql`
      SELECT 
        p.nome,
        c.nome AS pessoa
      FROM presentes p
      JOIN convidados c ON c.id = p.convidado_id
      WHERE p.status = 'Presentado'
      ORDER BY p.id DESC
      LIMIT 5
    `;

    return NextResponse.json(ultimos);
  } catch (error) {
    console.error("Erro ao buscar últimos presentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar últimos presentes" },
      { status: 500 }
    );
  }
}
