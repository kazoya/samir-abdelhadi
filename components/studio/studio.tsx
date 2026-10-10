"use client";

import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { goalLabel } from "@/lib/planner/dict";
import { addDays, diffDays, todayIso } from "@/lib/planner/dates";
import { applyAnswers, makeId, newDraft, planOf } from "@/lib/planner/draft";
import { deleteDraft, loadDraft, saveDraft, saveErrorText, SLOTS, type Slot } from "@/lib/planner/storage";
import { GOAL_IDS, LIMITS, type AnswersV1, type DraftV1, type Post, type Task } from "@/lib/planner/types";
import { parseAnswers, parseImportText } from "@/lib/planner/validate";
import { BriefPanel, type SlotInfo } from "./brief-panel";
import { CalendarEditor } from "./calendar-editor";
import { ComparePanel } from "./compare-panel";
import { PlanEditor } from "./plan-editor";
import { PrintBrief } from "./print-brief";
import { Recommendations } from "./recommendations";
import { Dialog, Panel, StatusLine, Tabs, type Notice } from "./ui";
import { Wizard, type Partial5 } from "./wizard";

type Tab = "recs" | "plan" | "calendar" | "brief" | "compare";
const TABS: { id: Tab; label: string }[] = [
  { id: "recs", label: "Recommendations" },
  { id: "plan", label: "30-day plan" },
  { id: "calendar", label: "Calendar" },
  { id: "brief", label: "Brief" },
  { id: "compare", label: "Compare" },
];

const toAnswers = (p: Partial5) => parseAnswers({ schemaVersion: 1, ...p });

