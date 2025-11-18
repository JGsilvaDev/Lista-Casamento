import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { sql } from "../../../../lib/db";

export const runtime = "nodejs";

//
// ===========================
//            POST
// ===========================
//
export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const nome = formData.get("nome") as string;
    const categoria = formData.get("categoria") as string;
    const url = (formData.get("url") as string) || "";
    const status = (formData.get("status") as string) || "Não Presentado";
    const file = formData.get("imagem") as File;

    if (!nome || !categoria || !file) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    //
    // 📁 Salva arquivo na pasta pública
    //
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Salvar a imagem
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const imagePath = `/uploads/${fileName}`;

    //
    // 💾 Inserir no Postgres
    //
    await sql`
      INSERT INTO presentes (nome, categoria, url, status, imagem)
      VALUES (${nome}, ${categoria}, ${url}, ${status}, ${imagePath})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro ao salvar presente:", err);
    return NextResponse.json(
      { error: "Erro ao salvar presente" },
      { status: 500 }
    );
  }
}

//
// ===========================
//            GET
// ===========================
//
export async function GET() {
  try {
    const presentes = await sql`
      SELECT *
      FROM presentes
      ORDER BY nome ASC
    `;

    return NextResponse.json(presentes);
  } catch (error) {
    console.error("Erro ao buscar presentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar presentes" },
      { status: 500 }
    );
  }
}
