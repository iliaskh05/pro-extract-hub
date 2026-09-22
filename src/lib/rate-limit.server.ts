// Server-only. In-memory, per-instance rate limiter: a reasonable speed bump
// for a single-instance deployment, but each cold start / serverless
// instance / edge isolate has its own memory, so it is not a durable,
// cluster-wide limit. Swap for a shared store (Supabase table, Upstash,
// Cloudflare KV) if abuse becomes a real problem.

const buckets = new Map<string, number[]>();

export async function clientKey(): Promise<string> {
  try {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    return (
      req.headers.get("cf-connecting-ip") ??
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown"
    );
  } catch {
    return "unknown";
  }
}

export function isRateLimited(bucket: string, key: string, maxPerWindow: number, windowMs: number) {
  const bucketKey = `${bucket}:${key}`;
  const now = Date.now();
  const recent = (buckets.get(bucketKey) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= maxPerWindow) {
    buckets.set(bucketKey, recent);
    return true;
  }
  recent.push(now);
  buckets.set(bucketKey, recent);
  return false;
}
