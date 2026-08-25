import { NextRequest, NextResponse } from 'next/server';
import { ensureSetup } from '@/lib/setup';
import {
  findAdminByUsername,
  verifyPassword,
  signAdminToken,
  setAdminCookie,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  await ensureSetup();

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

  const admin = await findAdminByUsername(username);
  if (!admin) {
    return NextResponse.json(
      { error: 'Credenciales no válidas. Verificá tu usuario y contraseña.' },
      { status: 401 }
    );
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: 'Credenciales no válidas. Verificá tu usuario y contraseña.' },
      { status: 401 }
    );
  }

  const token = await signAdminToken(admin.id, admin.username);
  await setAdminCookie(token);

  return NextResponse.json({ ok: true, username: admin.username });
}