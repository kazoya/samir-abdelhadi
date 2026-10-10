"use client";

import { Plus, Trash2 } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { metricSuggestions } from "@/lib/planner/plan30";
import { LIMITS, type Task } from "@/lib/planner/types";
import { inputCls, smallBtn } from "./ui";

export function PlanEditor({ tasks, onChange, newId }: { tasks: Task[]; onChange: (t: Task[]) => void; newId: () => string }) {
  const t = useCopy();
  const update = (id: string, patch: Partial<Task>) => onChange(tasks.map((task) => (task.id === id ? { ...task, ...patch } : task)));
  const remove = (id: string) => onChange(tasks.filter((task) => task.id !== id));
  const add = (phase: Task["phase"]) =>
    onChange([...tasks, { id: newId(), phase, title: t.studio.newTask, owner: "", approval: t.studio.approveYou, deliverable: "", metric: "", done: false }]);
  const full = tasks.length >= LIMITS.tasks;

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-7 text-muted">{t.studio.planHint}</p>
      <datalist id="metric-suggestions">
        {metricSuggestions.map((m) => (
          <option key={m} value={m} />
        ))}
      </datalist>
      {([1, 2, 3, 4] as const).map((ph) => {
        const list = tasks.filter((task) => task.phase === ph);
        return (
          <section key={ph} aria-labelledby={`ph-${ph}`} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 id={`ph-${ph}`} className="font-bold text-gold-strong">
                {t.phases[ph]}
              </h3>
              <button type="button" onClick={() => add(ph)} disabled={full} className={smallBtn + " disabled:opacity-40"}>
                <Plus size={16} aria-hidden /> {t.studio.addTask}
              </button>
            </div>
            {list.length === 0 && <p className="mt-3 text-sm text-muted">{t.studio.noTasks}</p>}
            <ul className="mt-3 grid gap-3">
              {list.map((task) => (
                <li key={task.id} data-task={task.id} className="rounded-2xl border border-line bg-bg/40 p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={(e) => update(task.id, { done: e.target.checked })}
                      aria-label={t.studio.doneLabel(task.title)}
                      className="mt-3 size-5 shrink-0 cursor-pointer accent-[var(--c-gold)]"
                    />
                    <div className="grid flex-1 gap-1 text-xs text-muted">
                      <label htmlFor={`${task.id}-f1`}>{t.studio.task}</label>
                      <input id={`${task.id}-f1`} className={inputCls + " text-base font-bold"} value={task.title} maxLength={LIMITS.title} onChange={(e) => update(task.id, { title: e.target.value })} />
                    </div>
                    <button type="button" onClick={() => remove(task.id)} className={smallBtn + " mt-5 px-2.5"} aria-label={t.studio.deleteTask(task.title)}>
                      <Trash2 size={16} aria-hidden />
                    </button>
                  </div>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${task.id}-f2`}>{t.studio.owner}</label>
                      <input id={`${task.id}-f2`} className={inputCls} value={task.owner} placeholder={t.studio.nameOwner} maxLength={LIMITS.label} onChange={(e) => update(task.id, { owner: e.target.value })} />
                    </div>
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${task.id}-f3`}>{t.studio.output}</label>
                      <input id={`${task.id}-f3`} className={inputCls} value={task.deliverable} maxLength={LIMITS.title} onChange={(e) => update(task.id, { deliverable: e.target.value })} />
                    </div>
                    <div className="grid gap-1 text-xs text-muted">
                      <label htmlFor={`${task.id}-f4`}>{t.studio.measure}</label>
                      <input id={`${task.id}-f4`} className={inputCls} list="metric-suggestions" value={task.metric} placeholder={t.studio.chooseOrWrite} maxLength={LIMITS.title} onChange={(e) => update(task.id, { metric: e.target.value })} />
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted">
                    {t.studio.approval}: {task.approval}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {full && <p className="text-sm text-muted">{t.studio.taskLimit(LIMITS.tasks)}</p>}
    </div>
  );
}
