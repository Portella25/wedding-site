import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validação simples (apenas senha importa aqui, mas user pode ser 'admin')
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    }

    // Gerar Token
    const token = jwt.sign({ role: "admin", username }, JWT_SECRET, {
      expiresIn: "1d",
    });

    // Definir Cookie
    (await cookies()).set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 dia
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
