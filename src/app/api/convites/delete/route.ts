import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID do convite é obrigatório" },
        { status: 400 }
      );
    }

    console.log("Deletando convite com ID:", id);

    const db = await getDb();

    // Primeiro remove os convidados associados
    await db.run("DELETE FROM convidados WHERE convite_id = ?", [id]);

    // Depois remove o convite
    const result = await db.run("DELETE FROM convites WHERE id = ?", [id]);

    // Verifica se algo foi realmente deletado
    if (result.changes === 0) {
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
