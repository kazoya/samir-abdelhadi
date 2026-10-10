// السجل المكتوب من صفحات علنية فُحصت في 2026-10-10.
// الصورة في public/samir-portrait.png زوّدها صاحب التصور، وليست من تلك الصفحات.
// واتساب العين زوّده صاحب التصور في 2026-10-10. ليس مأخوذاً من صفحة مجلس الأعيان.
import type { GoalId } from "./planner/types.ts";

export const ZAD = "https://www.zadforarts.com/samir-abdul-hadi-fund-for-culture-and-arts";
export const DIRECTORY = "http://www.jordanpolitics.org/ar/senate-member/199/%D8%B3%D9%85%D9%8A%D8%B1-%D9%86%D8%B9%D9%8A%D9%85-%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%87%D8%A7%D8%AF%D9%8A/9";
export const SENATE_NOW = "https://senate.jo/Ar/List/%D8%A7%D8%B9%D8%B6%D8%A7%D8%A1_%D8%A7%D9%84%D9%85%D8%AC%D9%84%D8%B3_%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D9%8A_%D9%88%D8%A7%D9%84%D8%B3%D9%8A%D8%B1_%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9";
export const GHINA_ENGINE = "https://github.com/kazoya/ghina-media-concept";
export const SKILLS_REPO = "https://github.com/coreyhaines31/marketingskills";

export const brand = {
  nameAr: "Abdelhadi Presence",
  nameEn: "Abdelhadi Presence",
  lead: "Samir Yasser Abdelhadi",
  site: ZAD,
  phoneDisplay: "+962 7 9555 5772",
  phoneDigits: "962795555772",
  tel: "tel:+962795555772",
  whatsappUrl: "https://wa.me/962795555772",
  email: "",
  addressAr: "Amman, Jordan",
  addressEn: "Amman, Jordan",
  hours: "Not published",
  socials: [] as { label: string; href: string }[],
} as const;

export const developer = {
  name: "Eng. Suhaib Al-Saleh",
  whatsappDigits: "962787523192",
  whatsappUrl: "https://wa.me/962787523192",
} as const;

export const disclaimer = "Independent concept. Not an official site.";

export const nav = [
  { href: "/", label: "Home" },
  { href: "/planner", label: "Studio" },
  { href: "/services", label: "Paths" },
  { href: "/activities", label: "Record" },
  { href: "/training", label: "Method" },
  { href: "/opportunities", label: "Next" },
  { href: "/contact", label: "Contact" },
] as const;

