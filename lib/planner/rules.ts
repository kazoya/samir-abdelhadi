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
  { when: (a) => a.goalId === "leads", code: "goal:leads", add: { social: 3, sem: 3, consult: 1 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}” needs a clear search sentence and a place the dialogue can start. Not an open campaign.` },
  { when: (a) => a.goalId === "search", code: "goal:search", add: { seo: 3, sem: 2 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}”: the reference page first, then a sentence for people searching the name.` },
  { when: (a) => a.goalId === "social", code: "goal:social", add: { social: 3, graphic: 2, photo: 1 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}” depends on a steady pace, one template, and photographs with permission.` },
  { when: (a) => a.goalId === "identity", code: "goal:identity", add: { graphic: 3, photo: 2 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}” starts with approved text and a permitted photograph, before anything is published.` },
  { when: (a) => a.goalId === "website", code: "goal:website", add: { web: 3, seo: 2 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}”: a standing address that gathers the record, and a structure that can be quoted.` },
  { when: (a) => a.goalId === "training", code: "goal:training", add: { training: 3, meta: 2, coaching: 1 }, reason: (a) => `Your goal “${goalLabel[a.goalId]}” puts a teaching session and a watch on what is said ahead of a wide rollout.` },
  { when: (a) => a.businessId === "startup", code: "business:startup", add: { coaching: 1, consult: 1 }, reason: (a) => `Your audience “${businessLabel[a.businessId]}”: the message and the diagnosis come before a pile of materials.` },
  { when: (a) => a.businessId === "ecommerce", code: "business:ecommerce", add: { web: 1, sem: 1 }, reason: (a) => `Your audience “${businessLabel[a.businessId]}” needs a page they can find and a phrase they can search.` },
  { when: (a) => a.businessId === "medical", code: "business:medical", add: { social: 1 }, reason: (a) => `Your audience “${businessLabel[a.businessId]}”: explanatory materials are reviewed before publishing. No medical promise.` },
  { when: (a) => a.businessId === "education", code: "business:education", add: { training: 1 }, reason: (a) => `Your audience “${businessLabel[a.businessId]}” is closer to a session that explains one published project.` },
  { when: (a) => a.businessId === "personal", code: "business:personal", add: { coaching: 1, photo: 1 }, reason: (a) => `Your audience “${businessLabel[a.businessId]}”: the photograph needs permission, and the accompaniment is for the person who approves the text.` },
  { when: (a) => a.teamId === "solo" || a.teamId === "nobody", code: "team:solo-or-nobody", add: { coaching: 2 }, reason: (a) => `Your answer “${teamLabel[a.teamId]}” means the work needs a pace one person can keep.` },
  { when: (a) => a.teamId === "team", code: "team:team", add: { meta: 1, training: 1 }, reason: (a) => `You have “${teamLabel[a.teamId]}”: raising the team’s skill raises the effect of any path.` },
  { when: (a) => !has(a, "website") && a.goalId !== "training", code: "channel:no-website", add: { web: 1 }, reason: () => `You did not choose “${channelLabel.website}” among the channels you have now.` },
  { when: (a) => has(a, "none"), code: "channel:none", add: { social: 1 }, reason: () => `You chose “${channelLabel.none}”: the nearest place to start is usually one social page.` },
  { when: () => true, code: "baseline:consult", add: { consult: 1 }, reason: () => "A short diagnosis session is a shared starting point for any plan." },
];

const catalogOrder = new Map(services.map((s, i) => [s.id, i]));

const detail: Record<ServiceId, { prerequisites: string[]; deliverable: string }> = {
  sem: { prerequisites: ["An approved sentence about the name", "A link to the record"], deliverable: "A search phrase and a link. No advertising budget in this concept." },
  seo: { prerequisites: ["A written source list", "Someone who approves an addition"], deliverable: "A reference page where every item has a source" },
  social: { prerequisites: ["A chosen platform", "Someone who replies"], deliverable: "A publishing table that waits for approval" },
  graphic: { prerequisites: ["Examples of current materials"], deliverable: "One template for text and image" },
  photo: { prerequisites: ["Permission to use the photograph"], deliverable: "An archive that publishes only what is allowed" },
  web: { prerequisites: ["A domain decision", "The first three pages"], deliverable: "A standing page for the name" },
  training: { prerequisites: ["A host and a length", "One project from the record"], deliverable: "Session themes, with no invented certificate" },
  meta: { prerequisites: ["Links to what appeared this week"], deliverable: "A classification: confirmed, disputed, or unsourced" },
  courses: { prerequisites: ["Three questions a visitor asks"], deliverable: "Three short explainers" },
  consult: { prerequisites: ["The person who approves the text"], deliverable: "A message: a promise, three proofs, one ask" },
  coaching: { prerequisites: ["A weekly time"], deliverable: "A review of drafts. No automatic publishing." },
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
        why: hit ? `It scored lower (${hit.score}) than the paths that were chosen. It can wait for a later phase.` : "It did not connect to any of your answers. It can be added later if the goal changes.",
      };
    });
  return { recommendations, notChosen };
}

export function checklist(a: AnswersV1): ChecklistItem[] {
  return [
    { code: "social", label: "A social platform account", ok: has(a, "facebook") || has(a, "instagram") || has(a, "linkedin") },
    { code: "website", label: "A website", ok: has(a, "website") },
    { code: "whatsapp", label: "WhatsApp ready to receive questions", ok: has(a, "whatsapp") },
    { code: "owner", label: "A person who runs the work", ok: a.teamId !== "nobody" },
    { code: "timeline", label: "A start date", ok: a.timelineId !== "exploring" },
  ];
}

export function gaps(a: AnswersV1): Gap[] {
  const out: Gap[] = [];
  if (!has(a, "website") && a.goalId !== "training")
    out.push({ code: "no-website", text: "There may be no standing page that gathers visitors. Worth discussing for this audience. A standing page is the linked path.", linkedServiceId: "web" });
  if (!has(a, "whatsapp")) out.push({ code: "no-whatsapp", text: "Questions may be lost without a WhatsApp line ready to receive them." });
  if (has(a, "none")) out.push({ code: "no-channels", text: "There is no channel yet. Starting with one is easier than starting with several.", linkedServiceId: "social" });
  if (a.teamId === "nobody" || a.teamId === "solo") out.push({ code: "single-owner", text: "The work depends on one person, or on nobody. A steady pace matters more than volume.", linkedServiceId: "coaching" });
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
      "The recommendations come from fixed rules published on this site. This is not an AI analysis and not a statement from an office.",
      "No prices and no promises of results. Later publishing is approved by a person. The WhatsApp link opens a chat and does not send by itself.",
      "The plan and the calendar are first drafts you can edit completely.",
    ],
  };
}
