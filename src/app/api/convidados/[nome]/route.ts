import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db";

//
// ===========================
//          GET
// ===========================
//
export async function GET(
  request: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;

  try {
    const conviteRes = await sql`
      SELECT *
      FROM convites
      WHERE LOWER(nome) = LOWER(${nome})
      LIMIT 1
    `;

    const convite = conviteRes[0];

    if (!convite) {
      return NextResponse.json(null, { status: 404 });
    }

    const convidados = await sql`
      SELECT *
      FROM convidados
      WHERE convite_id = ${convite.id}
      ORDER BY id ASC
    `;

    return NextResponse.json({
      convite,
      convidados,
    });
  } catch (err) {
    console.error("Erro ao carregar convite:", err);
    return NextResponse.json(
      { error: "Erro ao carregar convite" },
      { status: 500 }
    );
  }
}

//
// ===========================
//          POST
// ===========================
//
export async function POST(
  request: Request,
  { params }: { params: Promise<{ nome: string }> }
) {
  const { nome } = await params;
  const { convidado_id, confirmar } = await request.json();

  try {
    // Buscar convite
    const conviteRes = await sql`
      SELECT *
      FROM convites
      WHERE LOWER(nome) = LOWER(${nome})
      LIMIT 1
    `;

    const convite = conviteRes[0];

    if (!convite) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    // Buscar convidado
    const convidadoRes = await sql`
      SELECT *
      FROM convidados
      WHERE id = ${convidado_id}
      AND convite_id = ${convite.id}
      LIMIT 1
    `;

    const convidado = convidadoRes[0];

    if (!convidado) {
      return NextResponse.json(
        { error: "Convidado não existe nesse convite" },
        { status: 400 }
      );
    }

    //
    // CONFIRMAR
    //
    if (confirmar === true) {
      if (convite.confirmados >= convite.total_pessoas) {
        return NextResponse.json(
          { error: "Número máximo de confirmações atingido" },
          { status: 400 }
        );
      }

      await sql`
        UPDATE convidados
        SET confirmado = 1
        WHERE id = ${convidado_id}
      `;

      await sql`
        UPDATE convites
        SET confirmados = confirmados + 1
        WHERE id = ${convite.id}
      `;

      return NextResponse.json({
        sucesso: true,
        mensagem: "Confirmado!",
      });
    }

    //
    // DESCONFIRMAR
    //
    if (confirmar === false) {
      if (convite.confirmados > 0) {
        await sql`
          UPDATE convidados
          SET confirmado = 0
          WHERE id = ${convidado_id}
        `;

        await sql`
          UPDATE convites
          SET confirmados = confirmados - 1
          WHERE id = ${convite.id}
        `;
      }

      return NextResponse.json({
        sucesso: true,
        mensagem: "Removido!",
      });
    }

    return NextResponse.json(
      { error: "Ação inválida" },
      { status: 400 }
    );
  } catch (err) {
    console.error("Erro ao atualizar confirmação:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}
