"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { serviceDesc, serviceGuideAt, serviceName } from "@/lib/i18n/lookup";
import { groups, serviceGuide, services, waLink, type ServiceId } from "@/lib/site";

type Filter = "all" | keyof typeof groups;

export function ServiceExplorer() {
  const [filter, setFilter] = useState<Filter>("all");
  const c = useCopy();
  const list = services.filter((s) => filter === "all" || s.group === filter);
  const chips: { id: Filter; label: string }[] = [
    { id: "all", label: `${c.services.all} (${services.length})` },
    ...(Object.keys(groups) as (keyof typeof groups)[]).map((g) => ({ id: g, label: `${c.groups[g]} (${services.filter((s) => s.group === g).length})` })),
  ];

  return (
    <div>
      <div role="group" aria-label={c.services.filter} className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            aria-pressed={filter === chip.id}
            onClick={() => setFilter(chip.id)}
            className={`min-h-11 cursor-pointer rounded-full border px-4 text-sm font-bold transition-colors duration-150 ${filter === chip.id ? "border-gold bg-gold text-bg" : "border-line text-muted hover:border-line-strong hover:text-ink"}`}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted" aria-live="polite">
        {c.services.showing(list.length, services.length)}
      </p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const g = serviceGuide[s.id];
          const guide = serviceGuideAt(c, s.id as ServiceId);
          return (
            <article key={s.id} data-service={s.id} data-spotlight className="card card-hover flex flex-col p-6">
              <p className="text-xs font-bold text-gold">{c.groups[s.group]}</p>
              <h3 className="mt-1 text-lg font-bold">{serviceName(c, s.id)}</h3>
              <p className="mt-3 text-sm leading-7 text-muted">{serviceDesc(c, s.id)}</p>
              <details className="group mt-3 rounded-xl border border-line bg-bg/40 px-4">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-bold">
                  {c.services.when}
                  <span className="text-gold transition-transform duration-200 group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <dl className="grid gap-2 pb-4 text-sm leading-7">
                  <dt className="font-bold text-muted">{c.services.needWhen}</dt>
                  <dd>{guide[0]}</dd>
                  <dt className="font-bold text-muted">{c.services.need}</dt>
                  <dd>{guide[1]}</dd>
                  <dt className="font-bold text-muted">{c.services.next}</dt>
                  <dd>{guide[2]}</dd>
                </dl>
              </details>
              <div className="mt-auto grid gap-2 pt-4">
                <Link href={`/planner?goal=${g.goal}`} className="btn btn-ghost text-sm">
                  {c.services.start} <ArrowRight size={16} aria-hidden />
                </Link>
                <a href={waLink(`Hello, I am asking about a path in the Abdelhadi presence concept: ${s.en}`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm font-bold text-gold-strong hover:underline">
                  <MessageCircle size={16} aria-hidden /> {c.services.ask}
                </a>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-6 text-xs leading-6 text-muted">{c.services.note}</p>
    </div>
  );
}
