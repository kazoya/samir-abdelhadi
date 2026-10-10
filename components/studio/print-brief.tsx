"use client";

import { useCopy } from "@/components/prefs";
import { serviceName } from "@/lib/i18n/lookup";
import { formatDayAr } from "@/lib/planner/dates";
import { answersSummary } from "@/lib/planner/export";
import type { DraftV1, PlanV1 } from "@/lib/planner/types";

export function PrintBrief({ draft, plan, name }: { draft: DraftV1; plan: PlanV1; name: string }) {
  const t = useCopy();
  return (
    <article className="print-brief hidden print:block">
      <p className="pb-note">{t.disclaimer}</p>
      <h1>Presence brief, 30 days</h1>
      {name.trim() && <p>Name: {name.trim()}</p>}
      <ul>
        {answersSummary(draft).map((l) => (
          <li key={l}>{l}</li>
        ))}
        <li>
          {t.studio.planStart}: {formatDayAr(draft.startDate)}
        </li>
      </ul>
      <h2>First recommendations (fixed rules, not an AI analysis)</h2>
      <ol>
        {plan.recommendations.map((r) => (
          <li key={r.serviceId}>
            <b>
              {serviceName(t, r.serviceId)}
              {r.tier === "optional" ? ` ${t.optional}` : ""}
            </b>
            : {r.reasons.join(" ")}
          </li>
        ))}
      </ol>
      <h2>30-day plan</h2>
      {([1, 2, 3, 4] as const).map((ph) => (
        <section key={ph}>
          <h3>{t.phases[ph]}</h3>
          <ul>
            {draft.tasks
              .filter((task) => task.phase === ph)
              .map((task) => (
                <li key={task.id}>
                  {task.done ? "☑ " : "☐ "}
                  {task.title}
                  {task.owner && ` — ${t.studio.owner}: ${task.owner}`}
                  {task.metric && ` — ${t.studio.measure}: ${task.metric}`}
                </li>
              ))}
          </ul>
        </section>
      ))}
      <h2>Content calendar</h2>
      <table>
        <thead>
          <tr>
            <th>{t.studio.day}</th>
            <th>{t.studio.channel}</th>
            <th>{t.studio.idea}</th>
            <th>{t.studio.status}</th>
          </tr>
        </thead>
        <tbody>
          {[...draft.posts]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((p) => (
              <tr key={p.id}>
                <td>{formatDayAr(p.date)}</td>
                <td>{t.postChannels[p.channel]}</td>
                <td>{p.idea}</td>
                <td>{t.statuses[p.status]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="pb-note">No prices and no promises of results. Later publishing is approved by a person.</p>
    </article>
  );
}
