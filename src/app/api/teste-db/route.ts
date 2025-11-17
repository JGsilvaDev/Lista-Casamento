import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function GET() {
  const db = await getDb();

  // Inserir um registro de teste
  await db.run("INSERT INTO gifts (name) VALUES (?)", "Panela elétrica");

  // Buscar todos os registros
  const gifts = await db.all("SELECT * FROM gifts");

  return NextResponse.json(gifts);
}
