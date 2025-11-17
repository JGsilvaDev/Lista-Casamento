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
