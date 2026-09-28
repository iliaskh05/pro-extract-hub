import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isRateLimitedInMemory } from "./rate-limit.server";

describe("isRateLimitedInMemory", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    expect(isRateLimitedInMemory("bucket", "1.2.3.4", 3, 1000)).toBe(false);
    expect(isRateLimitedInMemory("bucket", "1.2.3.4", 3, 1000)).toBe(false);
    expect(isRateLimitedInMemory("bucket", "1.2.3.4", 3, 1000)).toBe(false);
  });

  it("blocks once the limit is reached within the window", () => {
    isRateLimitedInMemory("bucket-2", "1.2.3.4", 2, 1000);
    isRateLimitedInMemory("bucket-2", "1.2.3.4", 2, 1000);
    expect(isRateLimitedInMemory("bucket-2", "1.2.3.4", 2, 1000)).toBe(true);
  });

  it("keeps different keys independent", () => {
    isRateLimitedInMemory("bucket-3", "1.2.3.4", 1, 1000);
    expect(isRateLimitedInMemory("bucket-3", "1.2.3.4", 1, 1000)).toBe(true);
    expect(isRateLimitedInMemory("bucket-3", "5.6.7.8", 1, 1000)).toBe(false);
  });

  it("keeps different buckets independent for the same key", () => {
    isRateLimitedInMemory("bucket-a", "1.2.3.4", 1, 1000);
    expect(isRateLimitedInMemory("bucket-a", "1.2.3.4", 1, 1000)).toBe(true);
    expect(isRateLimitedInMemory("bucket-b", "1.2.3.4", 1, 1000)).toBe(false);
  });

  it("resets once the window elapses", () => {
    isRateLimitedInMemory("bucket-4", "1.2.3.4", 1, 1000);
    expect(isRateLimitedInMemory("bucket-4", "1.2.3.4", 1, 1000)).toBe(true);
    vi.advanceTimersByTime(1001);
    expect(isRateLimitedInMemory("bucket-4", "1.2.3.4", 1, 1000)).toBe(false);
  });
});

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("falls back to the in-memory limiter when the DB check fails", async () => {
    vi.doMock("@/integrations/supabase/client.server", () => ({
      supabaseAdmin: {
        rpc: vi.fn().mockRejectedValue(new Error("network down")),
      },
    }));
    const { isRateLimited } = await import("./rate-limit.server");

    expect(await isRateLimited("bucket-fallback", "9.9.9.9", 1, 1000)).toBe(false);
    expect(await isRateLimited("bucket-fallback", "9.9.9.9", 1, 1000)).toBe(true);
  });

  it("uses the DB result when the check succeeds", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    vi.doMock("@/integrations/supabase/client.server", () => ({
      supabaseAdmin: { rpc },
    }));
    const { isRateLimited } = await import("./rate-limit.server");

    expect(await isRateLimited("bucket-db", "1.1.1.1", 5, 1000)).toBe(true);
    expect(rpc).toHaveBeenCalledWith("check_rate_limit", {
      p_bucket: "bucket-db",
      p_client_key: "1.1.1.1",
      p_max_per_window: 5,
      p_window_seconds: 1,
    });
  });
});
