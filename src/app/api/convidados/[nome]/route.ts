import { NextResponse } from "next/server";
import { getDb } from "../../../../..//lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;
  const db = await getDb();

  const convite = await db.get(
    "SELECT * FROM convites WHERE LOWER(nome) = LOWER(?)",
    [nome]
  );

  if (!convite) {
    return NextResponse.json(null, { status: 404 });
  }

  const convidados = await db.all(
    "SELECT * FROM convidados WHERE convite_id = ?",
    [convite.id]
  );

  return NextResponse.json({
    convite,
    convidados,
  });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;
  const db = await getDb();

  const body = await request.json();
  const { convidado_id, confirmar } = body;

  const convite = await db.get(
    "SELECT * FROM convites WHERE LOWER(nome) = LOWER(?)",
    [nome]
  );

  if (!convite) {
    return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
  }

  // BUSCAR CONVIDADO
  const convidado = await db.get(
    "SELECT * FROM convidados WHERE id = ? AND convite_id = ?",
    [convidado_id, convite.id]
  );

  if (!convidado) {
    return NextResponse.json({ error: "Convidado não existe nesse convite" }, { status: 400 });
  }

  // CONFIRMAR
  if (confirmar === true) {
    if (convite.confirmados >= convite.quantidade) {
      return NextResponse.json(
        { error: "Número máximo de confirmações atingido" },
        { status: 400 }
      );
    }

    await db.run("UPDATE convidados SET confirmado = 1 WHERE id = ?", [convidado_id]);
    await db.run(
      "UPDATE convites SET confirmados = confirmados + 1 WHERE id = ?",
      [convite.id]
    );

    return NextResponse.json({ sucesso: true, mensagem: "Confirmado!" });
  }

  // DESCONFIRMAR
  if (confirmar === false) {
    if (convite.confirmados > 0) {
      await db.run("UPDATE convidados SET confirmado = 0 WHERE id = ?", [convidado_id]);
      await db.run(
        "UPDATE convites SET confirmados = confirmados - 1 WHERE id = ?",
        [convite.id]
      );
    }

    return NextResponse.json({ sucesso: true, mensagem: "Removido!" });
  }

  return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
}
