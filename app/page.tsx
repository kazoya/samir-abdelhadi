"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, ScrollText } from "lucide-react";
import { CtaLink } from "@/components/ui";
import { useCopy } from "@/components/prefs";
import { HeroParticles } from "@/components/hero-particles";
import { serviceName } from "@/lib/i18n/lookup";
import { buildPlan } from "@/lib/planner/rules";
import type { AnswersV1 } from "@/lib/planner/types";
import { activities, brand, GHINA_ENGINE, groups, services, SKILLS_REPO, waLink } from "@/lib/site";

const sampleAnswers: AnswersV1 = { schemaVersion: 1, businessId: "personal", goalId: "identity", channelIds: ["linkedin"], teamId: "one", timelineId: "month" };
const sample = buildPlan(sampleAnswers);

export default function Home() {
  const c = useCopy();
  const sampleLine = [c.business[sampleAnswers.businessId], c.goals[sampleAnswers.goalId], `${c.channelWord}: ${c.channels.linkedin}`, c.team[sampleAnswers.teamId]].join(c.listSep);
  const leadAt = c.home.lead.indexOf(c.home.ghina);
  return (
    <>
      <section className="grain relative -mx-4 -mt-8 overflow-hidden rounded-b-[2.5rem] border-b border-line px-4 pb-16 pt-10 md:pt-14">
        <HeroParticles />
        <div className="relative grid items-start gap-10 md:grid-cols-[1.25fr_0.85fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bg/60 px-3 py-1 text-xs font-bold text-gold-strong backdrop-blur">{c.home.kicker}</p>
            <h1 className="rise rise-2 mt-5 text-4xl font-bold leading-[1.15] md:text-6xl">
              {brand.lead}
              <span className="mt-3 block text-2xl font-bold text-gold-strong md:text-3xl">{c.home.sub}</span>
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-lg leading-8 text-muted">
              {c.home.experience}.{" "}
              {leadAt < 0 ? (
                c.home.lead
              ) : (
                <>
                  {c.home.lead.slice(0, leadAt)}
                  <a className="underline decoration-gold underline-offset-4" href={GHINA_ENGINE}>
                    {c.home.ghina}
                  </a>
                  {c.home.lead.slice(leadAt + c.home.ghina.length)}
                </>
              )}
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <CtaLink href="/planner">
                {c.home.open} <ArrowRight size={18} aria-hidden />
              </CtaLink>
              <CtaLink href="/activities" ghost>
                {c.home.read}
              </CtaLink>
            </div>
          </div>
          <figure className="rise rise-2 mx-auto w-full max-w-sm">
            <Image src="/samir-portrait.png" alt={c.home.portraitAlt} width={900} height={900} priority className="w-full" />
            <figcaption className="mt-3 text-sm leading-7 text-muted">{c.home.meta}</figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-[1.4fr_1fr]" aria-labelledby="gates">
        <Link href="/planner?goal=leads" data-gate="leads" className="card card-hover flex min-h-48 flex-col justify-between p-7">
          <div>
            <p className="text-sm font-bold text-gold-strong">{c.home.start}</p>
            <h2 id="gates" className="mt-2 text-3xl font-bold">
              {c.home.startTitle}
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted">{c.home.startBody}</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-gold-strong">
            {c.home.studio} <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
        <div className="grid gap-4">
          <Link href="/activities" className="card card-hover p-5">
            <ScrollText className="text-gold" size={22} aria-hidden />
            <p className="mt-3 font-bold">
              {c.home.record}: {activities.length} {c.home.sourced}
            </p>
            <p className="mt-1 text-sm text-muted">{c.home.recordSources}</p>
          </Link>
          <Link href="/training" className="card card-hover p-5">
            <Quote className="text-gold" size={22} aria-hidden />
            <p className="mt-3 font-bold">{c.home.method}</p>
            <p className="mt-1 text-sm text-muted">{c.home.methodBlurb}</p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="sample" className="mt-20" data-reveal>
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
            <div>
              <p className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">{c.home.sample}</p>
              <h2 id="sample" className="mt-3 text-2xl font-bold">
                {c.home.sampleTitle}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {c.home.sampleFor}: {sampleLine}. {c.home.sampleRest}
              </p>
              <div className="mt-6">
                <CtaLink href="/planner">{c.home.try}</CtaLink>
              </div>
            </div>
            <ol className="grid gap-3">
              {sample.recommendations.map((r) => (
                <li key={r.serviceId} className="rounded-2xl border border-line bg-bg/40 p-4">
                  <p className="flex items-center gap-2 font-bold">
                    <span className="grid size-7 place-items-center rounded-full bg-gold-soft text-xs text-gold-strong">{r.rank}</span>
                    {serviceName(c, r.serviceId)}
                    {r.tier === "optional" && <span className="text-xs font-normal text-muted">{c.optional}</span>}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">{r.reasons[0]}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="founder" className="mt-20 scroll-mt-24" aria-labelledby="founder-title">
        <p className="text-sm font-bold text-gold">{c.home.founder}</p>
        <h2 id="founder-title" className="mt-2 text-3xl font-bold">
          {brand.lead}
        </h2>
        <ul className="mt-6 grid gap-3 leading-8 md:grid-cols-2">
          {c.home.specialties.map((t) => (
            <li key={t} className="card p-5">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-muted">{c.home.vision}</p>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">{c.home.pathsTitle}</h2>
          <Link href="/services" className="inline-flex min-h-11 items-center text-sm font-bold text-gold-strong hover:underline">
            {c.home.allPaths}
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
            <div key={g} className="card p-6">
              <p className="font-bold text-gold-strong">{c.groups[g]}</p>
              <ul className="mt-3 grid gap-2 text-sm">
                {services
                  .filter((s) => s.group === g)
                  .map((s) => (
                    <li key={s.id}>{serviceName(c, s.id)}</li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          {c.home.creditBefore}{" "}
          <a className="underline" href={SKILLS_REPO}>
            marketingskills
          </a>{" "}
          {c.home.creditMid}{" "}
          <a className="underline" href={GHINA_ENGINE}>
            ghina-media-concept
          </a>
          .
        </p>
      </section>

      <section className="relative mt-20 overflow-hidden rounded-3xl bg-gold p-8 text-bg md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">{c.home.waTitle}</h2>
        <p className="mt-3 max-w-2xl leading-8">{c.home.waBody}</p>
        <div className="mt-6">
          <a href={waLink("Hello, I saw the presence concept and would like to review it.")} target="_blank" rel="noopener noreferrer" className="btn bg-bg text-gold-strong hover:bg-raised">
            {c.home.waCta}
          </a>
        </div>
      </section>
    </>
  );
}
