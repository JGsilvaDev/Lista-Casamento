import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sql } from "../../../../../lib/db";

//
// ===========================
//           DELETE
// ===========================
//
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

    //
    // 🔍 Buscar presente antes de excluir
    //
    const result = await sql`
      SELECT imagem
      FROM presentes
      WHERE id = ${id}
    `;

    const presente = result[0];

    if (!presente) {
      return NextResponse.json(
        { error: "Presente não encontrado" },
        { status: 404 }
      );
    }

    //
    // 🗑 Remover do banco
    //
    const del = await sql`
      DELETE FROM presentes
      WHERE id = ${id}
    `;

    // Postgres do client retorna array vazio quando não há nada para deletar
    if (del.length === 0) {
      return NextResponse.json(
        { error: "Nada foi deletado" },
        { status: 404 }
      );
    }

    //
    // 🧹 Remover arquivo físico
    //
    if (presente.imagem) {
      const filePath = path.join(process.cwd(), "public", presente.imagem);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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

//
// ===========================
//           PATCH
// ===========================
//
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    //
    // 🔍 Buscar status atual
    //
    const result = await sql`
      SELECT status
      FROM presentes
      WHERE id = ${id}
    `;

    const item = result[0];

    if (!item) {
      return NextResponse.json(
        { error: "Presente não encontrado" },
        { status: 404 }
      );
    }

    const novoStatus =
      item.status === "Presentado" ? "Não Presentado" : "Presentado";

    //
    // 🔄 Atualizar status
    //
    await sql`
      UPDATE presentes
      SET status = ${novoStatus}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, status: novoStatus });
  } catch (error) {
    console.error("Erro ao atualizar presente:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar presente" },
      { status: 500 }
    );
  }
}
