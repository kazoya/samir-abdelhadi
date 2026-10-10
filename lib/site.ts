// السجل المكتوب من صفحات علنية فُحصت في 2026-10-10.
// الصورة في public/samir-portrait.png زوّدها صاحب التصور، وليست من تلك الصفحات.
// لا هاتف ولا بريد للعين هنا: خط النقاش هو مطوّر التصور فقط.
import type { GoalId } from "./planner/types.ts";

export const ZAD = "https://www.zadforarts.com/samir-abdul-hadi-fund-for-culture-and-arts";
export const DIRECTORY = "http://www.jordanpolitics.org/ar/senate-member/199/%D8%B3%D9%85%D9%8A%D8%B1-%D9%86%D8%B9%D9%8A%D9%85-%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D9%87%D8%A7%D8%AF%D9%8A/9";
export const SENATE_NOW = "https://senate.jo/Ar/List/%D8%A7%D8%B9%D8%B6%D8%A7%D8%A1_%D8%A7%D9%84%D9%85%D8%AC%D9%84%D8%B3_%D8%A7%D9%84%D8%AD%D8%A7%D9%84%D9%8A_%D9%88%D8%A7%D9%84%D8%B3%D9%8A%D8%B1_%D8%A7%D9%84%D8%B0%D8%A7%D8%AA%D9%8A%D8%A9";
export const GHINA_ENGINE = "https://github.com/kazoya/ghina-media-concept";
export const SKILLS_REPO = "https://github.com/coreyhaines31/marketingskills";

export const brand = {
  nameAr: "حضور عبدالهادي",
  nameEn: "Abdelhadi Presence",
  lead: "سمير نعيم عبدالهادي",
  site: ZAD,
  phoneDisplay: "+962 78 752 3192",
  phoneDigits: "962787523192",
  tel: "tel:+962787523192",
  whatsappUrl: "https://wa.me/962787523192",
  email: "",
  addressAr: "عمّان، الأردن",
  addressEn: "Amman, Jordan",
  hours: "غير منشورة",
  socials: [] as { label: string; href: string }[],
} as const;

export const developer = {
  name: "م. صهيب الصالح",
  whatsappDigits: "962787523192",
  whatsappUrl: "https://wa.me/962787523192",
} as const;

export const disclaimer = "تصوّر تجريبي مستقل — غير تابع للموقع الرسمي";

export const nav = [
  { href: "/", label: "الرئيسية" },
  { href: "/planner", label: "الاستوديو" },
  { href: "/services", label: "المسارات" },
  { href: "/activities", label: "السجل" },
  { href: "/training", label: "المنهج" },
  { href: "/opportunities", label: "الفرص" },
  { href: "/contact", label: "تواصل" },
] as const;

