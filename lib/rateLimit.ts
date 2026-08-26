/**
 * Rate limiter in-memory.
 *
 * Limitación: en Vercel serverless cada instancia tiene su propio Map, así que
 * el conteo es por instancia (no global). Para un MVP de bajo tráfico alcanza;
 * si el endpoint empieza a ser atacado en serio, migrar a Upstash Redis.
 */

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const attempts = new Map<string, AttemptRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec?: number;
}

export function checkRateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record || record.resetAt < now) {
    attempts.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true };
}

export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

// Limpieza periódica para no acumular entradas viejas (serverless / long-lived)
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (record.resetAt < now) attempts.delete(key);
  }
}, 60_000).unref?.();