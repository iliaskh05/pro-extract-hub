import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isRateLimited } from "./rate-limit.server";

describe("isRateLimited", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", () => {
    expect(isRateLimited("bucket", "1.2.3.4", 3, 1000)).toBe(false);
    expect(isRateLimited("bucket", "1.2.3.4", 3, 1000)).toBe(false);
    expect(isRateLimited("bucket", "1.2.3.4", 3, 1000)).toBe(false);
  });

  it("blocks once the limit is reached within the window", () => {
    isRateLimited("bucket-2", "1.2.3.4", 2, 1000);
    isRateLimited("bucket-2", "1.2.3.4", 2, 1000);
    expect(isRateLimited("bucket-2", "1.2.3.4", 2, 1000)).toBe(true);
  });

  it("keeps different keys independent", () => {
    isRateLimited("bucket-3", "1.2.3.4", 1, 1000);
    expect(isRateLimited("bucket-3", "1.2.3.4", 1, 1000)).toBe(true);
    expect(isRateLimited("bucket-3", "5.6.7.8", 1, 1000)).toBe(false);
  });

  it("keeps different buckets independent for the same key", () => {
    isRateLimited("bucket-a", "1.2.3.4", 1, 1000);
    expect(isRateLimited("bucket-a", "1.2.3.4", 1, 1000)).toBe(true);
    expect(isRateLimited("bucket-b", "1.2.3.4", 1, 1000)).toBe(false);
  });

  it("resets once the window elapses", () => {
    isRateLimited("bucket-4", "1.2.3.4", 1, 1000);
    expect(isRateLimited("bucket-4", "1.2.3.4", 1, 1000)).toBe(true);
    vi.advanceTimersByTime(1001);
    expect(isRateLimited("bucket-4", "1.2.3.4", 1, 1000)).toBe(false);
  });
});
