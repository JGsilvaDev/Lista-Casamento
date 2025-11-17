import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) return NextResponse.json({ error: "ID é obrigatório" }, { status: 400 });

    const db = await getDb();
    const result = await db.run("DELETE FROM presentes WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
