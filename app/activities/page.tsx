import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHead, Source } from "@/components/ui";
import { activities, relationships, ZAD } from "@/lib/site";

export const metadata: Metadata = { title: "Public record" };

const relationNote: Record<(typeof relationships)[number], string> = {
  "Published biography": "Wording taken from the cited page, not from the memory of this concept.",
  "Giving mentioned": "Projects and grants named on the page. No amount or date is added if the page did not write it.",
  "Membership mentioned": "Boards and prizes as the page named them.",
  "Where sources differ": "The difference stays visible. This page does not pick a number to make the record look cleaner.",
};

const story = [
  { k: "Context", v: "A defining sentence with no source, and a photograph with no permission." },
  { k: "Contribution", v: "Tie the sentence to a page, and hold the photograph until permission arrives." },
  { k: "Outputs", v: "An item in the record and a link. Not a post that sends itself." },
  { k: "Evidence", v: "In a real case: the link to the published page." },
  { k: "Result", v: "A result is named only with a number its owner agrees to publish." },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHead kicker="Public record" title="What was written on pages you can open">
        <p>Every item carries its link. Being named together is not a partnership, and a difference between sources stays visible.</p>
      </PageHead>
      <div className="grid gap-12">
        {relationships.map((rel) => {
          const items = activities.filter((a) => a.relationship === rel);
          return (
            <section key={rel} aria-labelledby={`rel-${rel}`}>
              <h2 id={`rel-${rel}`} className="flex items-center gap-3 text-xl font-bold">
                <span className="h-6 w-1 rounded-full bg-gold" aria-hidden />
                {rel}
                <span className="rounded-full border border-line px-2 text-sm font-normal text-muted">{items.length}</span>
              </h2>
              <p className="mt-2 text-sm text-muted">{relationNote[rel]}</p>
              <ul className="mt-4 grid gap-3">
                {items.map((a) => (
                  <li key={a.text} className="card grid gap-3 p-5 leading-8">
                    <span>{a.text}</span>
                    <a href={a.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 text-xs text-muted underline-offset-4 hover:text-gold-strong hover:underline">
                      Source <ExternalLink size={12} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <section aria-labelledby="story" className="mt-16">
        <h2 id="story" className="text-xl font-bold">A template for an honest piece</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">No client and no result are shown. This is a template for what could be written later, with permission.</p>
        <div className="card mt-5 p-6" data-illustrative>
          <p className="mb-4 inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">Illustrative case. Not a real client and not an actual result.</p>
          <dl className="grid gap-3 sm:grid-cols-[8rem_1fr]">
            {story.map((s) => (
              <div key={s.k} className="contents">
                <dt className="font-bold text-gold-strong">{s.k}</dt>
                <dd className="leading-7 text-muted">{s.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <Source page="Zad for Arts, Samir Abdelhadi Fund" href={ZAD} />
    </>
  );
}
