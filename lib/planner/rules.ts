// محرك التوصيات: قواعد ثابتة معلنة، ليست ذكاءً اصطناعياً ولا رأي خبير بشري.
// الثوابت: نفس المدخلات + نفس RULE_VERSION → نفس الترتيب ونفس reasonCodes؛ لا خدمة مكررة؛ لا serviceId مفقود.
import { services, type ServiceId } from "../site.ts";
import { businessLabel, channelLabel, goalLabel, teamLabel } from "./dict.ts";
import type { AnswersV1, ChecklistItem, Gap, PlanV1, ReasonCode, Recommendation } from "./types.ts";

export const RULE_VERSION = "2026-09-29.1";
export const MAX_CORE = 3;
export const MAX_OPTIONAL = 1;

type Rule = { when: (a: AnswersV1) => boolean; code: ReasonCode; add: Partial<Record<ServiceId, number>>; reason: (a: AnswersV1) => string };

const has = (a: AnswersV1, c: AnswersV1["channelIds"][number]) => a.channelIds.includes(c);

// كل قاعدة تشرح نفسها بالإجابة التي أطلقتها
export const RULES: Rule[] = [
  { when: (a) => a.goalId === "leads", code: "goal:leads", add: { social: 3, sem: 3, consult: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يحتاج جملة بحث واضحة ومكاناً يصل منه الحوار، لا حملة مفتوحة.` },
  { when: (a) => a.goalId === "search", code: "goal:search", add: { seo: 3, sem: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}»: الصفحة المرجعية أولاً، ثم جملة تظهر لمن يبحث عن الاسم.` },
  { when: (a) => a.goalId === "social", code: "goal:social", add: { social: 3, graphic: 2, photo: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يعتمد على إيقاع ثابت وقالب واحد وصور بإذن.` },
  { when: (a) => a.goalId === "identity", code: "goal:identity", add: { graphic: 3, photo: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يبدأ بالنص المعتمد والصورة المسموحة قبل أي نشر.` },
  { when: (a) => a.goalId === "website", code: "goal:website", add: { web: 3, seo: 2 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}»: عنوان ثابت يجمع السجل، وبنية تساعد الاقتباس.` },
  { when: (a) => a.goalId === "training", code: "goal:training", add: { training: 3, meta: 2, coaching: 1 }, reason: (a) => `هدفك «${goalLabel[a.goalId]}» يقدّم لقاء شرح ورصد ما يُقال على التنفيذ الواسع.` },
  { when: (a) => a.businessId === "startup", code: "business:startup", add: { coaching: 1, consult: 1 }, reason: (a) => `جمهورك «${businessLabel[a.businessId]}»: الرسالة والتشخيص يسبقان كثرة المواد.` },
  { when: (a) => a.businessId === "ecommerce", code: "business:ecommerce", add: { web: 1, sem: 1 }, reason: (a) => `جمهورك «${businessLabel[a.businessId]}» يحتاج صفحة يجدها وعبارة يبحث بها.` },
  { when: (a) => a.businessId === "medical", code: "business:medical", add: { social: 1 }, reason: (a) => `جمهورك «${businessLabel[a.businessId]}»: المواد التوضيحية تُراجع قبل النشر، بلا وعد طبي.` },
  { when: (a) => a.businessId === "education", code: "business:education", add: { training: 1 }, reason: (a) => `جمهورك «${businessLabel[a.businessId]}» أقرب إلى لقاء يشرح مشروعاً منشوراً.` },
  { when: (a) => a.businessId === "personal", code: "business:personal", add: { coaching: 1, photo: 1 }, reason: (a) => `جمهورك «${businessLabel[a.businessId]}»: الصورة بإذن، والمرافقة لمن يعتمد النص.` },
  { when: (a) => a.teamId === "solo" || a.teamId === "nobody", code: "team:solo-or-nobody", add: { coaching: 2 }, reason: (a) => `إجابتك «${teamLabel[a.teamId]}» تعني أن التسويق يحتاج إيقاعاً يستطيع شخص واحد الالتزام به.` },
  { when: (a) => a.teamId === "team", code: "team:team", add: { meta: 1, training: 1 }, reason: (a) => `لديك «${teamLabel[a.teamId]}»: رفع مهارات الفريق يضاعف أثر أي خدمة.` },
  { when: (a) => !has(a, "website") && a.goalId !== "training", code: "channel:no-website", add: { web: 1 }, reason: () => `لم تختر «${channelLabel.website}» ضمن قنواتك الحالية.` },
  { when: (a) => has(a, "none"), code: "channel:none", add: { social: 1 }, reason: () => `اخترت «${channelLabel.none}»: أقرب قناة للبدء عادة صفحة على التواصل الاجتماعي.` },
  { when: () => true, code: "baseline:consult", add: { consult: 1 }, reason: () => "جلسة تشخيص قصيرة نقطة بداية مشتركة لأي خطة." },
];

const catalogOrder = new Map(services.map((s, i) => [s.id, i]));

const detail: Record<ServiceId, { prerequisites: string[]; deliverable: string }> = {
  sem: { prerequisites: ["جملة معتمدة عن الاسم", "رابط السجل"], deliverable: "عبارة بحث ورابط، بلا ميزانية إعلان في هذا التصور" },
  seo: { prerequisites: ["قائمة مصادر مكتوبة", "من يعتمد الإضافة"], deliverable: "صفحة مرجع كل بند فيها مصدر" },
  social: { prerequisites: ["منصة مختارة", "من يرد"], deliverable: "جدول نشر ينتظر الاعتماد" },
  graphic: { prerequisites: ["أمثلة مواد حالية"], deliverable: "قالب واحد للنص والصورة" },
  photo: { prerequisites: ["إذن استخدام الصورة"], deliverable: "أرشيف لا يُنشر منه إلا المسموح" },
  web: { prerequisites: ["قرار النطاق", "ثلاث صفحات أولى"], deliverable: "صفحة ثابتة للاسم" },
  training: { prerequisites: ["جهة ومدة", "مشروع واحد من السجل"], deliverable: "محاور لقاء بلا شهادة مخترعة" },
  meta: { prerequisites: ["روابط ما ظهر هذا الأسبوع"], deliverable: "تصنيف: مؤكد، مختلف فيه، أو بلا مصدر" },
  courses: { prerequisites: ["ثلاثة أسئلة يطرحها الزائر"], deliverable: "ثلاث قطع شرح قصيرة" },
  consult: { prerequisites: ["من يعتمد النص"], deliverable: "رسالة: وعد، ثلاثة أدلة، دعوة واحدة" },
  coaching: { prerequisites: ["موعد أسبوعي"], deliverable: "مراجعة مسودات لا نشر آلي" },
};

export function recommend(a: AnswersV1): { recommendations: Recommendation[]; notChosen: PlanV1["notChosen"] } {
  const acc = new Map<ServiceId, { score: number; codes: ReasonCode[]; reasons: string[] }>();
  for (const rule of RULES) {
    if (!rule.when(a)) continue;
    const text = rule.reason(a);
    for (const [id, pts] of Object.entries(rule.add) as [ServiceId, number][]) {
      const cur = acc.get(id) ?? { score: 0, codes: [], reasons: [] };
      cur.score += pts;
      cur.codes.push(rule.code);
      cur.reasons.push(text);
      acc.set(id, cur);
    }
  }
  // ترتيب حتمي: الدرجة تنازلياً ثم ترتيب الكتالوج — لا يعتمد على ترتيب إضافة القواعد
  const ranked = [...acc.entries()]
    .filter(([id]) => catalogOrder.has(id))
    .sort(([ia, x], [ib, y]) => y.score - x.score || catalogOrder.get(ia)! - catalogOrder.get(ib)!);

  const recommendations: Recommendation[] = ranked.slice(0, MAX_CORE + MAX_OPTIONAL).map(([serviceId, v], i) => ({
    serviceId,
    rank: i + 1,
    tier: i < MAX_CORE ? "core" : "optional",
    score: v.score,
    reasonCodes: v.codes,
    reasons: v.reasons,
    ...detail[serviceId],
  }));

  const chosen = new Set(recommendations.map((r) => r.serviceId));
  const notChosen = services
    .filter((s) => !chosen.has(s.id))
    .map((s) => {
      const hit = acc.get(s.id);
      return {
        serviceId: s.id,
        why: hit ? `ارتبطت بإجاباتك بدرجة أقل (${hit.score}) من الخدمات المختارة؛ مرشّحة لمرحلة لاحقة.` : "لم ترتبط بأي من إجاباتك؛ يمكن إضافتها لاحقاً إن تغيّر الهدف.",
      };
    });
  return { recommendations, notChosen };
}

export function checklist(a: AnswersV1): ChecklistItem[] {
  return [
    { code: "social", label: "حساب على منصة تواصل اجتماعي", ok: has(a, "facebook") || has(a, "instagram") || has(a, "linkedin") },
    { code: "website", label: "موقع إلكتروني", ok: has(a, "website") },
    { code: "whatsapp", label: "واتساب للأعمال لاستقبال الطلبات", ok: has(a, "whatsapp") },
    { code: "owner", label: "شخص يدير التسويق", ok: a.teamId !== "nobody" },
    { code: "timeline", label: "موعد بدء محدد", ok: a.timelineId !== "exploring" },
  ];
}

export function gaps(a: AnswersV1): Gap[] {
  const out: Gap[] = [];
  if (!has(a, "website") && a.goalId !== "training")
    out.push({ code: "no-website", text: "قد لا يوجد مكان ثابت يجمع الزوار ويحوّلهم إلى طلبات — للنقاش حسب طبيعة نشاطك.", linkedServiceId: "web" });
  if (!has(a, "whatsapp")) out.push({ code: "no-whatsapp", text: "قد تضيع استفسارات دون قناة واتساب منظّمة لاستقبالها." });
  if (has(a, "none")) out.push({ code: "no-channels", text: "لا توجد قناة قائمة بعد؛ البداية بقناة واحدة أسهل من عدة قنوات.", linkedServiceId: "social" });
  if (a.teamId === "nobody" || a.teamId === "solo") out.push({ code: "single-owner", text: "التسويق يعتمد على شخص واحد أو لا أحد؛ الإيقاع الثابت أهم من الكثافة.", linkedServiceId: "coaching" });
  return out;
}

export function buildPlan(a: AnswersV1): PlanV1 {
  const { recommendations, notChosen } = recommend(a);
  return {
    ruleVersion: RULE_VERSION,
    inputs: a,
    recommendations,
    notChosen,
    gaps: gaps(a),
    checklist: checklist(a),
    assumptions: [
      "التوصيات ناتجة عن قواعد ثابتة معلنة في هذه المنصة، وليست تحليلاً بالذكاء الاصطناعي ولا بياناً من مكتب العين.",
      "لا أسعار ولا وعود بنتائج. أي نشر لاحق يعتمد بشرياً. رابط الواتساب يفتح محادثة ولا يرسل وحده.",
      "الخطة والتقويم قوالب أولية قابلة للتعديل الكامل.",
    ],
  };
}
