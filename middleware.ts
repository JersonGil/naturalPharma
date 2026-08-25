import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'np_admin_token';

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET no está definida. Generá una con: openssl rand -hex 32'
    );
  }
  return new TextEncoder().encode(secret);
}

async function isValid(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret());
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Sólo protegemos rutas /admin (excepto /admin/login que es público)
  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token || !(await isValid(token))) {
    const response = NextResponse.redirect(
      new URL('/admin/login', request.url)
    );
    if (token) response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};