import type { Metadata } from "next";
import { FileText, Globe2, Inbox, ScanSearch } from "lucide-react";
import { PageHead } from "@/components/ui";

export const metadata: Metadata = { title: "فرص تالية" };

const items = [
  {
    icon: Inbox,
    t: "اعتماد الموجز قبل أي مادة",
    now: "الاستوديو يصدّر موجزاً يبقى في المتصفح.",
    next: "المكتب يعلّم ما يُنشر وما يُؤجل.",
    gate: "لا نشر من هذه الصفحة.",
  },
  {
    icon: Globe2,
    t: "نطاق باسم واضح",
    now: "الرابط الحالي عنوان تصور على Vercel.",
    next: "نطاق يختاره المكتب بعد مراجعة النص.",
    gate: "شراء النطاق والملكية قرار بشري.",
  },
  {
    icon: FileText,
    t: "إغلاق اختلاف سنة التخرج ورقم المجلس",
    now: "السجل يعرض الاختلاف ولا يختاره.",
    next: "جملة واحدة يوافق عليها صاحب السيرة.",
    gate: "لا تُستبدل المصادر بذاكرة شفهية.",
  },
  {
    icon: ScanSearch,
    t: "رصد أسبوعي لما يُقال",
    now: "لا يوجد جمع آلي للأخبار.",
    next: "قائمة روابط يصنفها شخص: مؤكد، مختلف، أو بلا مصدر.",
    gate: "لا يُنشر الرصد بلا مراجعة.",
  },
];

export default function OpportunitiesPage() {
  return (
    <>
      <PageHead kicker="فرص تالية" title="ما يمكن أن يُستكمل بعد هذا التصور">
        <p>اقتراحات للعمل التالي. كل واحدة تتوقف عند موافقة بشرية.</p>
      </PageHead>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <article key={it.t} className="card p-6">
            <it.icon className="text-gold" size={26} aria-hidden />
            <h2 className="mt-3 text-lg font-bold">{it.t}</h2>
            <p className="mt-3 text-sm leading-7 text-muted">الآن: {it.now}</p>
            <p className="mt-2 text-sm leading-7">التالي: {it.next}</p>
            <p className="mt-3 text-sm font-bold text-gold-strong">{it.gate}</p>
          </article>
        ))}
      </div>
    </>
  );
}
