import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";
import QRCode from "qrcode";

export async function POST(req: Request) {
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

  try {
    // ============================
    // 📌 INSERE CONVITE (Postgres)
    // ============================
    const conviteRes = await sql`
      INSERT INTO convites (nome, telefone, total_pessoas, qr_code)
      VALUES (${nome}, ${telefone}, ${totalPessoas}, ${qr})
      RETURNING id
    `;

    const conviteId = conviteRes[0].id;

    // ============================
    // 👥 INSERE CONVIDADOS
    // ============================
    if (Array.isArray(convidados)) {
      for (const convidado of convidados) {
        await sql`
          INSERT INTO convidados (convite_id, nome)
          VALUES (${conviteId}, ${convidado})
        `;
      }
    }

    return NextResponse.json({ success: true, conviteId });
  } catch (err) {
    console.error("Erro ao criar convite:", err);
    return NextResponse.json(
      { error: "Erro ao criar convite" },
      { status: 500 }
    );
  }
}
