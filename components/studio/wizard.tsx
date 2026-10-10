"use client";

import { useEffect, useRef } from "react";
import { useCopy } from "@/components/prefs";
import { questions } from "@/lib/planner/dict";
import type { AnswersV1, ChannelId } from "@/lib/planner/types";
import { toggleChannel } from "@/lib/planner/validate";

export type Partial5 = { businessId?: AnswersV1["businessId"]; goalId?: AnswersV1["goalId"]; channelIds: ChannelId[]; teamId?: AnswersV1["teamId"]; timelineId?: AnswersV1["timelineId"] };

export function Wizard({
  value,
  step,
  onChange,
  onStep,
  onDone,
  note,
}: {
  value: Partial5;
  step: number;
  onChange: (v: Partial5) => void;
  onStep: (s: number) => void;
  onDone: (v: Partial5) => void;
  note?: string;
}) {
  const t = useCopy();
  const q = questions[step];
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);

  // نقل التركيز إلى عنوان السؤال عند تغيّره فقط (لا عند أول تحميل للصفحة)
  useEffect(() => {
    if (mounted.current) heading.current?.focus();
    mounted.current = true;
  }, [step]);

  const last = step === questions.length - 1;
  const pick = (id: string) => {
    if (q.multi) {
      onChange({ ...value, channelIds: toggleChannel(value.channelIds, id as ChannelId) });
      return;
    }
    const next = { ...value, [q.key]: id } as Partial5;
    onChange(next);
    if (last) onDone(next);
    else onStep(step + 1);
  };

  return (
    <div className="card p-6 md:p-10">
      <div className="flex items-center gap-2" aria-hidden>
        {questions.map((x, i) => (
          <span key={x.key} className={`h-1.5 flex-1 rounded-full transition-colors duration-200 ${i <= step ? "bg-gold" : "bg-line"}`} />
        ))}
      </div>
      {note && <p className="mt-4 rounded-xl border border-gold/40 bg-gold-soft px-4 py-2 text-sm text-gold-strong">{note}</p>}
      <p className="mt-6 text-sm text-muted">
        {t.studio.qOf(step + 1, questions.length)}
      </p>
      <h2 ref={heading} tabIndex={-1} id="q" className="mt-1 text-2xl font-bold outline-none">
        {t.questions[step]}
      </h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2" role="group" aria-labelledby="q">
        {Object.keys(q.labels).map((id) => {
          const label =
            step === 0 ? t.business[id as keyof typeof t.business] : step === 1 ? t.goals[id as keyof typeof t.goals] : step === 2 ? t.channels[id as keyof typeof t.channels] : step === 3 ? t.team[id as keyof typeof t.team] : t.timeline[id as keyof typeof t.timeline];
          const on = q.multi ? value.channelIds.includes(id as ChannelId) : value[q.key as Exclude<keyof Partial5, "channelIds">] === id;
          return (
            <button
              key={id}
              type="button"
              data-id={id}
              onClick={() => pick(id)}
              aria-pressed={on}
              className={`min-h-14 cursor-pointer rounded-2xl border px-5 py-4 text-start transition duration-200 active:scale-[0.98] ${on ? "border-gold bg-gold-soft text-gold-strong shadow-[0_0_0_1px_var(--c-gold)]" : "border-line bg-raised hover:border-line-strong hover:bg-gold-soft/40"}`}
            >
              {label}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {step > 0 && (
          <button type="button" onClick={() => onStep(step - 1)} className="btn border border-line text-sm font-normal text-muted hover:text-ink">
            {t.studio.back}
          </button>
        )}
        {q.multi && (
          <button
            type="button"
            disabled={value.channelIds.length === 0}
            onClick={() => (last ? onDone(value) : onStep(step + 1))}
            className="btn btn-primary text-sm"
          >
            {t.studio.next}
          </button>
        )}
      </div>
    </div>
  );
}
