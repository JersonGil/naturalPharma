import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { query } from './db';
import {
  signAdminToken,
  verifyAdminToken,
  COOKIE_NAME,
  COOKIE_MAX_AGE_SECONDS,
  type AdminTokenPayload,
} from './jwt';

export {
  signAdminToken,
  verifyAdminToken,
  COOKIE_NAME,
  COOKIE_MAX_AGE_SECONDS,
  type AdminTokenPayload,
};

export const BCRYPT_COST = 10;

interface AdminRow {
  id: string;
  username: string;
  passwordHash: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function findAdminByUsername(
  username: string
): Promise<AdminRow | null> {
  const rows = await query<AdminRow>(
    'SELECT id, username, passwordHash FROM admins WHERE username = ? LIMIT 1',
    [username]
  );
  return rows[0] ?? null;
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: '/',
  });
}

export async function getAdminCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Helper para route handlers admin: devuelve el payload si hay sesión válida, o null.
 */
export async function getCurrentAdmin(): Promise<AdminTokenPayload | null> {
  const token = await getAdminCookie();
  if (!token) return null;
  return verifyAdminToken(token);
}