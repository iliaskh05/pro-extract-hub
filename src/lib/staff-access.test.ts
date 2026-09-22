import { describe, expect, it } from "vitest";
import { isStaffFromLegacyRoles, isStaffFromProfile } from "./staff-access";

describe("isStaffFromProfile (public.staff_profiles)", () => {
  it("grants access for admin", () => {
    expect(isStaffFromProfile({ role: "admin" })).toBe(true);
  });

  it("grants access for commercial", () => {
    expect(isStaffFromProfile({ role: "commercial" })).toBe(true);
  });

  it("denies access for an unknown role", () => {
    expect(isStaffFromProfile({ role: "guest" })).toBe(false);
  });

  it("denies access when there is no row", () => {
    expect(isStaffFromProfile(null)).toBe(false);
    expect(isStaffFromProfile(undefined)).toBe(false);
  });
});

describe("isStaffFromLegacyRoles (public.user_roles)", () => {
  it("grants access when one row is admin", () => {
    expect(isStaffFromLegacyRoles([{ role: "user" }, { role: "admin" }])).toBe(true);
  });

  it("grants access when one row is staff", () => {
    expect(isStaffFromLegacyRoles([{ role: "staff" }])).toBe(true);
  });

  it("denies access for a plain user role", () => {
    expect(isStaffFromLegacyRoles([{ role: "user" }])).toBe(false);
  });

  it("denies access for empty or missing rows", () => {
    expect(isStaffFromLegacyRoles([])).toBe(false);
    expect(isStaffFromLegacyRoles(null)).toBe(false);
    expect(isStaffFromLegacyRoles(undefined)).toBe(false);
  });
});
