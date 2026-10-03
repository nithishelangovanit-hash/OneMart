/**
 * Cryptographic / pseudorandom idempotency key generator for checkout orders and payment attempts.
 * Prevents double-charging, double-submissions, and duplicate orders.
 */

export function generateIdempotencyKey(prefix = 'req'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomPart}`;
}

export function generateTrackingToken(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let token = 'OM-';
  for (let i = 0; i < 8; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}
