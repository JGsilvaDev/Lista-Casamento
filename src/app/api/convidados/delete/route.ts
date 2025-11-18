// /app/api/convidados/delete/route.ts
import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado." },
        { status: 400 }
      );
    }

    //
    // Buscar convite do convidado
    //
    const convidadoRes = await sql`
      SELECT convite_id
      FROM convidados
      WHERE id = ${id}
      LIMIT 1
    `;

    const convidado = convidadoRes[0];

    if (!convidado) {
      return NextResponse.json(
        { error: "Convidado não encontrado." },
        { status: 404 }
      );
    }

    //
    // Remover convidado
    //
    await sql`
      DELETE FROM convidados
      WHERE id = ${id}
    `;

    //
    // Atualizar total de pessoas no convite
    //
    await sql`
      UPDATE convites
      SET total_pessoas = GREATEST(total_pessoas - 1, 0)
      WHERE id = ${convidado.convite_id}
    `;

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error("Erro ao excluir convidado:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir convidado." },
      { status: 500 }
    );
  }
}
