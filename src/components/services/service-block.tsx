import Link from "next/link";
import { Container } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { MarkerList, Module, ModuleLabel, NodeDot, StepList } from "@/components/ui/module";
import type { Service } from "@/content/services";

export function ServiceBlock({
  service,
  flip = false,
  location,
}: {
  service: Service;
  flip?: boolean;
  location: string;
}) {
  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-heading`}
      className="scroll-mt-24 border-t border-line py-16 sm:py-20 lg:scroll-mt-28 lg:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
          {/* Left: identity, promise and direct CTA. */}
          <Reveal className={flip ? "lg:order-2" : undefined}>
            <div className="flex items-center justify-between gap-4">
              <p className="label-mono flex items-center gap-3 text-indigo">
                <span aria-hidden="true" className="h-px w-6 bg-indigo/60" />
                {service.index}
              </p>
              <NodeDot tone="indigo" />
            </div>

            <h2
              id={`${service.slug}-heading`}
              className="mt-6 font-display text-display text-bone"
            >
              {service.name}
            </h2>
            <p className="mt-4 text-lead text-muted-strong">{service.summary}</p>

            <div className="mt-8 border-l-2 border-indigo/60 pl-5">
              <p className="text-[0.9375rem] leading-relaxed text-bone">{service.promise}</p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href={`/contact?type=${service.contactQueryType}`}
                location={`${location}_${service.slug}`}
                variant="primary"
                size="md"
              >
                Discuss {service.name.toLowerCase()}
              </ButtonLink>
              <ButtonLink
                href="/process"
                location={`${location}_${service.slug}_process`}
                variant="outline"
                size="md"
              >
                See our process
              </ButtonLink>
            </div>

            <nav aria-label="Related services" className="mt-10 border-t border-line pt-7">
              <ModuleLabel>The other two disciplines</ModuleLabel>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {service.related.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="group/rel inline-flex min-h-11 items-center gap-2 rounded-sm py-2.5 text-[0.9375rem] text-muted-strong transition-colors duration-200 hover:text-indigo"
                    >
                      <span
                        aria-hidden="true"
                        className="h-px w-0 bg-indigo transition-all duration-300 ease-[var(--ease-precision)] group-hover/rel:w-3"
                      />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Right: detail panels. */}
          <div className={flip ? "lg:order-1" : undefined}>
            <Reveal delay={70}>
              <Module className="p-7 sm:p-8" interactive={false} texture="fine">
                {/* Per-service edge filament. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-indigo opacity-80"
                />
                <ModuleLabel>Overview</ModuleLabel>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-muted-strong">
                  {service.intro}
                </p>
              </Module>
            </Reveal>

            {/* Who it's for */}
            <div className="mt-6">
              <Reveal delay={90}>
                <Module className="p-7 sm:p-8" interactive={false}>
                  <ModuleLabel>Who this is for</ModuleLabel>
                  <MarkerList className="mt-5" tone="indigo" items={service.whoItsFor} />
                </Module>
              </Reveal>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Reveal delay={110} className="flex">
                <Module className="w-full p-7" interactive={false}>
                  <ModuleLabel>What we build</ModuleLabel>
                  <MarkerList className="mt-5" tone={service.slug === "web" ? "indigo" : "violet"} items={service.capabilities} />
                </Module>
              </Reveal>

              <Reveal delay={150} className="flex">
                <Module className="w-full p-7" interactive={false}>
                  <ModuleLabel>Problems it addresses</ModuleLabel>
                  <MarkerList className="mt-5" tone={service.slug === "web" ? "indigo" : "violet"} items={service.problems} />
                </Module>
              </Reveal>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Reveal delay={180}>
                <Module className="p-7" interactive={false}>
                  <ModuleLabel>What changes</ModuleLabel>
                  <MarkerList className="mt-5" tone="muted" items={service.outcomes} />
                </Module>
              </Reveal>

              <Reveal delay={210}>
                <Module className="p-7" interactive={false}>
                  <div className="flex items-center justify-between">
                    <ModuleLabel>Representative scenarios</ModuleLabel>
                    <span className="font-mono text-[10px] text-muted">Example models</span>
                  </div>
                  <StepList
                    className="mt-5"
                    items={service.examples.map((e) => `${e.title} — ${e.detail}`)}
                  />
                </Module>
              </Reveal>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