export function waLink(text: string, digits: string = developer.whatsappDigits) {
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const published = {
  experience: "المهندس سمير نعيم عبدالهادي، كما تصفه صفحة زاد الفنون: مواليد القدس، ومهندس مدني، ومؤسس شركة في الأردن عام 1980",
  specialties: ["هندسة ومشاريع", "ثقافة وفنون", "تعليم", "عطاء موثّق"],
  vision: "حضور عام يُقرأ من السجل قبل أن يُروى. الرسالة واحدة، والأدلة من صفحات منشورة، والدعوة واضحة.",
  mission: "ترتيب ما يُقال عن الاسم حتى يصل الباحث إلى مصدر، لا إلى جملة عائمة.",
  meta: "الصورة في هذه الصفحة زوّدها صاحب التصور. السجل المكتوب من الصفحات العلنية المذكورة، ولا ندّعي أن الصورة منشورة فيها.",
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
  { id: "sem", ar: "ظهور عند البحث عن الاسم", en: "Name search", desc: "جملة واحدة تظهر لمن يبحث عن الاسم الآن، مع رابط إلى السجل.", group: "grow" },
  { id: "seo", ar: "صفحة مرجع قابلة للاقتباس", en: "Citable record", desc: "حقائق منسوبة إلى مصادرها حتى يقتبسها البحث والمساعدات من صفحة واحدة.", group: "grow" },
  { id: "social", ar: "حضور على المنصات", en: "Public channels", desc: "منصة أو منصتان، بإيقاع يحتمله المكتب، لا بنشر يومي مفروض.", group: "grow" },
  { id: "graphic", ar: "قوالب بصرية هادئة", en: "Quiet templates", desc: "قالب واحد للنص والصورة، بلا حملة لونية تنافس الاسم.", group: "create" },
  { id: "photo", ar: "أرشيف صور بإذن", en: "Permitted archive", desc: "لا تُنشر صورة إلا بإذن صاحبها. الصورة الحالية مرفقة من صاحب التصور.", group: "create" },
  { id: "web", ar: "صفحة ثابتة للاسم", en: "Standing page", desc: "عنوان واحد يجمع السيرة والمصادر وطريقة المراسلة.", group: "create" },
  { id: "training", ar: "لقاءات نقل خبرة", en: "Knowledge sessions", desc: "لقاء يشرح مشروعاً منشوراً، لا دورة بشهادة مخترعة.", group: "learn" },
  { id: "meta", ar: "رصد ما يُقال", en: "What is being said", desc: "جمع ما يظهر عن الاسم وتصنيفه: مؤكد، مختلف فيه، أو غير مصدر.", group: "learn" },
  { id: "courses", ar: "سلسلة شرح قصيرة", en: "Short explainers", desc: "قطع قصيرة تجيب سؤالاً واحداً، وكل قطعة تشير إلى مصدر.", group: "learn" },
  { id: "consult", ar: "ترتيب الرسالة", en: "Message house", desc: "جملة وعد، وثلاثة أدلة، ودعوة واحدة. تُعتمد قبل أي نشر.", group: "grow" },
  { id: "coaching", ar: "مرافقة المكتب", en: "Office rhythm", desc: "ساعة ثابتة لمراجعة ما سيُنشر، لا نشر من هذه الصفحة.", group: "learn" },
];

export const groups = {
  grow: "ظهور ورسالة",
  create: "مواد وأرشيف",
  learn: "تعلّم وتمكين",
} as const;

export const trainings = [
  "رسالة واحدة في الجملة الأولى",
  "ثلاثة أدلة من السجل فقط",
  "جمهور واحد في كل قطعة",
  "دعوة واحدة: اقرأ المصدر أو راسل خط النقاش",
  "ما اختلفت فيه المصادر يُعرض اختلافاً لا حقيقة",
  "لا رقم ولا شريك ولا نتيجة بلا صفحة منشورة",
  "الصورة بإذن، والتعليق يقول من زوّدها",
  "الموجة التالية تنتظر اعتماد المكتب",
];

export type Relationship = "سيرة منشورة" | "عطاء مذكور" | "عضوية مذكورة" | "ما اختلفت فيه المصادر";
export const relationships: Relationship[] = ["سيرة منشورة", "عطاء مذكور", "عضوية مذكورة", "ما اختلفت فيه المصادر"];

export const activities: {
  text: string;
  relationship: Relationship;
  theme: "سيرة" | "عطاء" | "تعليم" | "عضوية";
  sourceUrl: string;
  evidence: "published";
}[] = [
  { text: "صفحة زاد الفنون تقول إن المهندس سمير عبدالهادي وُلد في القدس عام 1942، ودرس الهندسة المدنية في الجامعة الأميركية في بيروت.", relationship: "سيرة منشورة", theme: "سيرة", sourceUrl: ZAD, evidence: "published" },
  { text: "الصفحة نفسها تقول إن والده نعيم عبدالهادي تولى مناصب سياسية وإدارية، وإن سمير تلقى تعليمه في مدارس الفرندز في رام الله.", relationship: "سيرة منشورة", theme: "سيرة", sourceUrl: ZAD, evidence: "published" },
  { text: "في عام 1980 أسس شركة في الأردن باسم علمي وعبدالهادي، بعد عمل في ليبيا والإمارات مع الاتحاد الهندسي، خطيب وعلمي.", relationship: "سيرة منشورة", theme: "سيرة", sourceUrl: ZAD, evidence: "published" },
  { text: "صندوق سمير عبدالهادي للثقافة والفنون قدّم منحة للجمعية الثقافية العربية ساهمت في تأسيس زاد الفنون عام 2023.", relationship: "عطاء مذكور", theme: "عطاء", sourceUrl: ZAD, evidence: "published" },
  { text: "من العطاء المذكور في الصفحة: مركز فنون في الزرقاء مع وزارة الثقافة، ومبنى كلية الرياضيات في جامعة بيرزيت، وملعب ومركز لياقة في مخيم حطين، ومركز تدريب مهني في مخيم غزة بجرش، ومختبر عمارة في جامعة الحسين التقنية.", relationship: "عطاء مذكور", theme: "تعليم", sourceUrl: ZAD, evidence: "published" },
  { text: "الصفحة تذكر تبرعاً لمركز الحسين للسرطان ومؤسسة نهر الأردن وصندوق أمان لرعاية الأيتام خلال عضويته في الأعيان.", relationship: "عطاء مذكور", theme: "عطاء", sourceUrl: ZAD, evidence: "published" },
  { text: "تذكر الصفحة عضوية مجالس أمناء منها جامعة الحسين التقنية، وبيرزيت، والنجاح الوطنية، ومؤسسة التعاون، ومركز دراسات الوحدة العربية، والمنظمة العربية لمكافحة الفساد.", relationship: "عضوية مذكورة", theme: "تعليم", sourceUrl: ZAD, evidence: "published" },
  { text: "جائزة نعيم عبدالهادي للأعمال الثقافية أُطلقت مع شقيقه الدكتور عمر عبدالهادي ضمن مؤسسة التعاون، حسب الصفحة نفسها.", relationship: "عضوية مذكورة", theme: "عطاء", sourceUrl: ZAD, evidence: "published" },
  { text: "زاد الفنون تقول إنه عُيّن في مجلس الأعيان السابع عشر وترأس لجنة الصداقة مع الإمارات. دليل الحياة السياسية يدرجه في مجلس أعيان سابق (السابع والعشرون) ويذكر سنة تخرج 1962. لا نختار رقماً واحداً.", relationship: "ما اختلفت فيه المصادر", theme: "عضوية", sourceUrl: DIRECTORY, evidence: "published" },
  { text: "صفحة أعضاء المجلس الحالي على موقع مجلس الأعيان، بما فيها التعديلات المنشورة حتى 2026، لم تُظهر اسم سمير نعيم عبدالهادي في النص الذي فُحص. لذلك لا يصفه هذا التصور عضواً حالياً.", relationship: "ما اختلفت فيه المصادر", theme: "عضوية", sourceUrl: SENATE_NOW, evidence: "published" },
];

export const trainingPaths: { id: "beginner" | "owner" | "team"; title: string; forWho: string; trainingIdx: number[]; serviceIds: ServiceId[] }[] = [
  {
    id: "beginner",
    title: "مسار الرسالة",
    forWho: "لمن يريد جملة أولى يفهمها الزائر في عشر ثوانٍ",
    trainingIdx: [0, 1, 3],
    serviceIds: ["consult", "courses"],
  },
  {
    id: "owner",
    title: "مسار الدليل",
    forWho: "لمن يريد أن يبقى كل ادعاء مربوطاً بصفحة",
    trainingIdx: [4, 5, 6],
    serviceIds: ["seo", "meta"],
  },
  {
    id: "team",
    title: "مسار المكتب",
    forWho: "لفريق يعدّ المواد ثم ينتظر الاعتماد قبل النشر",
    trainingIdx: [2, 7],
    serviceIds: ["coaching", "social"],
  },
];

export const serviceGuide: Record<ServiceId, { when: string; needs: string; next: string; goal: GoalId }> = {
  sem: { when: "الاسم يُبحث عنه والنتيجة الأولى لا تشرح من هو.", needs: "جملة معتمدة ورابط السجل.", next: "اكتب الجملة وراجعها مع المكتب.", goal: "search" },
  seo: { when: "الحقائق مبعثرة بين صفحات لا يتفق بعضها.", needs: "قائمة مصادر لا تُزاد عليها واقعة جديدة.", next: "افتح السجل وعلّم ما تريد إبرازه.", goal: "search" },
  social: { when: "هناك منصة قائمة أو قرار بالبدء بواحدة.", needs: "من يرد، وإيقاع أسبوعي يحتمله.", next: "اختر منصة واحدة لهذا الشهر.", goal: "social" },
  graphic: { when: "المواد تبدو من مكاتب مختلفة.", needs: "لون ونوع خط معتمدان.", next: "اجمع ثلاث مواد حالية قبل أي قالب.", goal: "identity" },
  photo: { when: "ستُستخدم صورة في مادة عامة.", needs: "إذن مكتوب أو رسالة من صاحب الصورة.", next: "لا تجدول صورة قبل الإذن.", goal: "identity" },
  web: { when: "لا يوجد عنوان ثابت يحيل إليه الناس.", needs: "اسم النطاق وقرار من يملكه.", next: "حدد الصفحات الثلاث الأولى فقط.", goal: "website" },
  training: { when: "جهة تريد سماع مشروع منشور لا سيرة عامة.", needs: "مشروع واحد من السجل ومحور واحد.", next: "سمِّ الجهة والمدة قبل الموعد.", goal: "training" },
  meta: { when: "يظهر كلام عن الاسم ولا تعرف مصدره.", needs: "روابط ما ظهر هذا الأسبوع.", next: "صنّف كل رابط: مؤكد، مختلف، أو بلا مصدر.", goal: "training" },
  courses: { when: "الشرح الطويل لا يُقرأ.", needs: "سؤال واحد لكل قطعة.", next: "اكتب ثلاثة أسئلة يطرحها الزائر.", goal: "training" },
  consult: { when: "الرسائل كثيرة والدعوة غير واضحة.", needs: "ساعة مع من يعتمد النص.", next: "ابدأ الاستوديو ثم أرسل الموجز بنفسك.", goal: "leads" },
  coaching: { when: "المكتب صغير والنشر يتوقف على شخص واحد.", needs: "موعد أسبوعي ثابت.", next: "سمِّ المسؤول عن المسودة.", goal: "social" },
};
