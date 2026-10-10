import { services } from "@/lib/site";
import { formatDayAr } from "@/lib/planner/dates";
import { phaseLabel, postChannelLabel, postStatusLabel } from "@/lib/planner/dict";
import { answersSummary } from "@/lib/planner/export";
import type { DraftV1, PlanV1 } from "@/lib/planner/types";

// نسخة الطباعة فقط (مخفية على الشاشة). بلا أزرار أو مؤثرات؛ يحفظها الزائر PDF من نافذة الطباعة.
export function PrintBrief({ draft, plan, name }: { draft: DraftV1; plan: PlanV1; name: string }) {
  const svc = (id: string) => services.find((s) => s.id === id)?.en ?? id;
  return (
    <article className="print-brief hidden print:block">
      <p className="pb-note">Independent concept. Not an official site.</p>
      <h1>Presence brief, 30 days</h1>
      {name.trim() && <p>Name: {name.trim()}</p>}
      <ul>
        {answersSummary(draft).map((l) => (
          <li key={l}>{l}</li>
        ))}
        <li>Plan start: {formatDayAr(draft.startDate)}</li>
      </ul>
      <h2>First recommendations (fixed rules, not an AI analysis)</h2>
      <ol>
        {plan.recommendations.map((r) => (
          <li key={r.serviceId}>
            <b>
              {svc(r.serviceId)}
              {r.tier === "optional" ? " (optional)" : ""}
            </b>
            : {r.reasons.join(" ")}
          </li>
        ))}
      </ol>
      <h2>30-day plan</h2>
      {([1, 2, 3, 4] as const).map((ph) => (
        <section key={ph}>
          <h3>{phaseLabel[ph]}</h3>
          <ul>
            {draft.tasks
              .filter((t) => t.phase === ph)
              .map((t) => (
                <li key={t.id}>
                  {t.done ? "☑ " : "☐ "}
                  {t.title}
                  {t.owner && ` — owner: ${t.owner}`}
                  {t.metric && ` — measure: ${t.metric}`}
                </li>
              ))}
          </ul>
        </section>
      ))}
      <h2>Content calendar</h2>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Channel</th>
            <th>Idea</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {[...draft.posts]
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((p) => (
              <tr key={p.id}>
                <td>{formatDayAr(p.date)}</td>
                <td>{postChannelLabel[p.channel]}</td>
                <td>{p.idea}</td>
                <td>{postStatusLabel[p.status]}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p className="pb-note">No prices and no promises of results. Later publishing is approved by a person.</p>
    </article>
  );
}