export function Studio() {
  const params = useSearchParams();
  const presetGoal = params.get("goal");
  const goalFromUrl = GOAL_IDS.find((g) => g === presetGoal);

  const [partial, setPartial] = useState<Partial5>(() => ({ channelIds: [], goalId: goalFromUrl }));
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftV1 | null>(null);
  const [editing, setEditing] = useState(true);
  const [tab, setTab] = useState<Tab>("recs");
  const [name, setName] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [slots, setSlots] = useState<Record<Slot, SlotInfo> | null>(null);
  const [pending, setPending] = useState<AnswersV1 | null>(null);
  const [confirm, setConfirm] = useState<null | { kind: "reset" } | { kind: "import"; draft: DraftV1 } | { kind: "load"; slot: Slot }>(null);
  const [wipeSaved, setWipeSaved] = useState(false);

  const plan = useMemo(() => (draft ? planOf(draft) : null), [draft]);
  const edited = !!draft && (draft.userEdited.tasks || draft.userEdited.posts);

  const refreshSlots = useCallback(() => {
    const next = {} as Record<Slot, SlotInfo>;
    for (const s of SLOTS) {
      const r = loadDraft(s);
      next[s] = r === null ? { state: "empty" } : r.success ? { state: "ok", draft: r.data } : { state: "invalid", message: r.errors[0]?.message ?? "" };
    }
    setSlots(next);
  }, []);

  const finishWizard = (p: Partial5) => {
    const r = toAnswers(p);
    if (!r.success) {
      setNotice({ kind: "error", text: r.errors.map((e) => e.message).join(", ") });
      return;
    }
    if (!draft) {
      setDraft(newDraft(r.data, todayIso()));
      setEditing(false);
      setTab("recs");
      setNotice({ kind: "info", text: "Ready: first recommendations, a 30-day plan, and a calendar you can edit." });
    } else if (edited && JSON.stringify(r.data) !== JSON.stringify(draft.answers)) {
      setPending(r.data);
    } else {
      setDraft(applyAnswers(draft, r.data, { regenerateEdited: false }));
      setEditing(false);
      setNotice({ kind: "info", text: "Recommendations and the plan were updated from your new answers." });
    }
  };

  const resolvePending = (regenerate: boolean) => {
    if (!draft || !pending) return;
    setDraft(applyAnswers(draft, pending, { regenerateEdited: regenerate }));
    setPending(null);
    setEditing(false);
    setNotice({ kind: "info", text: regenerate ? "Tasks and the calendar were rebuilt from the new answers." : "Recommendations were updated and your edits to tasks and the calendar were kept." });
  };

  const setTasks = (tasks: Task[]) => draft && setDraft({ ...draft, tasks, updatedAt: new Date().toISOString(), userEdited: { ...draft.userEdited, tasks: true } });
  const setPosts = (posts: Post[]) => draft && setDraft({ ...draft, posts, updatedAt: new Date().toISOString(), userEdited: { ...draft.userEdited, posts: true } });

  const save = (s: Slot) => {
    if (!draft) return;
    const r = saveDraft(s, { ...draft, updatedAt: new Date().toISOString() });
    setNotice(r.ok ? { kind: "ok", text: `Saved as draft ${s} on this device only.` } : { kind: "error", text: saveErrorText[r.reason] });
    if (r.ok) refreshSlots();
  };

  const openDraft = (d: DraftV1, how: string) => {
    setDraft(d);
    setPartial({ ...d.answers, channelIds: [...d.answers.channelIds] });
    setEditing(false);
    setTab("recs");
    setNotice({ kind: "ok", text: how });
  };

  const load = (s: Slot) => {
    const r = loadDraft(s);
    if (!r || !r.success) {
      setNotice({ kind: "error", text: `Could not open draft ${s}${r && !r.success ? `: ${r.errors[0]?.message}` : ""}.` });
      return;
    }
    if (draft && edited) setConfirm({ kind: "load", slot: s });
    else openDraft(r.data, `Opened draft ${s}.`);
  };

  const importFile = async (f: File) => {
    let text: string;
    try {
      if (f.size > LIMITS.importBytes) throw new RangeError();
      text = await f.text();
    } catch (e) {
      setNotice({ kind: "error", text: e instanceof RangeError ? `The file is larger than ${LIMITS.importBytes / 1024} KiB. Nothing changed.` : "The file could not be read. Nothing changed." });
      return;
    }
    const r = parseImportText(text, f.size);
    if (!r.success) {
      const first = r.errors.slice(0, 3).map((e) => (e.path ? `${e.path}: ${e.message}` : e.message));
      setNotice({ kind: "error", text: `The file was not imported. Your current plan did not change. ${first.join("; ")}${r.errors.length > 3 ? ` (+${r.errors.length - 3})` : ""}` });
      return;
    }
    if (draft) setConfirm({ kind: "import", draft: r.data });
    else openDraft(r.data, "The plan was imported from the file.");
  };

  const doReset = () => {
    let wiped = true;
    if (wipeSaved) for (const s of SLOTS) wiped = deleteDraft(s) && wiped;
    setDraft(null);
    setPartial({ channelIds: [] });
    setName("");
    setStep(0);
    setEditing(true);
    setTab("recs");
    setSlots(null);
    setConfirm(null);
    setNotice(
      wipeSaved
        ? wiped
          ? { kind: "ok", text: "The session was reset and the saved drafts on this device were deleted." }
          : { kind: "error", text: "The session was reset, but the saved drafts could not be deleted from storage." }
        : { kind: "ok", text: "The session was reset. Saved drafts were left as they were." },
    );
    setWipeSaved(false);
  };

  const closeConfirm = useCallback(() => setConfirm(null), []);
  const closePending = useCallback(() => setPending(null), []);

  return (
    <div className="grid gap-6">
      <StatusLine notice={notice} />

      {editing || !draft || !plan ? (
        <div className="print:hidden">
          <Wizard
            value={partial}
            step={step}
            onChange={setPartial}
            onStep={setStep}
            onDone={finishWizard}
            note={goalFromUrl && !draft ? `Goal preset: “${goalLabel[goalFromUrl]}”. You can change it on question 2.` : undefined}
          />
          {draft && (
            <button type="button" onClick={() => setEditing(false)} className="btn mt-4 border border-line text-sm font-normal text-muted hover:text-ink">
              Back to my plan, unchanged
            </button>
          )}
        </div>
      ) : (
        <>
          <Tabs tabs={TABS} value={tab} onChange={(t) => {
            setTab(t);
            if (t === "compare" && !slots) refreshSlots();
          }} idBase="studio" />
          <Panel idBase="studio" id="recs" active={tab === "recs"}>
            <Recommendations
              plan={plan}
              onEdit={() => {
                setPartial({ ...draft.answers, channelIds: [...draft.answers.channelIds] });
                setStep(0);
                setEditing(true);
              }}
            />
          </Panel>
          <Panel idBase="studio" id="plan" active={tab === "plan"}>
            <label className="mb-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="font-bold">Start date</span>
              <input
                type="date"
                value={draft.startDate}
                onChange={(e) => {
                  const v = e.target.value;
                  if (!v) return;
                  // المنشورات تُزاح بنفس الفرق حتى لا تسبق تاريخ البداية
                  const shift = diffDays(draft.startDate, v);
                  const moved = draft.posts.map((p) => ({ ...p, date: addDays(p.date, shift) }));
                  setDraft({ ...draft, startDate: v, posts: moved, updatedAt: new Date().toISOString() });
                }}
                className="min-h-11 rounded-xl border border-line bg-bg/60 px-3 text-ink outline-none focus:border-gold"
              />
            </label>
            <PlanEditor tasks={draft.tasks} onChange={setTasks} newId={makeId} />
          </Panel>
          <Panel idBase="studio" id="calendar" active={tab === "calendar"}>
            <CalendarEditor posts={draft.posts} startDate={draft.startDate} onChange={setPosts} newId={makeId} />
          </Panel>
          <Panel idBase="studio" id="brief" active={tab === "brief"}>
            <BriefPanel
              draft={draft}
              plan={plan}
              name={name}
              onName={setName}
              onLabel={(label) => setDraft({ ...draft, label })}
              slots={slots}
              onRefreshSlots={refreshSlots}
              onSave={save}
              onLoad={load}
              onDelete={(s) => {
                const ok = deleteDraft(s);
                setNotice(ok ? { kind: "ok", text: `Draft ${s} was deleted from this device.` } : { kind: "error", text: `Draft ${s} could not be deleted.` });
                refreshSlots();
              }}
              onImport={importFile}
              onReset={() => setConfirm({ kind: "reset" })}
              notify={setNotice}
            />
          </Panel>
          <Panel idBase="studio" id="compare" active={tab === "compare"}>
            <ComparePanel slots={slots} onRefresh={refreshSlots} />
          </Panel>
          <PrintBrief draft={draft} plan={plan} name={name} />
        </>
      )}

      <Dialog open={!!pending} onClose={closePending} title="You edited the plan">
        <p>You changed your answers after editing tasks or the calendar. Recommendations update either way. What should happen to your edits?</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" autoFocus onClick={() => resolvePending(false)} className="btn btn-primary text-sm">
            Keep my edits
          </button>
          <button type="button" onClick={() => resolvePending(true)} className="btn btn-ghost text-sm">
            Rebuild tasks and the calendar
          </button>
        </div>
      </Dialog>

      <Dialog open={confirm?.kind === "reset"} onClose={closeConfirm} title="Start over?">
        <p>The name, the answers, and the open plan will be cleared. You can restore them only from an exported JSON file.</p>
        <label className="mt-4 flex min-h-11 cursor-pointer items-center gap-3 text-sm text-ink">
          <input type="checkbox" checked={wipeSaved} onChange={(e) => setWipeSaved(e.target.checked)} className="size-5 accent-[var(--c-gold)]" />
          Also delete drafts A and B saved on this device
        </label>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={doReset} className="btn btn-primary text-sm">
            Yes, reset
          </button>
          <button type="button" autoFocus onClick={() => setConfirm(null)} className="btn btn-ghost text-sm">
            Cancel
          </button>
        </div>
      </Dialog>

      <Dialog open={confirm?.kind === "import" || confirm?.kind === "load"} onClose={closeConfirm} title="Replace the open plan?">
        <p>The file is valid. Opening it replaces the plan that is open now, including unsaved edits. Save or export first if you want to keep them.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              if (confirm?.kind === "import") openDraft(confirm.draft, "The plan was imported from the file.");
              else if (confirm?.kind === "load") {
                const r = loadDraft(confirm.slot);
                if (r && r.success) openDraft(r.data, `Opened draft ${confirm.slot}.`);
              }
              setConfirm(null);
            }}
            className="btn btn-primary text-sm"
          >
            Replace
          </button>
          <button type="button" autoFocus onClick={() => setConfirm(null)} className="btn btn-ghost text-sm">
            Cancel
          </button>
        </div>
      </Dialog>
    </div>
  );
}
