import { SignJWT, jwtVerify } from 'jose';

export const COOKIE_NAME = 'np_admin_token';
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET no está definida. Generá una con: openssl rand -hex 32'
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminTokenPayload {
  adminId: string;
  username: string;
}

export async function signAdminToken(
  adminId: string,
  username: string
): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(adminId)
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SECONDS}s`)
    .sign(getSecret());
}

export async function verifyAdminToken(
  token: string
): Promise<AdminTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.sub !== 'string') return null;
    return {
      adminId: payload.sub,
      username: typeof payload.username === 'string' ? payload.username : '',
    };
  } catch {
    return null;
  }
}