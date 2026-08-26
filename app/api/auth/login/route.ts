import { NextRequest, NextResponse } from 'next/server';
import { ensureSetup } from '@/lib/setup';
import {
  findAdminByUsername,
  verifyPassword,
  signAdminToken,
  setAdminCookie,
} from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// Hash bcrypt cost 10 de un string cualquiera — se usa solo para mantener
// constante el tiempo de respuesta cuando el usuario NO existe (timing attack).
const DUMMY_HASH =
  '$2a$10$x3ucvwRzfsX8B2qf9YjfROYM5g9mwRWZoFxrUueKIOUWq2ojZsu3G';

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

export async function POST(request: NextRequest) {
  await ensureSetup();

  const clientIp = getClientIp(request);
  const rl = checkRateLimit(`login:${clientIp}`);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Probá de nuevo en unos minutos.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec ?? 900) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const username =
    typeof body === 'object' && body !== null && 'username' in body
      ? String((body as Record<string, unknown>).username ?? '').trim()
      : '';
  const password =
    typeof body === 'object' && body !== null && 'password' in body
      ? String((body as Record<string, unknown>).password ?? '')
      : '';

  if (!username || !password) {
    return NextResponse.json(
      { error: 'Falta usuario o contraseña.' },
      { status: 400 }
    );
  }

  // Buscamos al admin; si no existe usamos un hash dummy para mantener
  // constante el costo computacional de bcrypt.compare (timing-safe).
  const admin = await findAdminByUsername(username);
  const hashToCompare = admin?.passwordHash ?? DUMMY_HASH;
  const passwordValid = await verifyPassword(password, hashToCompare);

  if (!admin || !passwordValid) {
    return NextResponse.json(
      { error: 'Credenciales no válidas. Verificá tu usuario y contraseña.' },
      { status: 401 }
    );
  }

  // Login OK → resetear contador de rate limit
  resetRateLimit(`login:${clientIp}`);

  const token = await signAdminToken(admin.id, admin.username);
  await setAdminCookie(token);

  return NextResponse.json(
    { ok: true, username: admin.username },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}