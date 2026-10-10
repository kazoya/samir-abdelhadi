"use client";

import { useCopy } from "@/components/prefs";
import { serviceName } from "@/lib/i18n/lookup";
import { formatDayAr } from "@/lib/planner/dates";
import { compareDrafts } from "@/lib/planner/draft";
import type { SlotInfo } from "./brief-panel";
import type { Slot } from "@/lib/planner/storage";
import type { Copy } from "@/lib/i18n";

function answerLabel(copy: Copy, field: string, v: unknown): string {
  switch (field) {
    case "businessId":
      return copy.business[v as keyof typeof copy.business];
    case "goalId":
      return copy.goals[v as keyof typeof copy.goals];
    case "teamId":
      return copy.team[v as keyof typeof copy.team];
    case "timelineId":
      return copy.timeline[v as keyof typeof copy.timeline];
    case "channelIds":
      return [...(v as string[])].sort().map((c) => copy.channels[c as keyof typeof copy.channels]).join(copy.listSep);
    default:
      return String(v);
  }
}

export function ComparePanel({ slots, onRefresh }: { slots: Record<Slot, SlotInfo> | null; onRefresh: () => void }) {
  const t = useCopy();
  const fieldName: Record<string, string> = { businessId: t.studio.audience, goalId: t.studio.goal, channelIds: t.studio.channelsWord, teamId: t.studio.teamWord, timelineId: t.studio.startWord };
  const a = slots?.A.state === "ok" ? slots.A.draft : null;
  const b = slots?.B.state === "ok" ? slots.B.draft : null;
  if (!a || !b)
    return (
      <div className="card grid justify-items-start gap-3 p-6">
        <p className="font-bold">{t.studio.compareTitle}</p>
        <p className="text-sm leading-7 text-muted">{t.studio.compareBody}</p>
        <p className="text-sm text-muted" data-compare-status>
          {t.studio.statusPrefix}: A {slots ? (a ? "✓" : "—") : "?"} · B {slots ? (b ? "✓" : "—") : "?"}
        </p>
        <button type="button" onClick={onRefresh} className="btn btn-ghost text-sm">
          {t.studio.refreshDevice}
        </button>
      </div>
    );

  const d = compareDrafts(a, b, (field, v) => answerLabel(t, field, v));
  const name = (id: string) => serviceName(t, id);
  const th = "px-3 py-2 text-start text-xs font-bold text-muted";
  const td = "border-t border-line px-3 py-2 align-top";
  return (
    <div className="grid gap-6" data-compare>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          A: {a.label || t.studio.untitled} · B: {b.label || t.studio.untitled}
        </p>
        <button type="button" onClick={onRefresh} className="btn btn-ghost text-sm">
          {t.studio.refresh}
        </button>
      </div>
      <div className="card overflow-x-auto p-2">
        <table className="w-full min-w-[32rem] text-sm">
          <caption className="p-3 text-start font-bold">{t.studio.inputs}</caption>
          <thead>
            <tr>
              <th className={th}>{t.studio.field}</th>
              <th className={th}>A</th>
              <th className={th}>B</th>
            </tr>
          </thead>
          <tbody>
            {d.inputs.map((r) => (
              <tr key={r.field} className={r.same ? "" : "bg-gold-soft/40"}>
                <td className={td}>
                  {fieldName[r.field]} {!r.same && <span className="text-xs text-gold-strong">{t.studio.different}</span>}
                </td>
                <td className={td}>{r.a}</td>
                <td className={td}>{r.b}</td>
              </tr>
            ))}
            <tr>
              <td className={td}>{t.studio.planStart}</td>
              <td className={td}>{formatDayAr(d.startDate.a)}</td>
              <td className={td}>{formatDayAr(d.startDate.b)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <caption className="p-3 text-start font-bold">{t.studio.recOrder}</caption>
            <thead>
              <tr>
                <th className={th}>{t.studio.path}</th>
                <th className={th}>A</th>
                <th className={th}>B</th>
              </tr>
            </thead>
            <tbody>
              {d.services.map((s) => (
                <tr key={s.serviceId}>
                  <td className={td}>{name(s.serviceId)}</td>
                  <td className={td}>{s.rankA ?? "—"}</td>
                  <td className={td}>{s.rankB ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <caption className="p-3 text-start font-bold">{t.studio.tasksPosts}</caption>
            <thead>
              <tr>
                <th className={th}>Item</th>
                <th className={th}>A</th>
                <th className={th}>B</th>
              </tr>
            </thead>
            <tbody>
              {d.tasksPerPhase.map((r) => (
                <tr key={r.phase}>
                  <td className={td}>{t.studio.tasksPhase(t.phases[r.phase as 1 | 2 | 3 | 4])}</td>
                  <td className={td}>{r.a}</td>
                  <td className={td}>{r.b}</td>
                </tr>
              ))}
              {d.postsPerChannel.map((r) => (
                <tr key={r.channel}>
                  <td className={td}>{t.studio.postsChannel(t.postChannels[r.channel as keyof typeof t.postChannels])}</td>
                  <td className={td}>{r.a}</td>
                  <td className={td}>{r.b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
