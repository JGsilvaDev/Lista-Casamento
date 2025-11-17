import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";
import fs from "fs";
import path from "path";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Primeiro busca o presente para remover o arquivo da imagem depois
    const presente = await db.get("SELECT imagem FROM presentes WHERE id = ?", [id]);

    if (!presente) {
      return NextResponse.json(
        { error: "Presente não encontrado" },
        { status: 404 }
      );
    }

    // Deleta do banco
    const result = await db.run("DELETE FROM presentes WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Nada foi deletado" },
        { status: 404 }
      );
    }

    if (presente.imagem) {
        const filePath = path.join(process.cwd(), "public", presente.imagem);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao excluir presente:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const db = await getDb();

    // Buscar status atual
    const item = await db.get(
      "SELECT status FROM presentes WHERE id = ?",
      [id]
    );

    if (!item) {
      return NextResponse.json({ error: "Presente não encontrado" }, { status: 404 });
    }

    const novoStatus =
      item.status === "Presentado" ? "Não Presentado" : "Presentado";

    await db.run(
      "UPDATE presentes SET status = ? WHERE id = ?",
      [novoStatus, id]
    );

    return NextResponse.json({ success: true, status: novoStatus });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
