"use client";

import { ExternalLink } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { PageHead, Source } from "@/components/ui";
import { activities, relationships, ZAD } from "@/lib/site";

export function ActivitiesView() {
  const c = useCopy();
  return (
    <>
      <PageHead kicker={c.activities.kicker} title={c.activities.title}>
        <p>{c.activities.lead}</p>
      </PageHead>
      <div className="grid gap-12">
        {relationships.map((rel) => {
          const items = activities.map((a, i) => ({ ...a, i })).filter((a) => a.relationship === rel);
          return (
            <section key={rel} aria-labelledby={`rel-${rel}`}>
              <h2 id={`rel-${rel}`} className="flex items-center gap-3 text-xl font-bold">
                <span className="h-6 w-1 rounded-full bg-gold" aria-hidden />
                {c.activities.relTitle[rel]}
                <span className="rounded-full border border-line px-2 text-sm font-normal text-muted">{items.length}</span>
              </h2>
              <p className="mt-2 text-sm text-muted">{c.activities.rel[rel]}</p>
              <ul className="mt-4 grid gap-3">
                {items.map((a) => (
                  <li key={a.i} className="card grid gap-3 p-5 leading-8">
                    <span>{c.activities.texts[a.i]}</span>
                    <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 text-xs text-muted underline-offset-4 hover:text-gold-strong hover:underline">
                      {c.activities.source} <ExternalLink size={12} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <section aria-labelledby="story" className="mt-16">
        <h2 id="story" className="text-xl font-bold">
          {c.activities.storyTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">{c.activities.storyLead}</p>
        <div className="card mt-5 p-6" data-illustrative>
          <p className="mb-4 inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">{c.activities.illustrative}</p>
          <dl className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            {c.activities.story.map((s) => (
              <div key={s[0]} className="contents">
                <dt className="font-bold text-gold-strong">{s[0]}</dt>
                <dd className="leading-7 text-muted">{s[1]}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Source page={c.activities.sourceLine} href={ZAD} />
    </>
  );
}
