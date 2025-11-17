import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import QRCode from "qrcode";

export async function POST(req: Request) {
  const db = await getDb();
  const body = await req.json();

  const { nome, telefone, totalPessoas, convidados } = body;

  if (!nome) {
    return NextResponse.json(
      { error: "Nome é obrigatório" },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const conviteUrl = `${baseUrl}/confirmar?nome=${encodeURIComponent(nome)}`;

  const qr = await QRCode.toDataURL(conviteUrl);

  // Insere convite
  const result = await db.run(
    `
    INSERT INTO convites (nome, telefone, total_pessoas, qr_code)
    VALUES (?, ?, ?, ?)
    `,
    [nome, telefone, totalPessoas, qr]
  );

  const conviteId = result.lastID;

  // Insere convidados
  for (const convidado of convidados) {
    await db.run(
      `
      INSERT INTO convidados (convite_id, nome)
      VALUES (?, ?)
    `,
      [conviteId, convidado]
    );
  }

  return NextResponse.json({ success: true, conviteId });
}
