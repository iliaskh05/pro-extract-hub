import { describe, expect, it } from "vitest";
import {
  parseEmail,
  parseFilterCount,
  parseMeterage,
  parsePhone,
  parsePostalCode,
} from "./quote-validation";

describe("parseMeterage", () => {
  it("accepts an empty value", () => {
    expect(parseMeterage("")).toEqual({ ok: true, value: "" });
  });

  it("accepts an integer", () => {
    expect(parseMeterage("3")).toEqual({ ok: true, value: "3" });
  });

  it("normalizes a comma decimal to a dot", () => {
    expect(parseMeterage("3,5")).toEqual({ ok: true, value: "3.5" });
  });

  it("rejects a value with a unit", () => {
    expect(parseMeterage("3m").ok).toBe(false);
  });

  it("rejects a value above the max", () => {
    expect(parseMeterage("101").ok).toBe(false);
  });

  it("rejects zero or negative values", () => {
    expect(parseMeterage("0").ok).toBe(false);
  });
});

describe("parseFilterCount", () => {
  it("accepts an empty value", () => {
    expect(parseFilterCount("")).toEqual({ ok: true, value: "" });
  });

  it("accepts a valid integer", () => {
    expect(parseFilterCount("6")).toEqual({ ok: true, value: "6" });
  });

  it("rejects a non-integer", () => {
    expect(parseFilterCount("6.5").ok).toBe(false);
  });

  it("rejects a value above the max", () => {
    expect(parseFilterCount("201").ok).toBe(false);
  });
});

describe("parseEmail", () => {
  it("accepts and lowercases a valid email", () => {
    expect(parseEmail("Contact@Entreprise.fr")).toEqual({
      ok: true,
      value: "contact@entreprise.fr",
    });
  });

  it("rejects an empty value", () => {
    expect(parseEmail("").ok).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(parseEmail("not-an-email").ok).toBe(false);
  });
});

describe("parsePhone", () => {
  it("accepts a French mobile number", () => {
    expect(parsePhone("0612345678").ok).toBe(true);
  });

  it("accepts a +33 international number", () => {
    expect(parsePhone("+33612345678").ok).toBe(true);
  });

  it("rejects a too-short number", () => {
    expect(parsePhone("0612").ok).toBe(false);
  });

  it("rejects letters", () => {
    expect(parsePhone("abcdefghij").ok).toBe(false);
  });
});

describe("parsePostalCode", () => {
  it("accepts an empty value", () => {
    expect(parsePostalCode("")).toEqual({ ok: true, value: "" });
  });

  it("accepts a 5-digit code", () => {
    expect(parsePostalCode("75001")).toEqual({ ok: true, value: "75001" });
  });

  it("rejects a code with the wrong length", () => {
    expect(parsePostalCode("750").ok).toBe(false);
  });

  it("rejects a non-numeric code", () => {
    expect(parsePostalCode("ABCDE").ok).toBe(false);
  });
});
