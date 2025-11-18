import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function POST(req: Request) {
  try {
    const { convite_id, nome } = await req.json();

    if (!convite_id || !nome) {
      return NextResponse.json(
        { error: "Dados inválidos: convite_id e nome são obrigatórios" },
        { status: 400 }
      );
    }

    //
    // INSERE CONVIDADO
    //
    await sql`
      INSERT INTO convidados (convite_id, nome, confirmado)
      VALUES (${convite_id}, ${nome}, 0)
    `;

    //
    // ATUALIZA TOTAL DE PESSOAS
    //
    await sql`
      UPDATE convites
      SET total_pessoas = total_pessoas + 1
      WHERE id = ${convite_id}
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao adicionar convidado:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
