import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose"; 

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-key"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Proteger apenas rotas /admin
  if (pathname.startsWith("/admin")) {
    // Ignorar página de login e API de login
    if (pathname === "/admin/login" || pathname === "/api/admin/login") {
      return NextResponse.next();
    }

    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (err) {
      // Token inválido
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
