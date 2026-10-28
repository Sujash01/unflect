import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/content/services";
import { caseStudies } from "@/content/case-studies";
import { site } from "@/content/site";

describe("SEO - Metadata Generation & Canonicals", () => {
  it("generates an absolute homepage title without duplicating brand template", () => {
    const meta = pageMetadata({
      title: "Business Automation & Systems Integration | UNFLECT",
      description: "Business automation and systems integration company.",
      path: "/",
    });

    expect(meta.title).toEqual({
      absolute: "Business Automation & Systems Integration | UNFLECT",
    });
    expect(meta.alternates?.canonical).toBe(site.url);
    expect(meta.openGraph?.url).toBe(site.url);
  });

  it("generates absolute canonical URLs for sub-pages", () => {
    const meta = pageMetadata({
      title: "Business Automation & Systems Integration Services | UNFLECT",
      description: "Services overview.",
      path: "/services",
    });

    expect(meta.title).toBe("Business Automation & Systems Integration Services | UNFLECT");
    expect(meta.alternates?.canonical).toBe(`${site.url}/services`);
    expect(meta.openGraph?.url).toBe(`${site.url}/services`);
  });

  it("populates OpenGraph and Twitter cards correctly", () => {
    const meta = pageMetadata({
      title: "WhatsApp Business Automation & Appointment Booking Workflows",
      description: "WhatsApp automation services description.",
      path: "/services/whatsapp-automation",
    });

    const og = meta.openGraph as Record<string, unknown> | undefined;
    const tw = meta.twitter as Record<string, unknown> | undefined;

    expect(og?.type).toBe("website");
    expect(og?.title).toBe("WhatsApp Business Automation & Appointment Booking Workflows");
    expect(tw?.card).toBe("summary_large_image");
  });
});

describe("SEO - Sitemap Route Coverage", () => {
  const generatedSitemap = sitemap();
  const urls = generatedSitemap.map((entry) => entry.url);

  it("includes all primary public marketing pages", () => {
    expect(urls).toContain(site.url);
    expect(urls).toContain(`${site.url}/services`);
    expect(urls).toContain(`${site.url}/services/other-services`);
    expect(urls).toContain(`${site.url}/work`);
    expect(urls).toContain(`${site.url}/process`);
    expect(urls).toContain(`${site.url}/about`);
    expect(urls).toContain(`${site.url}/contact`);
  });

  it("includes all dynamic service routes", () => {
    services.forEach((service) => {
      expect(urls).toContain(`${site.url}/services/${service.slug}`);
    });
  });

  it("includes published case studies but excludes unreleased coming_soon work", () => {
    expect(urls).toContain(`${site.url}/work/paperplane`);
    expect(urls).toContain(`${site.url}/work/dataforge`);

    const comingSoonSlugs = caseStudies
      .filter((s) => s.status === "coming_soon")
      .map((s) => s.slug);

    comingSoonSlugs.forEach((slug) => {
      expect(urls).not.toContain(`${site.url}/work/${slug}`);
    });
  });

  it("never includes private, account, admin, or API routes in the sitemap", () => {
    const sensitivePatterns = ["/admin", "/account", "/login", "/signup", "/api/", "/profile", "/settings"];

    urls.forEach((url) => {
      sensitivePatterns.forEach((pattern) => {
        expect(url).not.toContain(pattern);
      });
    });
  });
});

describe("SEO - Robots.txt Directives", () => {
  const robotsConfig = robots();

  it("allows root indexing and specifies sitemap location", () => {
    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;

    expect(rules?.allow).toBe("/");
    expect(robotsConfig.sitemap).toBe(`${site.url}/sitemap.xml`);
  });

  it("disallows administrative and sensitive account endpoints", () => {
    const rules = Array.isArray(robotsConfig.rules)
      ? robotsConfig.rules[0]
      : robotsConfig.rules;

    const disallowList = Array.isArray(rules?.disallow)
      ? rules?.disallow
      : [rules?.disallow];

    expect(disallowList).toContain("/admin");
    expect(disallowList).toContain("/account");
    expect(disallowList).toContain("/api/");
    expect(disallowList).toContain("/login");
  });
});

describe("SEO - Service Distinctness and Search Intent", () => {
  it("ensures each service has distinct, unique non-branded SEO titles and descriptions", () => {
    const titles = services.map((s) => s.seo.title);
    const descriptions = services.map((s) => s.seo.description);

    const uniqueTitles = new Set(titles);
    const uniqueDescriptions = new Set(descriptions);

    expect(uniqueTitles.size).toBe(services.length);
    expect(uniqueDescriptions.size).toBe(services.length);
  });

  it("verifies targeted non-branded keywords are present in service SEO titles", () => {
    const businessAuto = services.find((s) => s.slug === "business-automation");
    const whatsapp = services.find((s) => s.slug === "whatsapp-automation");
    const systemsInt = services.find((s) => s.slug === "systems-integration");
    const aiWorkflows = services.find((s) => s.slug === "ai-workflows");

    expect(businessAuto?.seo.title.toLowerCase()).toContain("business automation");
    expect(whatsapp?.seo.title.toLowerCase()).toContain("whatsapp");
    expect(systemsInt?.seo.title.toLowerCase()).toContain("systems integration");
    expect(aiWorkflows?.seo.title.toLowerCase()).toContain("ai");
  });
});
