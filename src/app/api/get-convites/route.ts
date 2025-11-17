import { getDb } from "../../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = await getDb();
  try {
    const convites = await db.all(`
      SELECT 
        id, 
        nome, 
        total_pessoas AS totalPessoas,
        confirmados
      FROM convites
      ORDER BY nome ASC
    `);

    return NextResponse.json(convites);
  } catch (err) {
    console.error("Erro ao buscar convites:", err);
    return NextResponse.json({ error: "Erro ao carregar convites" }, { status: 500 });
  }
}