export function waLink(text: string, digits: string = brand.phoneDigits) {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const published = {
  experience: "Samir Yasser Abdelhadi, as the Zad for Arts page describes the engineer: born in Jerusalem, a civil engineer, and founder of a Jordan company in 1980",
  specialties: ["Engineering and projects", "Culture and arts", "Education", "Documented giving"],
  vision: "A public presence that is read from the record before it is told. One message, evidence from published pages, and one clear ask.",
  mission: "Arrange what is said about the name so a searcher reaches a source, not a floating sentence.",
  meta: "The portrait on this page was supplied by the owner of the concept. The written record comes from the public pages cited here. This page does not claim the portrait appears on those pages.",
};

export type ServiceId =
  | "sem"
  | "seo"
  | "social"
  | "graphic"
  | "photo"
  | "web"
  | "training"
  | "meta"
  | "courses"
  | "consult"
  | "coaching";

export const services: { id: ServiceId; ar: string; en: string; desc: string; group: "grow" | "create" | "learn" }[] = [
  { id: "sem", ar: "Name search", en: "Name search", desc: "One sentence for people searching the name now, with a link into the record.", group: "grow" },
  { id: "seo", ar: "Citable record", en: "Citable record", desc: "Facts attributed to their sources, so search and assistants quote one page.", group: "grow" },
  { id: "social", ar: "Public channels", en: "Public channels", desc: "One or two platforms, at a pace the office can keep. No forced daily posts.", group: "grow" },
  { id: "graphic", ar: "Quiet templates", en: "Quiet templates", desc: "One template for text and image. No colour campaign competing with the name.", group: "create" },
  { id: "photo", ar: "Permitted archive", en: "Permitted archive", desc: "No photograph is published without permission. The current portrait was supplied by the concept owner.", group: "create" },
  { id: "web", ar: "Standing page", en: "Standing page", desc: "One address that gathers the biography, the sources, and how to write.", group: "create" },
  { id: "training", ar: "Knowledge sessions", en: "Knowledge sessions", desc: "A session that explains one published project. Not a course with an invented certificate.", group: "learn" },
  { id: "meta", ar: "What is being said", en: "What is being said", desc: "Collect what appears about the name and mark it confirmed, disputed, or unsourced.", group: "learn" },
  { id: "courses", ar: "Short explainers", en: "Short explainers", desc: "Short pieces that answer one question. Each piece points to a source.", group: "learn" },
  { id: "consult", ar: "Message house", en: "Message house", desc: "One promise, three proofs, one ask. Approved before anything is published.", group: "grow" },
  { id: "coaching", ar: "Office rhythm", en: "Office rhythm", desc: "A fixed hour to review what will be published. This page does not publish it.", group: "learn" },
];

export const groups = {
  grow: "Reach and message",
  create: "Materials",
  learn: "Learn and enable",
} as const;

export const trainings = [
  "One message in the first sentence",
  "Three proofs, and only from the record",
  "One audience in each piece",
  "One ask: read the source, or write on the discussion line",
  "Where sources differ, show the difference, not a single fact",
  "No number, partner, or result without a published page",
  "A photograph needs permission, and the caption says who supplied it",
  "The next wave waits for the office to approve it",
];

export type Relationship = "Published biography" | "Giving mentioned" | "Membership mentioned" | "Where sources differ";
export const relationships: Relationship[] = ["Published biography", "Giving mentioned", "Membership mentioned", "Where sources differ"];

export const activities: {
  text: string;
  relationship: Relationship;
  theme: "Biography" | "Giving" | "Education" | "Membership";
  sourceUrl: string;
  evidence: "published";
}[] = [
  { text: "The Zad for Arts page says engineer Samir Abdelhadi was born in Jerusalem in 1942 and studied civil engineering at the American University of Beirut.", relationship: "Published biography", theme: "Biography", sourceUrl: ZAD, evidence: "published" },
  { text: "The same page says his father, Naeem Abdelhadi, held political and administrative posts, and that Samir was educated at the Friends School in Ramallah. This concept uses Yasser as the middle name supplied for the page. The cited pages print Naeem.", relationship: "Published biography", theme: "Biography", sourceUrl: ZAD, evidence: "published" },
  { text: "In 1980 he founded a Jordan company named Ilmi and Abdelhadi, after work in Libya and the UAE with the Engineering Consortium, Khateeb and Alami.", relationship: "Published biography", theme: "Biography", sourceUrl: ZAD, evidence: "published" },
  { text: "The Samir Abdelhadi Fund for Culture and Arts gave a grant to the Arab Cultural Society that helped found Zad for Arts in 2023.", relationship: "Giving mentioned", theme: "Giving", sourceUrl: ZAD, evidence: "published" },
  { text: "Giving named on the page includes an arts centre in Zarqa with the Ministry of Culture, the mathematics faculty building at Birzeit University, a pitch and fitness centre at Hittin camp, a vocational centre at Gaza camp in Jerash, and an architecture lab at Al-Hussein Technical University.", relationship: "Giving mentioned", theme: "Education", sourceUrl: ZAD, evidence: "published" },
  { text: "The page mentions donations to the King Hussein Cancer Center, the Jordan River Foundation, and the Aman orphans fund during his senate membership.", relationship: "Giving mentioned", theme: "Giving", sourceUrl: ZAD, evidence: "published" },
  { text: "The page names trustee boards including Al-Hussein Technical University, Birzeit, An-Najah, the Welfare Association, the Centre for Arab Unity Studies, and the Arab Anti-Corruption Organization.", relationship: "Membership mentioned", theme: "Education", sourceUrl: ZAD, evidence: "published" },
  { text: "The Naeem Abdelhadi Prize for cultural work was launched with his brother, Dr Omar Abdelhadi, inside the Welfare Association, according to the same page. The prize name is printed as Naeem.", relationship: "Membership mentioned", theme: "Giving", sourceUrl: ZAD, evidence: "published" },
  { text: "Zad for Arts says he was appointed to the 17th Senate and chaired the friendship committee with the UAE. The Jordan politics directory lists him in a previous senate (the 27th) and gives 1962 as the graduation year. This page does not pick one number.", relationship: "Where sources differ", theme: "Membership", sourceUrl: DIRECTORY, evidence: "published" },
  { text: "The current members page on the Senate website, including amendments published through 2026, did not show Samir Yasser Abdelhadi in the text that was checked. The pages that print a middle name use Naeem. This concept does not describe him as a sitting member.", relationship: "Where sources differ", theme: "Membership", sourceUrl: SENATE_NOW, evidence: "published" },
];

export const trainingPaths: { id: "beginner" | "owner" | "team"; title: string; forWho: string; trainingIdx: number[]; serviceIds: ServiceId[] }[] = [
  {
    id: "beginner",
    title: "The message path",
    forWho: "For a first sentence a visitor understands in ten seconds",
    trainingIdx: [0, 1, 3],
    serviceIds: ["consult", "courses"],
  },
  {
    id: "owner",
    title: "The evidence path",
    forWho: "For keeping every claim tied to a page",
    trainingIdx: [4, 5, 6],
    serviceIds: ["seo", "meta"],
  },
  {
    id: "team",
    title: "The office path",
    forWho: "For a team that prepares materials and waits for approval before publishing",
    trainingIdx: [2, 7],
    serviceIds: ["coaching", "social"],
  },
];

export const serviceGuide: Record<ServiceId, { when: string; needs: string; next: string; goal: GoalId }> = {
  sem: { when: "People search the name and the first result does not explain who he is.", needs: "An approved sentence and a link to the record.", next: "Write the sentence and review it with the office.", goal: "search" },
  seo: { when: "Facts are scattered across pages that do not agree.", needs: "A source list, with no new fact added on top.", next: "Open the record and mark what you want in front.", goal: "search" },
  social: { when: "A platform already exists, or there is a decision to start one.", needs: "Someone who replies, and a weekly pace they can keep.", next: "Choose one platform for this month.", goal: "social" },
  graphic: { when: "Materials look as if they came from different offices.", needs: "An approved colour and typeface.", next: "Gather three current pieces before any template.", goal: "identity" },
  photo: { when: "A photograph will be used in a public piece.", needs: "Written permission, or a message from the person in the picture.", next: "Do not schedule a photograph before permission.", goal: "identity" },
  web: { when: "There is no standing address people can point to.", needs: "A domain name and a decision about who owns it.", next: "Name the first three pages only.", goal: "website" },
  training: { when: "A host wants one published project, not a general biography.", needs: "One project from the record and one theme.", next: "Name the host and the length before the date.", goal: "training" },
  meta: { when: "Talk about the name appears and you do not know the source.", needs: "Links to what appeared this week.", next: "Mark each link confirmed, disputed, or unsourced.", goal: "training" },
  courses: { when: "The long explanation is not being read.", needs: "One question per piece.", next: "Write three questions a visitor asks.", goal: "training" },
  consult: { when: "There are many messages and the ask is unclear.", needs: "An hour with the person who approves the text.", next: "Start the studio, then send the brief yourself.", goal: "leads" },
  coaching: { when: "The office is small and publishing stops on one person.", needs: "A fixed weekly time.", next: "Name the person who owns the draft.", goal: "social" },
};
