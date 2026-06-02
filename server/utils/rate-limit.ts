import { getRequestIP } from 'h3'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 20

interface RateLimitBucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, RateLimitBucket>()

export function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }

  if (bucket.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  bucket.count += 1
  return true
}

export function getClientIp(event: Parameters<typeof getRequestIP>[0]): string {
  return getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
}