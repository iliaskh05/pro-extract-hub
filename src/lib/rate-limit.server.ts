// Server-only rate limiter, backed by a Postgres table so limits hold across
// serverless instances / cold starts (see
// supabase/migrations/20260927120000_add_rate_limit_table.sql), not just
// within one process. Falls back to an in-memory, per-instance bucket only
// when the DB check itself fails (e.g. transient outage), so a hiccup there
// degrades to the old best-effort behavior instead of blocking submissions.

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const buckets = new Map<string, number[]>();

// This migration may not yet exist on the connected database. Keep its narrow
// RPC contract here without changing generated types; failures still use the
// existing in-memory fallback below.
const checkRateLimit = supabaseAdmin.rpc.bind(supabaseAdmin) as unknown as (
  name: "check_rate_limit",
  args: {
    p_bucket: string;
    p_client_key: string;
    p_max_per_window: number;
    p_window_seconds: number;
  },
) => PromiseLike<{ data: boolean | null; error: { message: string } | null }>;

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

export function isRateLimitedInMemory(
  bucket: string,
  key: string,
  maxPerWindow: number,
  windowMs: number,
) {
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

export async function isRateLimited(
  bucket: string,
  key: string,
  maxPerWindow: number,
  windowMs: number,
): Promise<boolean> {
  try {
    const { data, error } = await checkRateLimit("check_rate_limit", {
      p_bucket: bucket,
      p_client_key: key,
      p_max_per_window: maxPerWindow,
      p_window_seconds: Math.ceil(windowMs / 1000),
    });
    if (error) throw error;
    return Boolean(data);
  } catch (err) {
    console.error(
      `[rate-limit] DB check failed for bucket "${bucket}", using in-memory fallback:`,
      err,
    );
    return isRateLimitedInMemory(bucket, key, maxPerWindow, windowMs);
  }
}
