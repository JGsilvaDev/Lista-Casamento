import { NextResponse } from "next/server";
import { sql } from "../../../../lib/db"; 
import bcrypt from "bcryptjs";

export async function GET() {
  // Verifica se o admin já existe
  const existing = await sql`
    SELECT * FROM admins WHERE username = 'admin'
  `;

  if (existing.length === 0) {
    const hash = await bcrypt.hash("100516", 10);

    await sql`
      INSERT INTO admins (username, password)
      VALUES ('admin', ${hash})
    `;

    return NextResponse.json({
      message: "Admin criado com sucesso!",
      username: "admin",
      password: "100516",
    });
  }

  return NextResponse.json({
    message: "Admin já existe",
  });
}
