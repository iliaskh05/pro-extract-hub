import { describe, expect, it } from "vitest";
import { quoteSchema } from "./quote-schema";

const basePayload = {
  business_type: "Restaurant",
  city: "Paris",
  postal_code: "75001",
  duct_present: true,
  motor_present: true,
  contact_name: "Jean Dupont",
  phone: "0612345678",
  email: "jean.dupont@example.fr",
  consent: true,
};

describe("quoteSchema", () => {
  it("accepts a minimal valid payload and fills in defaults", () => {
    const result = quoteSchema.parse(basePayload);
    expect(result.business_type).toBe("Restaurant");
    expect(result.email).toBe("jean.dupont@example.fr");
    expect(result.need_type).toBe("devis_classique");
    expect(result.request_type).toBe("ponctuelle");
    expect(result.uploads).toEqual([]);
  });

  it("rejects a payload without consent", () => {
    expect(() => quoteSchema.parse({ ...basePayload, consent: false })).toThrow();
  });

  it("rejects a payload with an invalid email", () => {
    expect(() => quoteSchema.parse({ ...basePayload, email: "not-an-email" })).toThrow();
  });

  it("rejects a payload with an unknown business type", () => {
    expect(() => quoteSchema.parse({ ...basePayload, business_type: "Casino" })).toThrow();
  });

  it("honeypot field ('website') must stay empty for a legitimate submission", () => {
    expect(() => quoteSchema.parse({ ...basePayload, website: "http://spam.example" })).toThrow();
    expect(quoteSchema.parse(basePayload).website).toBe("");
  });

  it("caps the number of photo uploads", () => {
    const uploads = Array.from({ length: 10 }, (_, i) => ({
      slot: `slot-${i}`,
      name: "photo.jpg",
      type: "image/jpeg" as const,
      size: 1024,
    }));
    expect(() => quoteSchema.parse({ ...basePayload, uploads })).toThrow();
  });
});
