import { describe, expect, it } from "vitest";

import { emptyEnquiry, validateEnquiry } from "@/lib/enquiry";

const valid = {
  name: "Ada Lovelace",
  company: "Analytical Engines Ltd",
  email: "ada@example.com",
  projectType: "web-application",
  goal: "We need a customer portal for our clients.",
  problem: "Right now everything is handled over email and it does not scale.",
  timeline: "3-6-months",
  budget: "25k-50k",
  details: "Please get back to us this week.",
};

describe("validateEnquiry", () => {
  it("accepts a well-formed submission and returns cleaned values", () => {
    const result = validateEnquiry({ ...valid, name: "  Ada   Lovelace  " });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.disposition).toBe("accept");
    expect(result.value.name).toBe("Ada Lovelace");
    expect(result.value.email).toBe("ada@example.com");
  });

  it("treats a filled honeypot as discarded success", () => {
    const result = validateEnquiry({ ...valid, website: "http://spam.example" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.disposition).toBe("discard");
    expect(result.value).toEqual(emptyEnquiry);
  });

  it("rejects a non-object body", () => {
    expect(validateEnquiry(null).ok).toBe(false);
    expect(validateEnquiry("nope").ok).toBe(false);
  });

  it("reports every missing required field", () => {
    const result = validateEnquiry({});
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.name).toBeTruthy();
    expect(result.errors.email).toBeTruthy();
    expect(result.errors.projectType).toBeTruthy();
    expect(result.errors.timeline).toBeTruthy();
    expect(result.errors.budget).toBeTruthy();
  });

  it("rejects an invalid email address", () => {
    const result = validateEnquiry({ ...valid, email: "not-an-email" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.email).toBeTruthy();
  });

  it("rejects option values outside the allowlist", () => {
    const result = validateEnquiry({ ...valid, projectType: "hacked" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.projectType).toBeTruthy();
  });

  it("requires a minimum amount of detail in goal and problem", () => {
    const result = validateEnquiry({ ...valid, goal: "todo" });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.goal).toBeTruthy();
  });

  it("strips control characters and collapses whitespace", () => {
    const result = validateEnquiry({ ...valid, company: "Foo\u0000Bar\t  Ltd" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.company).toBe("Foo Bar Ltd");
  });

  it("caps the length of optional details", () => {
    const result = validateEnquiry({ ...valid, details: "x".repeat(3000) });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors.details).toBeTruthy();
  });
});
