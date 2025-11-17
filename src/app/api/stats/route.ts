// src/app/api/stats/route.ts
import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";

export async function GET() {
  try {
    const db = await getDb();

    const totalConvidados = await db.get("SELECT COUNT(*) as total FROM convidados");
    const confirmados = await db.get("SELECT COUNT(*) as total FROM convidados WHERE confirmado = 1");
    const convitesEnviados = await db.get("SELECT COUNT(*) as total FROM convites");
    const presentesComprados = await db.get("SELECT COUNT(*) as total FROM presentes WHERE status = 'Presentado'");

    return NextResponse.json({
      totalConvidados: totalConvidados.total || 0,
      confirmados: confirmados.total || 0,
      convitesEnviados: convitesEnviados.total || 0,
      presentesComprados: presentesComprados.total || 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro ao buscar stats" }, { status: 500 });
  }
}
