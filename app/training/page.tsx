import type { Metadata } from "next";
import { GraduationCap, MessageCircle } from "lucide-react";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { published, services, SKILLS_REPO, trainingPaths, trainings, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "Method" };

export default function TrainingPage() {
  return (
    <>
      <PageHead kicker="Method" title="Public rules, not campaign promises">
        <p>{published.meta} The paths are assembled for this concept. They are not programmes announced in his name, and there are no dates and no certificates.</p>
      </PageHead>
      <section aria-labelledby="paths">
        <h2 id="paths" className="text-xl font-bold">Three paths</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          Drawn from the open marketing skills in{" "}
          <a className="underline" href={SKILLS_REPO}>marketingskills</a>
          {" "}(copy, research, and presentation), shortened for a public presence. These are not programmes announced by Ghina Media or by any office.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr_1fr]">
          {trainingPaths.map((p) => (
            <article key={p.id} data-path={p.id} className="card flex flex-col p-6">
              <span className="grid size-11 place-items-center rounded-2xl bg-gold-soft">
                <GraduationCap className="text-gold-strong" size={22} aria-hidden />
              </span>
              <h3 className="mt-4 text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.forWho}</p>
              <ul className="mt-4 grid gap-1.5 text-sm leading-7">
                {p.trainingIdx.map((t) => (
                  <li key={t}>{trainings[t]}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm">{p.serviceIds.map((id) => services.find((s) => s.id === id)?.en).join(", ")}</p>
              <a
                href={waLink(`Hello, I am reviewing the path “${p.title}” in the Abdelhadi presence concept.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-5 text-sm"
              >
                <MessageCircle size={16} aria-hidden /> Review this path
              </a>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="delivered" className="mt-14">
        <h2 id="delivered" className="text-xl font-bold">The eight rules</h2>
        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {trainings.map((t, i) => (
            <li key={t} className="card flex items-start gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gold-soft text-sm font-bold text-gold-strong">{i + 1}</span>
              <span className="pt-2 leading-7">{t}</span>
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-gold/40 bg-gold-soft p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-bold">Want to apply the method to one piece?</p>
          <p className="mt-1 text-sm text-muted">The link opens his WhatsApp. This page does not book a time.</p>
        </div>
        <CtaLink href={waLink("Hello, I want to review the Abdelhadi presence method on one specific piece.")}>Open WhatsApp</CtaLink>
      </section>
      <Source page="marketingskills on GitHub, MIT licence" href={SKILLS_REPO} />
    </>
  );
}
