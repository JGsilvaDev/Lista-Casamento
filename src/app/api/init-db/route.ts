import { NextResponse } from "next/server";
import { initDb } from "../../../../lib/db"; 

export async function GET() {
  try {
    await initDb(); // roda todos os CREATE TABLE

    return NextResponse.json({
      ok: true,
      message: "Banco de dados inicializado com sucesso!",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        message: "Erro ao inicializar banco",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
