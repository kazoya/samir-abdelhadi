"use client";

import { Check, CircleDashed, Info } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { serviceName } from "@/lib/i18n/lookup";
import { services } from "@/lib/site";
import { RULE_VERSION } from "@/lib/planner/rules";
import type { PlanV1 } from "@/lib/planner/types";

const svc = (id: string) => services.find((s) => s.id === id);

export function Recommendations({ plan, onEdit }: { plan: PlanV1; onEdit: () => void }) {
  const t = useCopy();
  const done = plan.checklist.filter((c) => c.ok).length;
  const core = plan.recommendations.filter((r) => r.tier === "core").length;
  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="grid content-start gap-4">
        <p className="rounded-2xl border border-line bg-bg/40 px-4 py-3 text-xs leading-6 text-muted">{t.studio.recsIntro(RULE_VERSION, core)}</p>
        <ol className="grid gap-4">
          {plan.recommendations.map((r) => {
            const s = svc(r.serviceId)!;
            return (
              <li key={r.serviceId} data-rec={r.serviceId} className="card p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold-strong">{r.rank}</span>
                  <h3 className="text-lg font-bold">{serviceName(t, r.serviceId)}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.tier === "core" ? "bg-gold text-bg" : "border border-line text-muted"}`}>
                    {r.tier === "core" ? t.studio.core : t.studio.optionalWord}
                  </span>
                </div>
                {serviceName(t, r.serviceId) !== s.en && (
                  <p className="mt-1 text-xs text-muted" dir="ltr">
                    {s.en}
                  </p>
                )}
                <p className="mt-4 text-sm font-bold">{t.studio.why}</p>
                <ul className="mt-2 grid gap-2 text-sm leading-7">
                  {r.reasons.map((why, i) => (
                    <li key={r.reasonCodes[i]} className="flex gap-2" data-reason={r.reasonCodes[i]}>
                      <Check size={16} className="mt-1.5 shrink-0 text-ok" aria-hidden />
                      {why}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-bold text-muted">{t.studio.needToStart}</p>
                    <ul className="mt-1 list-inside list-disc leading-7 text-muted marker:text-gold">
                      {r.prerequisites.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-muted">{t.studio.concrete}</p>
                    <p className="mt-1 leading-7">{r.deliverable}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        <details className="card group p-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 font-bold">
            {t.studio.whyNot}
            <span className="text-gold transition-transform group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-muted">
            {plan.notChosen.map((n) => (
              <li key={n.serviceId}>
                <b className="text-ink">{serviceName(t, n.serviceId)}:</b> {n.why}
              </li>
            ))}
          </ul>
        </details>
      </div>

      <aside className="grid content-start gap-4">
        <div className="card p-5">
          <p className="font-bold">
            {t.studio.readiness(done, plan.checklist.length)}
          </p>
          <p className="mt-1 text-xs text-muted">{t.studio.readinessNote}</p>
          <ul className="mt-3 grid gap-2 text-sm">
            {plan.checklist.map((c) => (
              <li key={c.code} className="flex items-center gap-2">
                {c.ok ? <Check size={16} className="text-ok" aria-hidden /> : <CircleDashed size={16} className="text-muted" aria-hidden />}
                <span className={c.ok ? "" : "text-muted"}>{c.label}</span>
                <span className="sr-only">{c.ok ? t.studio.present : t.studio.missing}</span>
              </li>
            ))}
          </ul>
        </div>
        {plan.gaps.length > 0 && (
          <div className="card p-5">
            <p className="font-bold">{t.studio.discuss}</p>
            <ul className="mt-3 grid gap-2 text-sm leading-7 text-muted">
              {plan.gaps.map((g) => (
                <li key={g.code} className="flex gap-2" data-gap={g.code}>
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                  <span>
                    {g.text}
                    {g.linkedServiceId && <span className="text-gold-strong"> → {serviceName(t, g.linkedServiceId)}</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="rounded-2xl border border-line p-5 text-xs leading-6 text-muted">
          <p className="mb-2 flex items-center gap-2 font-bold text-ink">
            <Info size={14} aria-hidden /> {t.studio.assumptions}
          </p>
          <ul className="grid gap-1">
            {plan.assumptions.map((x) => (
              <li key={x}>• {x}</li>
            ))}
          </ul>
        </div>
        <button type="button" onClick={onEdit} className="btn btn-ghost">
          {t.studio.editAnswers}
        </button>
      </aside>
    </div>
  );
}
