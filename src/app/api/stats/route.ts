// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db";

export async function GET() {
  try {
    const totalConvidados =
      await sql`SELECT COUNT(*)::int AS total FROM convidados`;

    const confirmados =
      await sql`SELECT COUNT(*)::int AS total FROM convidados WHERE confirmado = true`;

    const convitesEnviados =
      await sql`SELECT COUNT(*)::int AS total FROM convites`;

    const presentesComprados =
      await sql`SELECT COUNT(*)::int AS total FROM presentes WHERE status = 'Presentado'`;

    return NextResponse.json({
      totalConvidados: totalConvidados[0]?.total || 0,
      confirmados: confirmados[0]?.total || 0,
      convitesEnviados: convitesEnviados[0]?.total || 0,
      presentesComprados: presentesComprados[0]?.total || 0,
    });
  } catch (error) {
    console.error("Erro ao buscar stats:", error);
    return NextResponse.json(
      { error: "Erro ao buscar stats" },
      { status: 500 }
    );
  }
}
