import type { Metadata } from "next";
import { GraduationCap, MessageCircle } from "lucide-react";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { published, services, SKILLS_REPO, trainingPaths, trainings, waLink } from "@/lib/site";

export const metadata: Metadata = { title: "منهج الجذب" };

export default function TrainingPage() {
  return (
    <>
      <PageHead kicker="منهج الجذب" title="قواعد علنية، لا وعود حملة">
        <p>{published.meta} المسارات تجميع من هذا التصور. ليست برامج معلنة باسم العين، ولا مواعيد ولا شهادات.</p>
      </PageHead>
      <section aria-labelledby="paths">
        <h2 id="paths" className="text-xl font-bold">ثلاثة مسارات</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
          مأخوذة من أفكار مهارات التسويق المفتوحة في{" "}
          <a className="underline" href={SKILLS_REPO}>marketingskills</a>
          {" "}(نص، بحث، وعرض) بعد اختصارها لما يليق بحضور عام. ليست برامج معلنة من غنى ميديا ولا من أي مكتب.
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
              <p className="mt-4 text-sm">{p.serviceIds.map((id) => services.find((s) => s.id === id)?.ar).join("، ")}</p>
              <a
                href={waLink(`مرحباً، أراجع مسار «${p.title}» في تصور حضور عبدالهادي.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost mt-5 text-sm"
              >
                <MessageCircle size={16} aria-hidden /> راجع هذا المسار
              </a>
            </article>
          ))}
        </div>
      </section>
      <section aria-labelledby="delivered" className="mt-14">
        <h2 id="delivered" className="text-xl font-bold">القواعد الثماني</h2>
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
          <p className="text-lg font-bold">تريد تطبيق المنهج على مادة محددة؟</p>
          <p className="mt-1 text-sm text-muted">الرابط يفتح واتسابه. لا موعد يُحجز من هذه الصفحة.</p>
        </div>
        <CtaLink href={waLink("مرحباً، أريد مراجعة منهج حضور عبدالهادي على مادة محددة.")}>افتح واتساب</CtaLink>
      </section>
      <Source page="marketingskills على GitHub، التزام مفتوح برخصة MIT" href={SKILLS_REPO} />
    </>
  );
}
