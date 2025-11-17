// /app/api/convidados/delete/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const db = await getDb();

    if (!id) {
      return NextResponse.json(
        { error: "ID não informado." },
        { status: 400 }
      );
    }

    const convidado = await db.get(
        "SELECT convite_id FROM convidados WHERE id = ?",
        [id]
    );

    await db.run(
      `
      DELETE FROM convidados
      WHERE id = ?
      `,
      [id]
    );

    const conviteId = convidado.convite_id;

    await db.run(`
        UPDATE convites
        SET total_pessoas = CASE
            WHEN total_pessoas > 0 THEN total_pessoas - 1
            ELSE 0
        END
        WHERE id = ?
    `, [conviteId]);

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro ao excluir convidado:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir convidado." },
      { status: 500 }
    );
  }
}
