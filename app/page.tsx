import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, ScrollText } from "lucide-react";
import { businessLabel, channelLabel, goalLabel, teamLabel } from "@/lib/planner/dict";
import { buildPlan } from "@/lib/planner/rules";
import type { AnswersV1 } from "@/lib/planner/types";
import { HeroParticles } from "@/components/hero-particles";
import { CtaLink } from "@/components/ui";
import { activities, brand, GHINA_ENGINE, groups, published, services, SKILLS_REPO, waLink } from "@/lib/site";

const sampleAnswers: AnswersV1 = { schemaVersion: 1, businessId: "personal", goalId: "identity", channelIds: ["linkedin"], teamId: "one", timelineId: "month" };
const sample = buildPlan(sampleAnswers);
const sampleLine = [businessLabel[sampleAnswers.businessId], goalLabel[sampleAnswers.goalId], `channel: ${channelLabel.linkedin}`, teamLabel[sampleAnswers.teamId]].join(", ");

export default function Home() {
  return (
    <>
      <section className="grain relative -mx-4 -mt-8 overflow-hidden rounded-b-[2.5rem] border-b border-line px-4 pb-16 pt-10 md:pt-14">
        <HeroParticles />
        <div className="relative grid items-start gap-10 md:grid-cols-[1.25fr_0.85fr]">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bg/60 px-3 py-1 text-xs font-bold text-gold-strong backdrop-blur">
              Independent concept · Amman
            </p>
            <h1 className="rise rise-2 mt-5 text-4xl font-bold leading-[1.15] md:text-6xl">
              {brand.lead}
              <span className="mt-3 block text-2xl font-bold text-gold-strong md:text-3xl">A presence read from the record before it is told.</span>
            </h1>
            <p className="rise rise-3 mt-5 max-w-xl text-lg leading-8 text-muted">
              {published.experience}. The studio is the thirty-day planning engine from{" "}
              <a className="underline decoration-gold underline-offset-4" href={GHINA_ENGINE}>
                the Ghina Media concept
              </a>
              , retuned for quiet attraction: one message, evidence, and one ask.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <CtaLink href="/planner">
                Open the studio <ArrowRight size={18} aria-hidden />
              </CtaLink>
              <CtaLink href="/activities" ghost>
                Read the public record
              </CtaLink>
            </div>
          </div>
          <figure className="rise rise-2 mx-auto w-full max-w-sm">
            <Image
              src="/samir-portrait.png"
              alt="Portrait of Samir Yasser Abdelhadi as supplied by the owner of this concept"
              width={900}
              height={900}
              priority
              className="w-full"
            />
            <figcaption className="mt-3 text-sm leading-7 text-muted">{published.meta}</figcaption>
          </figure>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-[1.4fr_1fr]" aria-labelledby="gates">
        <Link href="/planner?goal=leads" data-gate="leads" className="card card-hover flex min-h-48 flex-col justify-between p-7">
          <div>
            <p className="text-sm font-bold text-gold-strong">Start here</p>
            <h2 id="gates" className="mt-2 text-3xl font-bold">One message before any platform.</h2>
            <p className="mt-3 max-w-xl text-sm leading-8 text-muted">Five questions, then recommendations from fixed rules and a thirty-day plan that stays in the browser until you send the brief yourself.</p>
          </div>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-gold-strong">
            Studio <ArrowRight size={16} aria-hidden />
          </span>
        </Link>
        <div className="grid gap-4">
          <Link href="/activities" className="card card-hover p-5">
            <ScrollText className="text-gold" size={22} aria-hidden />
            <p className="mt-3 font-bold">The record: {activities.length} sourced items</p>
            <p className="mt-1 text-sm text-muted">From Zad for Arts, the Jordan politics directory, and the current Senate page.</p>
          </Link>
          <Link href="/training" className="card card-hover p-5">
            <Quote className="text-gold" size={22} aria-hidden />
            <p className="mt-3 font-bold">The method</p>
            <p className="mt-1 text-sm text-muted">Public skills from marketingskills, applied here as rules, not promises.</p>
          </Link>
        </div>
      </section>

      <section aria-labelledby="sample" className="mt-20" data-reveal>
        <div className="card overflow-hidden">
          <div className="grid gap-8 p-6 md:grid-cols-[1fr_1.3fr] md:p-8">
            <div>
              <p className="inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">Illustrative example. Sample answers.</p>
              <h2 id="sample" className="mt-3 text-2xl font-bold">What the studio produces</h2>
              <p className="mt-3 text-sm leading-7 text-muted">For a sample visitor: {sampleLine}. The recommendations come from the same rules, and each reason is tied to an answer.</p>
              <div className="mt-6">
                <CtaLink href="/planner">Try the questions</CtaLink>
              </div>
            </div>
            <ol className="grid gap-3">
              {sample.recommendations.map((r) => (
                <li key={r.serviceId} className="rounded-2xl border border-line bg-bg/40 p-4">
                  <p className="flex items-center gap-2 font-bold">
                    <span className="grid size-7 place-items-center rounded-full bg-gold-soft text-xs text-gold-strong">{r.rank}</span>
                    {services.find((x) => x.id === r.serviceId)?.en}
                    {r.tier === "optional" && <span className="text-xs font-normal text-muted">(optional)</span>}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-muted">{r.reasons[0]}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="founder" className="mt-20 scroll-mt-24" aria-labelledby="founder-title">
        <p className="text-sm font-bold text-gold">Who he is in the written record</p>
        <h2 id="founder-title" className="mt-2 text-3xl font-bold">{brand.lead}</h2>
        <ul className="mt-6 grid gap-3 leading-8 md:grid-cols-2">
          {published.specialties.map((t) => (
            <li key={t} className="card p-5">{t}</li>
          ))}
        </ul>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-muted">{published.vision}</p>
      </section>

      <section className="mt-20">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">Three paths, not an agency catalogue</h2>
          <Link href="/services" className="inline-flex min-h-11 items-center text-sm font-bold text-gold-strong hover:underline">All paths</Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((g) => (
            <div key={g} className="card p-6">
              <p className="font-bold text-gold-strong">{groups[g]}</p>
              <ul className="mt-3 grid gap-2 text-sm">
                {services.filter((s) => s.group === g).map((s) => (
                  <li key={s.id}>{s.en}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          The writing method is from the{" "}
          <a className="underline" href={SKILLS_REPO}>marketingskills</a>
          {" "}repository under the MIT licence. The engine is from{" "}
          <a className="underline" href={GHINA_ENGINE}>ghina-media-concept</a>.
        </p>
      </section>

      <section className="relative mt-20 overflow-hidden rounded-3xl bg-gold p-8 text-bg md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">Write to him on WhatsApp when you are ready.</h2>
        <p className="mt-3 max-w-2xl leading-8">The link opens his chat. Nothing is sent until you press send inside WhatsApp.</p>
        <div className="mt-6">
          <a href={waLink("Hello, I saw the presence concept and would like to review it.")} target="_blank" rel="noopener noreferrer" className="btn bg-bg text-gold-strong hover:bg-raised">
            His WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
