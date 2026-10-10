"use client";

import { FileText, Globe2, Inbox, ScanSearch } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { PageHead } from "@/components/ui";

const icons = [Inbox, Globe2, FileText, ScanSearch];

export function OpportunitiesView() {
  const c = useCopy();
  return (
    <>
      <PageHead kicker={c.nextPage.kicker} title={c.nextPage.title}>
        <p>{c.nextPage.lead}</p>
      </PageHead>
      <div className="grid gap-4 md:grid-cols-2">
        {c.nextPage.items.map((it, i) => {
          const Icon = icons[i];
          return (
            <article key={it[0]} className="card p-6">
              <Icon className="text-gold" size={26} aria-hidden />
              <h2 className="mt-3 text-lg font-bold">{it[0]}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {c.nextPage.now}: {it[1]}
              </p>
              <p className="mt-2 text-sm leading-7">
                {c.nextPage.next}: {it[2]}
              </p>
              <p className="mt-3 text-sm font-bold text-gold-strong">{it[3]}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
