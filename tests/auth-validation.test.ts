import { describe, expect, it } from "vitest";

import {
  cleanText,
  normalizeEmail,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/auth/validation";

describe("validateEmail", () => {
  it("accepts a normal address", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("normalizes case and whitespace", () => {
    expect(normalizeEmail("  User@Example.COM ")).toBe("user@example.com");
  });

  it("rejects malformed addresses", () => {
    expect(validateEmail("nope")).toBeTruthy();
    expect(validateEmail("a@b")).toBeTruthy();
    expect(validateEmail("")).toBeTruthy();
  });

  it("rejects disposable domains", () => {
    expect(validateEmail("throwaway@mailinator.com")).toBeTruthy();
  });

  it("rejects over-long addresses", () => {
    expect(validateEmail(`${"a".repeat(250)}@example.com`)).toBeTruthy();
  });
});

describe("validatePassword", () => {
  it("accepts a strong password", () => {
    expect(validatePassword("Str0ng!pass")).toBeNull();
  });

  it("enforces each character class", () => {
    expect(validatePassword("Sh0rt!")).toBeTruthy();
    expect(validatePassword("alllowercase1!")).toBeTruthy();
    expect(validatePassword("ALLUPPERCASE1!")).toBeTruthy();
    expect(validatePassword("NoNumbers!!")).toBeTruthy();
    expect(validatePassword("NoSpecials1")).toBeTruthy();
  });

  it("rejects non-strings and over-long values", () => {
    expect(validatePassword(12345678)).toBeTruthy();
    expect(validatePassword(`Aa1!${"x".repeat(80)}`)).toBeTruthy();
  });
});

describe("validateName and cleanText", () => {
  it("trims and bounds names", () => {
    expect(validateName("  Ada  ")).toBeNull();
    expect(validateName("   ")).toBeTruthy();
    expect(validateName("x".repeat(101))).toBeTruthy();
  });

  it("cleans control characters and truncates to the limit", () => {
    expect(cleanText("a\u0000b\t c", 100)).toBe("a b c");
    expect(cleanText("abcdef", 3)).toBe("abc");
    expect(cleanText(42, 10)).toBe("");
  });
});
