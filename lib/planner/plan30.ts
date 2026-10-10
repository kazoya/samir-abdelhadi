// قالب خطة 30 يوماً وتقويم محتوى أولي. كل ما هنا «اقتراح أولي» يعدّله الزائر بالكامل.
import { addDays } from "./dates.ts";
import type { AnswersV1, GoalId, Post, PostChannel, Task, TeamId } from "./types.ts";

type TaskSeed = Omit<Task, "id" | "owner" | "metric" | "done"> & { metric?: string };

const APPROVE_YOU = "Your approval before anything is done";
const APPROVE_AGENCY = "Nothing is sent before the office agrees";

const common: TaskSeed[] = [
  { phase: 1, title: "A diagnosis session and one measurable goal", approval: APPROVE_AGENCY, deliverable: "One written goal and how it will be judged", metric: "A written, approved goal" },
  { phase: 1, title: "List the current channels, access, and who can post", approval: APPROVE_YOU, deliverable: "An updated list of channels and access" },
  { phase: 4, title: "Review results against the chosen measure", approval: APPROVE_YOU, deliverable: "A note on what worked and what stops", metric: "A before and after comparison" },
  { phase: 4, title: "Decide the next month: continue, adjust, or stop", approval: APPROVE_YOU, deliverable: "A written decision" },
];

const byGoal: Record<GoalId, TaskSeed[]> = {
  leads: [
    { phase: 1, title: "Prepare the WhatsApp number and a first reply", approval: APPROVE_YOU, deliverable: "A clear path from the page to the conversation" },
    { phase: 2, title: "Try one limited public piece", approval: "Your approval of the text before it goes out", deliverable: "One piece with a count of serious conversations", metric: "Serious conversations" },
    { phase: 3, title: "Review repeated questions and improve the replies", approval: APPROVE_YOU, deliverable: "Updated ready replies" },
  ],
  search: [
    { phase: 1, title: "Check how the name appears in search", approval: APPROVE_YOU, deliverable: "A list of problems ordered by effect" },
    { phase: 2, title: "Improve the titles and descriptions of the core pages", approval: APPROVE_YOU, deliverable: "Updated pages", metric: "Pages visible in Search Console" },
    { phase: 3, title: "A small search test for the most important phrases while ranking catches up", approval: "Your approval of any spend", deliverable: "Phrases that were tested" },
  ],
  social: [
    { phase: 1, title: "Choose one or two platforms and stay with them", approval: APPROVE_YOU, deliverable: "A channel decision" },
    { phase: 2, title: "Publish on the calendar", approval: APPROVE_YOU, deliverable: "Posts that went out on their dates", metric: "Keeping the schedule" },
    { phase: 3, title: "Look at the posts people answered and repeat that pattern", approval: APPROVE_YOU, deliverable: "Notes you can use" },
  ],
  identity: [
    { phase: 1, title: "Gather visual references: what fits and what does not", approval: APPROVE_YOU, deliverable: "A reference board" },
    { phase: 2, title: "Review the identity proposal or the templates", approval: APPROVE_YOU, deliverable: "Approved templates" },
    { phase: 3, title: "A photography session for the work or the place", approval: APPROVE_AGENCY, deliverable: "A photo library", metric: "Photographs cleared to publish" },
  ],
  website: [
    { phase: 1, title: "Name the pages and what each one says", approval: APPROVE_YOU, deliverable: "A page map" },
    { phase: 2, title: "Review the first design", approval: APPROVE_YOU, deliverable: "An approved design" },
    { phase: 3, title: "Test the site on a phone and the path to a message", approval: APPROVE_YOU, deliverable: "A fix list before launch", metric: "A trial message completed" },
  ],
  training: [
    { phase: 1, title: "Name the participants and the level of each", approval: APPROVE_YOU, deliverable: "A list of people and what they need" },
    { phase: 2, title: "Agree the session themes and the date", approval: APPROVE_AGENCY, deliverable: "Themes and a date" },
    { phase: 3, title: "Apply what the team learned on your own accounts", approval: APPROVE_YOU, deliverable: "Practice tasks finished", metric: "Tasks the team finished" },
  ],
};

const byTeam: Partial<Record<TeamId, TaskSeed[]>> = {
  solo: [{ phase: 2, title: "Set one fixed weekly hour for the work", approval: APPROVE_YOU, deliverable: "A fixed time on the calendar" }],
  nobody: [{ phase: 1, title: "Name who will follow the work, even part of the time", approval: APPROVE_YOU, deliverable: "A named owner" }],
  team: [{ phase: 2, title: "Split roles inside the team", approval: APPROVE_YOU, deliverable: "A role table" }],
};

export const metricSuggestions = [
  "Serious WhatsApp conversations",
  "Confirmed requests",
  "Keeping the publishing schedule",
  "Site visits",
  "Pages appearing in search",
  "Tasks the team finished",
];

export function planTasks(a: AnswersV1, newId: () => string): Task[] {
  const seeds = [...common, ...byGoal[a.goalId], ...(byTeam[a.teamId] ?? [])];
  return seeds
    .map((s) => ({ ...s, id: newId(), owner: "", metric: s.metric ?? "", done: false }))
    .sort((x, y) => x.phase - y.phase);
}

const ideas: Record<GoalId, string[]> = {
  leads: ["A question people ask often, answered from the record", "How a message reaches the discussion line", "What we do not answer in a public comment", "An invitation to read the source before writing"],
  search: ["A defining sentence with a link to the source", "One record item with a clear title", "A difference between two sources, with both links", "A question and answer from a published page"],
  social: ["One project from the record this week", "A photograph with permission, and who supplied it", "What we will not publish, and why", "One question for the audience"],
  identity: ["The approved first sentence", "The template for the next piece", "The photograph in use, and its permission", "What stays the same in every piece"],
  website: ["The first three pages", "Where the visitor finds the source", "How to write on the discussion line", "What the page will not include"],
  training: ["One project the session will explain", "A question students repeat", "What is said only if it is published", "A review time before any announcement"],
};

const cta: Record<GoalId, string> = {
  leads: "Read the record, then write on the discussion line",
  search: "Open the source",
  social: "Read the record",
  identity: "The approved sentence only",
  website: "Visit the reference page",
  training: "Ask about the session",
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
      goal: a.goalId === "leads" ? "Dialogue" : a.goalId === "training" ? "Learning" : "Presence",
      cta: cta[a.goalId],
      status: "idea",
    });
  }
  return out;
}
