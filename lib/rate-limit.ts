/**
 * Simple in-memory IP rate limiter.
 * Works within a single server instance (sufficient for Vercel serverless warm pool).
 * For multi-instance deployments, replace with Redis/Upstash.
 */

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

/**
 * Returns true if the request is allowed, false if it should be blocked.
 * @param ip       Client IP address
 * @param limit    Maximum requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/** Extract the real client IP from a Next.js request. */
export function getClientIp(req: Request): string {
  return (
    (req.headers as Headers).get("x-forwarded-for")?.split(",")[0].trim() ??
    "unknown"
  );
}
