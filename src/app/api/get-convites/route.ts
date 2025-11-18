import { sql } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const convites = await sql`
      SELECT 
        id,
        nome,
        total_pessoas AS "totalPessoas",
        confirmados
      FROM convites
      ORDER BY nome ASC
    `;

    return NextResponse.json(convites);
  } catch (err) {
    console.error("Erro ao buscar convites:", err);
    return NextResponse.json(
      { error: "Erro ao carregar convites" },
      { status: 500 }
    );
  }
}
