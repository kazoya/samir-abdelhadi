"use client";

import { GraduationCap, MessageCircle } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { serviceName } from "@/lib/i18n/lookup";
import { services, SKILLS_REPO, trainingPaths, waLink } from "@/lib/site";

export function TrainingView() {
  const c = useCopy();
  return (
    <>
      <PageHead kicker={c.training.kicker} title={c.training.title}>
        <p>
          {c.home.meta} {c.training.lead}
        </p>
      </PageHead>
      <section aria-labelledby="paths">
        <h2 id="paths" className="text-xl font-bold">
          {c.training.three}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          {c.training.from}{" "}
          <a className="underline" href={SKILLS_REPO}>
            marketingskills
          </a>{" "}
          {c.training.ghinaNote}
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          {trainingPaths.map((p, i) => (
            <article key={p.id} data-path={p.id} className="card flex flex-col p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-gold-soft">
                <GraduationCap className="text-gold-strong" size={22} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{c.training.paths[i][0]}</h3>
              <p className="mt-1 text-sm text-muted">{c.training.paths[i][1]}</p>
              <ul className="mt-4 grid gap-1.5 text-sm leading-7">
                {p.trainingIdx.map((t) => (
                  <li key={t}>{c.training.items[t]}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm">{p.serviceIds.map((id) => serviceName(c, id)).join(c.listSep)}</p>
              <a href={waLink(`Hello, I am reviewing the path “${p.title}” in the Abdelhadi presence concept.`)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-5 text-sm">
                <MessageCircle size={16} aria-hidden /> {c.training.review}
              </a>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="delivered" className="mt-14">
        <h2 id="delivered" className="text-xl font-bold">
          {c.training.rules}
        </h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {c.training.items.map((t, i) => (
            <li key={i} className="card flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold-strong">{i + 1}</span>
              <span className="pt-2 leading-7">{t}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-gold/40 bg-gold-soft p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold">{c.training.applyTitle}</p>
          <p className="mt-1 text-sm text-muted">{c.training.applyBody}</p>
        </div>
        <CtaLink href={waLink("Hello, I want to review the Abdelhadi presence method on one specific piece.")}>{c.training.applyCta}</CtaLink>
      </section>
      <Source page={c.training.sourceLine} href={SKILLS_REPO} />
    </>
  );
}
