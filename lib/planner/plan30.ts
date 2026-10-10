// قالب خطة 30 يوماً وتقويم محتوى أولي. كل ما هنا «اقتراح أولي» يعدّله الزائر بالكامل.
import { addDays } from "./dates.ts";
import type { AnswersV1, GoalId, Post, PostChannel, Task, TeamId } from "./types.ts";

type TaskSeed = Omit<Task, "id" | "owner" | "metric" | "done"> & { metric?: string };

const APPROVE_YOU = "اعتمادك قبل التنفيذ";
const APPROVE_AGENCY = "لا يُرسل شيء قبل موافقة المكتب";

const common: TaskSeed[] = [
  { phase: 1, title: "جلسة تشخيص وتحديد هدف قابل للقياس", approval: APPROVE_AGENCY, deliverable: "هدف واحد مكتوب ومقياس نجاحه", metric: "هدف مكتوب ومعتمد" },
  { phase: 1, title: "جرد القنوات الحالية وكلمات المرور والصلاحيات", approval: APPROVE_YOU, deliverable: "قائمة قنوات وصلاحيات محدثة" },
  { phase: 4, title: "مراجعة النتائج مقابل المقياس المختار", approval: APPROVE_YOU, deliverable: "ملخص ما نجح وما يتوقف", metric: "مقارنة قبل/بعد" },
  { phase: 4, title: "قرار الشهر التالي: استمرار، تعديل أو إيقاف", approval: APPROVE_YOU, deliverable: "قرار مكتوب" },
];

const byGoal: Record<GoalId, TaskSeed[]> = {
  leads: [
    { phase: 1, title: "تجهيز رقم واتساب ورسالة ترحيب للطلبات", approval: APPROVE_YOU, deliverable: "مسار طلب واضح من الإعلان إلى المحادثة" },
    { phase: 2, title: "إطلاق حملة تجريبية محدودة", approval: "اعتمادك للميزانية والنص قبل الإطلاق", deliverable: "حملة تعمل بقياس للطلبات", metric: "عدد المحادثات الجادة" },
    { phase: 3, title: "مراجعة الأسئلة المتكررة وتحسين الرسائل", approval: APPROVE_YOU, deliverable: "ردود جاهزة محدثة" },
  ],
  search: [
    { phase: 1, title: "تدقيق ظهور الموقع في البحث", approval: APPROVE_YOU, deliverable: "قائمة مشكلات مرتبة حسب الأثر" },
    { phase: 2, title: "تحسين عناوين الصفحات الأساسية ووصفها", approval: APPROVE_YOU, deliverable: "صفحات محدثة", metric: "ظهور الصفحات في Search Console" },
    { phase: 3, title: "حملة بحث صغيرة للكلمات الأهم أثناء انتظار الترتيب", approval: "اعتمادك للميزانية", deliverable: "كلمات مفتاحية مختبرة" },
  ],
  social: [
    { phase: 1, title: "اختيار منصة أو منصتين والتركيز عليهما", approval: APPROVE_YOU, deliverable: "قرار القنوات" },
    { phase: 2, title: "نشر محتوى منتظم وفق التقويم", approval: APPROVE_YOU, deliverable: "منشورات منشورة في مواعيدها", metric: "الالتزام بالجدول" },
    { phase: 3, title: "تحليل أكثر المنشورات تفاعلاً وتكرار نمطها", approval: APPROVE_YOU, deliverable: "ملاحظات قابلة للتطبيق" },
  ],
  identity: [
    { phase: 1, title: "جمع مراجع بصرية وما يعجبك وما لا يعجبك", approval: APPROVE_YOU, deliverable: "لوحة مراجع" },
    { phase: 2, title: "مراجعة مقترح الهوية أو القوالب", approval: APPROVE_YOU, deliverable: "قوالب معتمدة" },
    { phase: 3, title: "جلسة تصوير للمنتجات أو المكان", approval: APPROVE_AGENCY, deliverable: "مكتبة صور", metric: "عدد الصور الصالحة للنشر" },
  ],
  website: [
    { phase: 1, title: "تحديد صفحات الموقع ومحتواها", approval: APPROVE_YOU, deliverable: "خريطة صفحات" },
    { phase: 2, title: "مراجعة التصميم الأولي", approval: APPROVE_YOU, deliverable: "تصميم معتمد" },
    { phase: 3, title: "اختبار الموقع على الهاتف ومسار الطلب", approval: APPROVE_YOU, deliverable: "قائمة إصلاحات قبل الإطلاق", metric: "إكمال طلب تجريبي" },
  ],
  training: [
    { phase: 1, title: "تحديد المشاركين ومستوى كل منهم", approval: APPROVE_YOU, deliverable: "قائمة مشاركين واحتياجات" },
    { phase: 2, title: "الاتفاق على محاور الورشة وموعدها", approval: APPROVE_AGENCY, deliverable: "محاور وموعد" },
    { phase: 3, title: "تطبيق عملي لما تعلمه الفريق على حساباتكم", approval: APPROVE_YOU, deliverable: "مهام تطبيقية منجزة", metric: "مهام منجزة من الفريق" },
  ],
};

