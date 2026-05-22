// In-memory rate limiter (per-process; sufficient for single-instance deployments)
const store = new Map<string, { count: number; resetAt: number }>();

/**
 * Returns true if the request is allowed, false if the rate limit is exceeded.
 * @param key      Unique identifier (e.g. IP + action)
 * @param max      Max requests per window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= max) return false;
  entry.count++;
  return true;
}
