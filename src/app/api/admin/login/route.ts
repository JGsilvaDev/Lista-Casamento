import { NextResponse } from "next/server";
import { sql } from "../../../../../lib/db"; 
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Busca usuário no banco
  const result = await sql`
    SELECT * FROM admins WHERE username = ${username}
  `;

  const user = result[0];

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 }
    );
  }

  // Verifica senha
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return NextResponse.json(
      { error: "Senha incorreta" },
      { status: 401 }
    );
  }

  // Criar cookie seguro
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  });

  return NextResponse.json({ message: "Login efetuado com sucesso" });
}
