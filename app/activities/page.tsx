import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { PageHead, Source } from "@/components/ui";
import { activities, relationships, ZAD } from "@/lib/site";

export const metadata: Metadata = { title: "السجل العلني" };

const relationNote: Record<(typeof relationships)[number], string> = {
  "سيرة منشورة": "صياغة مأخوذة من الصفحة المذكورة، لا من ذاكرة هذا التصور.",
  "عطاء مذكور": "مشاريع ومنح ذكرتها الصفحة. لا نضيف مبلغاً ولا تاريخاً لم يُكتب فيها.",
  "عضوية مذكورة": "مجالس وجوائز كما سمّتها الصفحة.",
  "ما اختلفت فيه المصادر": "الاختلاف معروض كما هو. لا نختار رقماً ليبدو السجل أنظف.",
};

const story = [
  { k: "السياق", v: "جملة تعريف بلا مصدر، وصورة بلا إذن." },
  { k: "المساهمة", v: "ربط الجملة بصفحة، وتأجيل الصورة حتى يصل الإذن." },
  { k: "المخرجات", v: "بند في السجل ورابط، لا منشور يُرسل وحده." },
  { k: "الدليل", v: "في حالة حقيقية: رابط الصفحة المنشورة." },
  { k: "النتيجة", v: "لا تُذكر نتيجة إلا برقم يوافق صاحبه على نشره." },
];

export default function ActivitiesPage() {
  return (
    <>
      <PageHead kicker="السجل العلني" title="ما كُتب في صفحات يمكن فتحها">
        <p>كل بند يحمل رابطه. المشاركة في ذكر اسم ليست شراكة، والاختلاف بين المصادر يبقى ظاهراً.</p>
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
                      المصدر <ExternalLink size={12} aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <section aria-labelledby="story" className="mt-16">
        <h2 id="story" className="text-xl font-bold">قالب مادة صادقة</h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">لا نعرض عميلاً ولا نتيجة. هذا قالب لما يمكن أن يُكتب لاحقاً بإذن.</p>
        <div className="card mt-5 p-6" data-illustrative>
          <p className="mb-4 inline-block rounded-full bg-gold-soft px-3 py-1 text-xs font-bold text-gold-strong">حالة توضيحية — ليست عميلاً حقيقياً ولا نتيجة فعلية</p>
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
      <Source page="زاد الفنون، صندوق سمير عبدالهادي" href={ZAD} />
    </>
  );
}
