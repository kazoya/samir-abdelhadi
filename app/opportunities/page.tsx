import type { Metadata } from "next";
import { FileText, Globe2, Inbox, ScanSearch } from "lucide-react";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "What comes next" };

const items = [
  {
    icon: Inbox,
    t: "Approve the brief before any piece",
    now: "The studio exports a brief that stays in the browser.",
    next: "The office marks what is published and what waits.",
    gate: "Nothing is published from this page.",
  },
  {
    icon: Globe2,
    t: "A domain with a clear name",
    now: "The current address is a concept on Vercel.",
    next: "A domain the office chooses after the text is reviewed.",
    gate: "Buying the domain, and who owns it, is a human decision.",
  },
  {
    icon: FileText,
    t: "Close the difference on graduation year and senate number",
    now: "The record shows the difference and does not choose.",
    next: "One sentence the subject of the biography approves.",
    gate: "Sources are not replaced by spoken memory.",
  },
  {
    icon: ScanSearch,
    t: "A weekly look at what is being said",
    now: "There is no automatic news collection.",
    next: "A list of links a person marks as confirmed, disputed, or unsourced.",
    gate: "The watch is not published without a review.",
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHead kicker="What comes next" title="What can be finished after this concept">
        <p>Suggestions for the next piece of work. Each one stops at a human approval.</p>
      </PageHead>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <article key={it.t} className="card p-6">
            <it.icon className="text-gold" size={26} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">{it.t}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">Now: {it.now}</p>
            <p className="mt-2 text-sm leading-7">Next: {it.next}</p>
            <p className="mt-3 text-sm font-bold text-gold-strong">{it.gate}</p>
          </article>
        ))}
      </div>
    </>
  );
}
