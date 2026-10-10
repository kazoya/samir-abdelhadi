"use client";

import { useRef, useState } from "react";
import { Copy, FileJson, FileSpreadsheet, FolderOpen, MessageCircle, Printer, RotateCcw, Save, Trash2, Upload } from "lucide-react";
import { waLink } from "@/lib/site";
import { briefText, draftToJson, postsToCsv, whatsappMessage } from "@/lib/planner/export";
import { LIMITS, type DraftV1, type PlanV1 } from "@/lib/planner/types";
import type { Slot } from "@/lib/planner/storage";
import { download, inputCls, smallBtn, type Notice } from "./ui";

export type SlotInfo = { state: "empty" } | { state: "ok"; draft: DraftV1 } | { state: "invalid"; message: string };

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Amman" }).format(new Date(iso));

export function BriefPanel({
  draft,
  plan,
  name,
  onName,
  onLabel,
  slots,
  onRefreshSlots,
  onSave,
  onLoad,
  onDelete,
  onImport,
  onReset,
  notify,
}: {
  draft: DraftV1;
  plan: PlanV1;
  name: string;
  onName: (n: string) => void;
  onLabel: (l: string) => void;
  slots: Record<Slot, SlotInfo> | null;
  onRefreshSlots: () => void;
  onSave: (s: Slot) => void;
  onLoad: (s: Slot) => void;
  onDelete: (s: Slot) => void;
  onImport: (file: File) => void;
  onReset: () => void;
  notify: (n: Notice) => void;
}) {
  const brief = briefText(draft, plan, name);
  const [manual, setManual] = useState(false);
  const manualRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const base = `abdelhadi-plan-${draft.startDate}`;

  const copy = async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("no clipboard");
      await navigator.clipboard.writeText(brief);
      setManual(false);
      notify({ kind: "ok", text: "Brief copied to the clipboard." });
    } catch {
      setManual(true);
      notify({ kind: "error", text: "Could not copy automatically. The text is selected below. Copy it yourself (Ctrl+C)." });
      requestAnimationFrame(() => manualRef.current?.select());
    }
  };
  const save = (file: string, text: string, mime: string, label: string) =>
    notify(download(file, text, mime) ? { kind: "ok", text: `Download started: ${label}.` } : { kind: "error", text: `Could not download ${label} in this browser.` });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <div className="grid content-start gap-4">
        <label className="grid gap-1 text-sm">
          <span className="font-bold">Your name (optional. It appears in the brief and the message only, and is not saved)</span>
          <input className={inputCls} value={name} onChange={(e) => onName(e.target.value)} maxLength={LIMITS.label} placeholder="Example: Sara" autoComplete="off" />
        </label>
        <pre data-brief className="max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl border border-line bg-bg/40 p-4 text-sm leading-7 text-muted">
          {brief}
        </pre>
        {manual && (
          <label className="grid gap-1 text-sm">
            <span className="font-bold">Copy manually</span>
            <textarea ref={manualRef} readOnly value={brief} className={inputCls + " min-h-32 text-xs"} />
          </label>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={copy} className="btn btn-ghost">
            <Copy size={16} aria-hidden /> Copy brief
          </button>
          <a href={waLink(whatsappMessage(draft, plan, name))} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-wa>
            <MessageCircle size={16} aria-hidden /> Open a short message in WhatsApp
          </a>
          <button type="button" onClick={() => window.print()} className="btn btn-ghost">
            <Printer size={16} aria-hidden /> Print or save PDF
          </button>
          <button type="button" onClick={() => save(`${base}.json`, draftToJson(draft), "application/json", "JSON file")} className="btn btn-ghost">
            <FileJson size={16} aria-hidden /> Export plan JSON
          </button>
          <button type="button" onClick={() => save(`${base}-calendar.csv`, postsToCsv(draft), "text/csv;charset=utf-8", "CSV calendar")} className="btn btn-ghost sm:col-span-2">
            <FileSpreadsheet size={16} aria-hidden /> Export calendar CSV (Excel / Sheets)
          </button>
        </div>
        <p className="text-xs leading-6 text-muted">
          WhatsApp opens with a ready message. Nothing is sent until you press send yourself. Save PDF uses your browser print window. The JSON file does not include your name.
        </p>
      </div>

      <aside className="grid content-start gap-4">
        <div className="card p-5">
          <p className="font-bold">Drafts on this device</p>
          <p className="mt-1 text-xs leading-6 text-muted">
            Optional saving in this browser only. No sync and no server. Do not save on a shared device. The name is not saved.
          </p>
          <label className="mt-3 grid gap-1 text-xs text-muted">
            Draft title (optional)
            <input className={inputCls} value={draft.label} maxLength={LIMITS.label} onChange={(e) => onLabel(e.target.value)} placeholder="Example: dialogue plan" />
          </label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(["A", "B"] as const).map((s) => (
              <button key={s} type="button" onClick={() => onSave(s)} className="btn btn-ghost text-sm" data-save={s}>
                <Save size={16} aria-hidden /> Save as draft {s}
              </button>
            ))}
          </div>
          <button type="button" onClick={onRefreshSlots} className={smallBtn + " mt-3 w-full"}>
            <FolderOpen size={16} aria-hidden /> Show saved drafts
          </button>
          {slots && (
            <ul className="mt-3 grid gap-2 text-sm" data-slots>
              {(["A", "B"] as const).map((s) => {
                const info = slots[s];
                return (
                  <li key={s} className="rounded-xl border border-line p-3" data-slot={s}>
                    <p className="font-bold">Draft {s}</p>
                    {info.state === "empty" && <p className="text-xs text-muted">Empty</p>}
                    {info.state === "invalid" && <p className="text-xs text-[#f0b3a5]">Damaged or an unsupported version: {info.message}</p>}
                    {info.state === "ok" && (
                      <p className="text-xs leading-6 text-muted">
                        {info.draft.label || "Untitled"} · saved {when(info.draft.updatedAt)} · schema {info.draft.schemaVersion}
                      </p>
                    )}
                    {info.state !== "empty" && (
                      <div className="mt-2 flex gap-2">
                        {info.state === "ok" && (
                          <button type="button" onClick={() => onLoad(s)} className={smallBtn}>
                            Open
                          </button>
                        )}
                        <button type="button" onClick={() => onDelete(s)} className={smallBtn} aria-label={`Delete draft ${s}`}>
                          <Trash2 size={16} aria-hidden /> Delete
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="card p-5">
          <p className="font-bold">Import a JSON plan</p>
          <p className="mt-1 text-xs leading-6 text-muted">Up to {LIMITS.importBytes / 1024} KiB. It is checked before opening. An invalid file does not touch your current plan.</p>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            data-import
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
              e.target.value = "";
            }}
          />
          <button type="button" onClick={() => fileRef.current?.click()} className="btn btn-ghost mt-3 w-full text-sm">
            <Upload size={16} aria-hidden /> Choose a JSON file
          </button>
        </div>
        <button type="button" onClick={onReset} className="btn border border-line text-sm font-normal text-muted hover:border-[#d98b7a]/60 hover:text-[#f0b3a5]">
          <RotateCcw size={16} aria-hidden /> Start over
        </button>
      </aside>
    </div>
  );
}
