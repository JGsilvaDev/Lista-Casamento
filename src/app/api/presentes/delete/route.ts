import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID é obrigatório" },
        { status: 400 }
      );
    }

    //
    // 🗑️ Deletar com retorno (padrão postgres + postgres.js)
    //
    const del = await sql`
      DELETE FROM presentes
      WHERE id = ${id}
      RETURNING *
    `;

    if (del.length === 0) {
      return NextResponse.json(
        { error: "Presente não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erro ao excluir presente:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
