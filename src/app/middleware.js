import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.cookies.get("authToken");

  console.log(token)

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register')) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
   
    jwt.verify(token, process.env.JWT_SECRET);

    if (req.nextUrl.pathname.startsWith('/auth/login') || req.nextUrl.pathname.startsWith('/auth/register')) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification error:", err);

    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: [
    '/((?!api/public).*)', // Cegah akses ke halaman yang tidak terproteksi seperti '/auth/login' dan '/auth/register'
    '/api/protected*',
    '/*'      // API yang memerlukan autentikasi
  ],
};
