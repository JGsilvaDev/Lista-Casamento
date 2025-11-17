import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/db";
import bcrypt from "bcryptjs";

export async function GET() {
  const db = await getDb();

  const existing = await db.get("SELECT * FROM admins WHERE username = ?", "admin");
  if (!existing) {
    const hash = await bcrypt.hash("100516", 10);
    await db.run("INSERT INTO admins (username, password) VALUES (?, ?)", "admin", hash);
    return NextResponse.json({ message: "Admin criado com sucesso!", username: "admin", password: "100516" });
  }

  return NextResponse.json({ message: "Admin já existe" });
}
