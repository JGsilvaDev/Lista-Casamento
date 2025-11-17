import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const db = await getDb();

  const user = await db.get("SELECT * FROM admins WHERE username = ?", username);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 401 });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });

  // 🔧 Aqui é o ajuste
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ message: "Login efetuado com sucesso" });
}
