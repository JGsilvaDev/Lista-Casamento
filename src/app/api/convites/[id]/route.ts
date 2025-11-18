import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // ============================
    // 🔍 Buscar convite
    // ============================
    const conviteRes = await sql`
      SELECT *
      FROM convites
      WHERE id = ${id}
      LIMIT 1
    `;

    const convite = conviteRes[0];

    if (!convite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    // ============================
    // 👥 Buscar convidados
    // ============================
    const convidados = await sql`
      SELECT *
      FROM convidados
      WHERE convite_id = ${id}
      ORDER BY id ASC
    `;

    return NextResponse.json({
      convite,
      convidados,
    });
  } catch (err) {
    console.error("Erro ao buscar dados do convite:", err);
    return NextResponse.json(
      { error: "Erro ao buscar convite" },
      { status: 500 }
    );
  }
}
