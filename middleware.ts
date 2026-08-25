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

  // Rutas siempre públicas
  if (pathname === '/admin/login' || pathname === '/api/auth/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = token ? await isValid(token) : false;

  // Páginas admin → redirect a login si no hay sesión
  if (pathname.startsWith('/admin')) {
    if (!valid) {
      const response = NextResponse.redirect(
        new URL('/admin/login', request.url)
      );
      if (token && !valid) response.cookies.delete(COOKIE_NAME);
      return response;
    }
    return NextResponse.next();
  }

  // Endpoints admin → 401 JSON si no hay sesión
  if (pathname.startsWith('/api/admin')) {
    if (!valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};