import { getDb } from "../../../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { convite_id, nome } = await req.json();
  const db = await getDb();

  if (!convite_id || !nome) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await db.run(
    "INSERT INTO convidados (convite_id, nome, confirmado) VALUES (?, ?, 0)",
    [convite_id, nome]
  );

  await db.run(
    "UPDATE convites SET total_pessoas = total_pessoas + 1 WHERE id = ?",
    [convite_id]
  );

  return NextResponse.json({ success: true });
}