const byTeam: Partial<Record<TeamId, TaskSeed[]>> = {
  solo: [{ phase: 2, title: "تحديد ساعة أسبوعية ثابتة للتسويق", approval: APPROVE_YOU, deliverable: "موعد ثابت في التقويم" }],
  nobody: [{ phase: 1, title: "تحديد من سيتابع التسويق ولو جزئياً", approval: APPROVE_YOU, deliverable: "اسم مسؤول" }],
  team: [{ phase: 2, title: "توزيع الأدوار داخل الفريق", approval: APPROVE_YOU, deliverable: "جدول أدوار" }],
};

export const metricSuggestions = [
  "عدد المحادثات الجادة على واتساب",
  "عدد الطلبات المؤكدة",
  "الالتزام بجدول النشر",
  "زيارات الموقع",
  "ظهور الصفحات في البحث",
  "مهام منجزة من الفريق",
];

export function planTasks(a: AnswersV1, newId: () => string): Task[] {
  const seeds = [...common, ...byGoal[a.goalId], ...(byTeam[a.teamId] ?? [])];
  return seeds
    .map((s) => ({ ...s, id: newId(), owner: "", metric: s.metric ?? "", done: false }))
    .sort((x, y) => x.phase - y.phase);
}

const ideas: Record<GoalId, string[]> = {
  leads: ["سؤال يصل الناس كثيراً وإجابته من السجل", "كيف تصل رسالة إلى خط النقاش", "ما لا نجيب عنه في تعليق عام", "دعوة لقراءة المصدر قبل المراسلة"],
  search: ["جملة تعريف مع رابط المصدر", "بند من السجل بعنوان واضح", "اختلاف بين مصدرين مع الروابط", "سؤال وجواب من صفحة منشورة"],
  social: ["مشروع واحد من السجل هذا الأسبوع", "صورة مرفقة بإذن ومن زوّدها", "ما لن ننشره ولماذا", "سؤال واحد للجمهور"],
  identity: ["الجملة الأولى المعتمدة", "قالب المادة القادمة", "الصورة المستخدمة وإذنها", "ما يبقى ثابتاً في كل مادة"],
  website: ["الصفحات الثلاث الأولى", "أين يجد الزائر المصدر", "كيف يراسل خط النقاش", "ما لن تضعه الصفحة"],
  training: ["مشروع واحد سيُشرح في اللقاء", "سؤال يتكرر من الطلبة", "ما يُقال فقط إن كان منشوراً", "موعد المراجعة قبل أي إعلان"],
};

const cta: Record<GoalId, string> = {
  leads: "اقرأ السجل ثم راسل خط النقاش",
  search: "افتح المصدر",
  social: "اقرأ السجل",
  identity: "الجملة المعتمدة فقط",
  website: "زر صفحة المرجع",
  training: "اسأل عن اللقاء",
};

export function postChannels(a: AnswersV1): PostChannel[] {
  const real = a.channelIds.filter((c): c is PostChannel => c !== "none" && c !== "website");
  return real.length ? real : ["instagram"];
}

/** منشورات أولية على مدى 30 يوماً بإيقاع يناسب قدرة الفريق. */
export function planPosts(a: AnswersV1, startDate: string, newId: () => string): Post[] {
  const perWeek = a.teamId === "team" ? 4 : a.teamId === "one" ? 3 : 2;
  const step = 7 / perWeek;
  const chans = postChannels(a);
  const pool = ideas[a.goalId];
  const out: Post[] = [];
  for (let i = 0, day = 0; day < 30 && out.length < 60; i++, day = Math.round(i * step)) {
    out.push({
      id: newId(),
      date: addDays(startDate, day),
      channel: chans[i % chans.length],
      idea: pool[i % pool.length],
      goal: a.goalId === "leads" ? "طلبات" : a.goalId === "training" ? "تعلّم" : "حضور وتفاعل",
      cta: cta[a.goalId],
      status: "idea",
    });
  }
  return out;
}
