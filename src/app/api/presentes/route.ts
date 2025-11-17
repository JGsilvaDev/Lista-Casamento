import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getDb } from "../../../../lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();

  const nome = formData.get("nome") as string;
  const categoria = formData.get("categoria") as string;
  const status = (formData.get("status") as string) || "Não Presentado";
  const file = formData.get("imagem") as File;

  if (!nome || !categoria || !file) {
    return NextResponse.json(
      { error: "Todos os campos são obrigatórios" },
      { status: 400 }
    );
  }

  // Pasta de upload
  const uploadDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  // Salva arquivo
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  try {
    const db = await getDb();
    await db.run(
      "INSERT INTO presentes (nome, categoria, status, imagem) VALUES (?, ?, ?, ?)",
      [nome, categoria, status, `/uploads/${file.name}`]
    );
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao salvar no banco" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const presentes = await db.all("SELECT * FROM presentes ORDER BY nome ASC");
    return NextResponse.json(presentes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erro ao buscar presentes" },
      { status: 500 }
    );
  }
}
