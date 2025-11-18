import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do convite é obrigatório" },
        { status: 400 }
      );
    }

    // ============================
    // 👥 Remove convidados primeiro
    // ============================
    await sql`
      DELETE FROM convidados
      WHERE convite_id = ${id}
    `;

    // ============================
    // 🎟 Remove convite
    // ============================
    const deleteRes = await sql`
      DELETE FROM convites
      WHERE id = ${id}
      RETURNING id
    `;

    // Se não retornou nada = não existia
    if (deleteRes.length === 0) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir convite:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
