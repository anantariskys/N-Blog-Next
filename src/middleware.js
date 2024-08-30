import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get("authToken")?.value;
  const { pathname } = req.nextUrl;

  
  const authPaths = ["/auth/login", "/auth/register"];
  
  try {
    if (typeof token === 'string' && token) {
      const {payload}  = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      if (authPaths.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      return NextResponse.next();
    }

  } catch (error) {
    if (error.code === 'ERR_JWT_EXPIRED') {
      console.error("JWT has expired:", error);
      const response = NextResponse.redirect(new URL("/auth/login", req.url));
      response.cookies.set("authToken", "", { maxAge: -1 }); // Menghapus cookie
      return response;
    } else {
      console.error("JWT verification error:", error);
    }
  }
  
  if (!token && !authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  
  console.log('run')
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}