import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = await getDb();

  const convite = await db.get(
    "SELECT * FROM convites WHERE id = ?",
    [id]
  );

  if (!convite) {
    return NextResponse.json(
      { error: "Convite não encontrado" },
      { status: 404 }
    );
  }

  const convidados = await db.all(
    "SELECT * FROM convidados WHERE convite_id = ?",
    [id]
  );

  return NextResponse.json({
    convite,
    convidados,
  });
}
