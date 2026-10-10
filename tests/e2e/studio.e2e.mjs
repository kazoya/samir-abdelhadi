// End-to-end: BASE=http://localhost:3000 npm run test:e2e
// متطلبات: npx playwright install chromium. كل طلب خارج المنصة يُحجب — لا رسائل ولا طلبات حقيقية.
import { chromium } from "playwright";
import { mkdirSync, readFileSync } from "node:fs";

const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const OUT = new URL("./artifacts/", import.meta.url);
mkdirSync(OUT, { recursive: true });
const host = new URL(BASE).host;
let pass = 0;
const fails = [];
const ok = (name, cond, extra = "") => {
  if (cond) pass++;
  else fails.push(name);
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${extra ? "  — " + extra : ""}`);
};
const ROUTES = ["/", "/planner", "/services", "/training", "/activities", "/opportunities", "/contact", "/developer"];

const b = await chromium.launch();
async function ctx(opts = {}, init) {
  const c = await b.newContext({ acceptDownloads: true, ...opts });
  const blocked = new Set();
  await c.route("**/*", (r) => {
    const u = new URL(r.request().url());
    if (u.host !== host) {
      blocked.add(u.host);
      return r.abort();
    }
    return r.continue();
  });
  if (init) await c.addInitScript(init);
  c.blocked = blocked;
  return c;
}
function watch(p) {
  const errs = [];
  p.on("pageerror", (e) => errs.push(e.message));
  p.on("console", (m) => m.type() === "error" && !/net::ERR_FAILED|ERR_BLOCKED/.test(m.text()) && errs.push(m.text()));
  p.on("requestfailed", (r) => new URL(r.url()).host === host && errs.push(`requestfailed ${r.url()}`));
  return errs;
}
const status = (p) => p.locator('[role="status"]').first().innerText();
async function answer(p, { business, goal, channels, team, timeline }) {
  await p.getByRole("button", { name: business, exact: true }).click();
  if (goal) await p.getByRole("button", { name: goal, exact: true }).click();
  for (const c of channels) await p.getByRole("button", { name: c, exact: true }).click();
  await p.getByRole("button", { name: "Next" }).click();
  await p.getByRole("button", { name: team, exact: true }).click();
  await p.getByRole("button", { name: timeline, exact: true }).click();
  await p.getByRole("tab", { name: "Recommendations" }).waitFor();
}
async function downloadText(p, trigger) {
  const [d] = await Promise.all([p.waitForEvent("download"), trigger()]);
  return { name: d.suggestedFilename(), text: readFileSync(await d.path(), "utf8") };
}

// ——— 1) الرحلة الكاملة: دخول → تخطيط → تعديل → حفظ → reload → تصدير → Compare → نسخ ———
{
  const c = await ctx({ viewport: { width: 1366, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const p = await c.newPage();
  const errs = watch(p);
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.locator('a[data-gate="leads"]').click();
  await p.waitForURL(/\/planner\?goal=leads/);
  ok("journey: gateway preselects goal", (await p.locator("main").innerText()).includes("Goal preset"));
  await answer(p, { business: "General public", goal: "Clearer dialogue", channels: ["Instagram"], team: "One person", timeline: "Within a month" });
  const recs = await p.locator("[data-rec]").evaluateAll((els) => els.map((e) => e.getAttribute("data-rec")));
  ok("journey: 1–4 recommendations, no duplicates", recs.length >= 1 && recs.length <= 4 && new Set(recs).size === recs.length, recs.join(","));
  ok("journey: every recommendation shows reasons tied to answers", (await p.locator("[data-rec]").count()) === (await p.locator("[data-rec]:has([data-reason])").count()));
  ok("journey: e-store without website → web recommended + gap linked", recs.includes("web") && (await p.locator('[data-gap="no-website"]').innerText()).includes("Standing page"));
  ok("journey: rule-based disclosure shown", (await p.locator("main").innerText()).includes("not an AI analysis"));

  // تبويبات بلوحة المفاتيح (RTL: يسار = Next)
  await p.getByRole("tab", { name: "Recommendations" }).focus();
  await p.keyboard.press("ArrowRight");
  ok("keyboard: ArrowRight moves to next tab (LTR)", (await p.evaluate(() => document.activeElement?.textContent)) === "30-day plan" && (await p.getByRole("tab", { name: "30-day plan" }).getAttribute("aria-selected")) === "true");
  await p.keyboard.press("End");
  ok("keyboard: End jumps to last tab", (await p.getByRole("tab", { name: "Compare" }).getAttribute("aria-selected")) === "true");

  // تعديل الخطة
  await p.getByRole("tab", { name: "30-day plan" }).click();
  const firstTask = p.locator("[data-task]").first();
  await firstTask.getByLabel("Task", { exact: true }).fill("Edited task for the test");
  await firstTask.getByLabel("Owner", { exact: true }).fill("فريق المبيعات");
  await firstTask.getByRole("checkbox").check();
  const phases = await p.locator('section[aria-labelledby^="ph-"]').count();
  ok("plan: four phases", phases === 4);
  const taskCount = await p.locator("[data-task]").count();
  await p.locator('section[aria-labelledby="ph-3"]').getByRole("button", { name: "Add a task" }).click();
  ok("plan: add task", (await p.locator("[data-task]").count()) === taskCount + 1);

  // التقويم
  await p.getByRole("tab", { name: "Calendar" }).click();
  const posts0 = await p.locator("[data-post]").count();
  ok("calendar: posts generated", posts0 > 0);
  await p.getByRole("button", { name: "Add a post" }).click();
  const newPost = p.locator("[data-post]").first();
  await newPost.getByLabel("Idea", { exact: true }).fill('=SUM(A1:A2) "اقتباس"، فاصلة\nسطر ثانٍ');
  await newPost.getByLabel("Status", { exact: true }).selectOption("ready");
  ok("calendar: add + edit post", (await p.locator("[data-post]").count()) === posts0 + 1);
  await p.getByRole("button", { name: "Grid" }).click();
  ok("calendar: grid view on desktop", await p.locator('[aria-label="Month view"]').isVisible());
  await p.getByRole("button", { name: "List" }).click();

  // الموجز والحفظ
  await p.getByRole("tab", { name: "Brief" }).click();
  await p.getByLabel(/Your name/).fill("Sara");
  await p.getByLabel("Draft title (optional)").fill("Dialogue plan");
  await p.locator('[data-save="A"]').click();
  ok("save: slot A success notice", (await status(p)).includes("Saved as draft A"));
  const stored = await p.evaluate(() => localStorage.getItem("abdelhadi-studio:v1:draft:A"));
  ok("save: name is not stored", !!stored && !stored.includes("Sara"));
  ok("save: edits stored", stored.includes("Edited task for the test"));

  // تصدير JSON و CSV
  const json = await downloadText(p, () => p.getByRole("button", { name: "Export plan JSON" }).click());
  const parsed = JSON.parse(json.text);
  ok("export JSON: schemaVersion 1, edits kept, no name anywhere", parsed.schemaVersion === 1 && json.text.includes("Edited task for the test") && !/"name"/.test(json.text) && !json.text.includes("Sara"), json.name);
  const csv = await downloadText(p, () => p.getByRole("button", { name: /Export calendar CSV/ }).click());
  ok("export CSV: BOM + formula guard + quoted multiline", csv.text.startsWith("﻿") && csv.text.includes(`"'=SUM(A1:A2) ""اقتباس""، فاصلة\nسطر ثانٍ"`), csv.name);

  // نسخ الموجز
  await p.getByRole("button", { name: "Copy brief" }).click();
  const clip = await p.evaluate(() => navigator.clipboard.readText());
  ok("copy: clipboard has brief with name", clip.includes("Presence brief") && clip.includes("Name: Sara"));
  ok("copy: success notice", (await status(p)).includes("Brief copied"));

  // واتساب: الرابط فقط، لا نقر
  const wa = await p.locator("[data-wa]").getAttribute("href");
  const msg = decodeURIComponent(wa.split("text=")[1]);
  ok("whatsapp: his line + encoded short message", wa.startsWith("https://wa.me/962795555772?text=") && msg.includes("I am Sara.") && msg.includes("Independent concept") && msg.length < 700);

  // reload → استعادة من المسودة
  await p.reload({ waitUntil: "networkidle" });
  ok("reload: session not auto-restored (explicit save only)", (await p.locator("main").innerText()).includes("Question 1 of 5"));
  await answer(p, { business: "A cultural institution", goal: "Share experience", channels: ["A Facebook page"], team: "A small office", timeline: "This week" });
  const recs2 = await p.locator("[data-rec]").evaluateAll((els) => els.map((e) => e.getAttribute("data-rec")));
  ok("acceptance: team training → training first, no forced website", recs2[0] === "training" && !recs2.includes("web"), recs2.join(","));
  await p.getByRole("tab", { name: "Brief" }).click();
  await p.locator('[data-save="B"]').click();
  await p.getByRole("button", { name: "Show saved drafts" }).click();
  ok("drafts: both slots listed with date + schema version", (await p.locator('[data-slot="A"]').innerText()).includes("Dialogue plan") && (await p.locator('[data-slot="A"]').innerText()).includes("schema 1"));
  await p.locator('[data-slot="A"]').getByRole("button", { name: "Open" }).click();
  await p.getByRole("tab", { name: "30-day plan" }).click();
  ok("restore: slot A reopened with edits after reload", (await p.locator("[data-task]").first().getByLabel("Task", { exact: true }).inputValue()) === "Edited task for the test");

  // Compare
  await p.getByRole("tab", { name: "Compare" }).click();
  await p.locator("[data-compare]").waitFor();
  const cmp = await p.locator("[data-compare]").innerText();
  ok("compare: shows differing goal and both rankings", cmp.includes("(different)") && cmp.includes("Clearer dialogue") && cmp.includes("Share experience"));
  ok("compare: no 'expected return' claims", !/عائد متوقع:|ROI/.test(cmp));

  // تغيير الإجابات بعد التعديل → سؤال قبل الاستبدال، والتركيز يعود
  await p.getByRole("tab", { name: "Recommendations" }).click();
  await p.getByRole("button", { name: "Edit my answers" }).click();
  await p.getByRole("button", { name: "The biography itself", exact: true }).click();
  await p.evaluate(() => document.activeElement?.id).then((id) => ok("focus: moves to question heading on step", id === "q", String(id)));
  await p.getByRole("button", { name: "One clear message", exact: true }).click();
  await p.getByRole("button", { name: "Next" }).click();
  await p.getByRole("button", { name: "One person", exact: true }).click();
  await p.getByRole("button", { name: "Within a month", exact: true }).click();
  const dlg = p.getByRole("dialog", { name: "You edited the plan" });
  ok("edits guard: dialog before replacing user edits", await dlg.isVisible());
  await dlg.getByRole("button", { name: "Keep my edits" }).click();
  await p.getByRole("tab", { name: "30-day plan" }).click();
  ok("edits guard: kept edits after answer change", (await p.locator("[data-task]").first().getByLabel("Task", { exact: true }).inputValue()) === "Edited task for the test");

  // استيراد غير صالح لا يمس الخطة، ثم صالح بتأكيد
  await p.getByRole("tab", { name: "Brief" }).click();
  await p.locator("[data-import]").setInputFiles({ name: "bad.json", mimeType: "application/json", buffer: Buffer.from('{"schemaVersion":1,"answers":{"schemaVersion":1,"channelIds":["none","facebook"]}}') });
  await p.locator('[role="status"]', { hasText: "was not imported" }).waitFor({ timeout: 5000 }).catch(() => {});
  const st1 = await status(p);
  const br1 = await p.locator("[data-brief]").innerText();
  ok("import invalid: error + current plan untouched", st1.includes("was not imported") && br1.includes("One clear message"), `status=${st1.slice(0, 80)} | brief has goal=${br1.includes("One clear message")}`);
  await p.locator("[data-import]").setInputFiles({ name: "big.json", mimeType: "application/json", buffer: Buffer.alloc(300 * 1024, 32) });
  ok("import oversized: rejected", (await status(p)).includes("larger than 256"));
  const trigger = p.getByRole("button", { name: "Choose a JSON file" });
  await p.locator("[data-import]").setInputFiles({ name: "plan.json", mimeType: "application/json", buffer: Buffer.from(json.text) });
  const rep = p.getByRole("dialog", { name: "Replace the open plan?" });
  await rep.waitFor();
  await p.keyboard.press("Escape");
  ok("dialog: Escape closes and keeps current plan", !(await rep.isVisible()) && (await p.locator("[data-brief]").innerText()).includes("One clear message"));
  await trigger.focus();
  await p.locator("[data-import]").setInputFiles({ name: "plan.json", mimeType: "application/json", buffer: Buffer.from(json.text) });
  await rep.getByRole("button", { name: "Replace" }).click();
  ok("import valid: opens recommendations for the imported plan", (await p.locator("[data-rec]").count()) > 0);
  await p.getByRole("tab", { name: "Brief" }).click();
  ok("import valid: round trip restores exported plan", (await p.locator("[data-brief]").innerText()).includes("Clearer dialogue"));

  // تصفير كامل مع حذف المسودات → لا يعود شيء بعد refresh، والتركيز يعود لزر الفتح عند الCancel
  const resetBtn = p.getByRole("button", { name: /Start over/ });
  await resetBtn.click();
  const rd = p.getByRole("dialog", { name: "Start over?" });
  await rd.getByRole("button", { name: "Cancel" }).click();
  ok("dialog: focus returns to trigger on close", await p.evaluate(() => document.activeElement?.textContent?.includes("Start over")));
  await resetBtn.click();
  await rd.getByLabel(/Also delete drafts/).check();
  await rd.getByRole("button", { name: "Yes, reset" }).click();
  await p.reload({ waitUntil: "networkidle" });
  const left = await p.evaluate(() => [localStorage.getItem("abdelhadi-studio:v1:draft:A"), localStorage.getItem("abdelhadi-studio:v1:draft:B")]);
  ok("reset: saved drafts gone after refresh", left.every((x) => x === null));
  ok("reset: wizard fresh after refresh", (await p.locator("main").innerText()).includes("Question 1 of 5"));

  ok("journey: no console errors / failed local requests", errs.length === 0, errs.slice(0, 3).join(" | "));
  ok("journey: no external request attempted", c.blocked.size === 0, `blocked: ${[...c.blocked].join(", ") || "none"}`);
  await c.close();
}

// ——— 2) التخزين مرفوض + الحافظة مرفوضة: الجلسة تستمر وبلا نجاح كاذب ———
{
  const c = await ctx({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, () => {
    Storage.prototype.setItem = function () {
      throw new DOMException("full", "QuotaExceededError");
    };
    Object.defineProperty(navigator, "clipboard", { value: { writeText: () => Promise.reject(new Error("denied")) } });
  });
  const p = await c.newPage();
  const errs = watch(p);
  await p.goto(BASE + "/planner", { waitUntil: "networkidle" });
  await answer(p, { business: "Youth and initiatives", goal: "A presence on platforms", channels: ["Nothing yet"], team: "Nobody yet", timeline: "Just exploring" });
  await p.getByRole("tab", { name: "Brief" }).click();
  await p.locator('[data-save="A"]').click();
  const s = await status(p);
  ok("storage full: honest failure notice, plan still open", s.includes("Not saved") && (await p.locator("[data-brief]").isVisible()));
  await p.getByRole("button", { name: "Copy brief" }).click();
  ok("clipboard denied: no fake success + manual copy fallback", (await status(p)).includes("Could not copy") && (await p.getByLabel("Copy manually").isVisible()));
  ok("explorer: no pressure language", !/سارع|عرض محدود|ينتهي خلال/.test(await p.locator("main").innerText()));
  ok("mobile: tabs reachable, no horizontal overflow", (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  ok("mobile: tap targets ≥44px in wizard/tabs", (await p.getByRole("tab", { name: "Recommendations" }).boundingBox()).height >= 44);
  // اسم وعنوان طويلان (حتى الحد 60) على عرض 320: لا فيض أفقي والنص كامل في الموجز
  await p.setViewportSize({ width: 320, height: 700 });
  const longName = "عبد الرحمن بن محمد الطويل — مؤسسة الأفق للتجارة والخدمات الرقمية".slice(0, 60);
  await p.getByLabel(/Your name/).fill(longName + "زيادة تتجاوز الحد");
  await p.getByLabel("Draft title (optional)").fill("خطة ".repeat(20));
  const nameVal = await p.getByLabel(/Your name/).inputValue();
  ok("long name: capped at 60 chars and shown in brief", nameVal.length === 60 && (await p.locator("[data-brief]").innerText()).includes(nameVal));
  ok("long name @320px: no horizontal overflow", (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  ok("degraded run: no page errors", errs.length === 0, errs.slice(0, 3).join(" | "));
  await c.close();
}

// ——— 3) طباعة عربية RTL ———
{
  const c = await ctx({ viewport: { width: 1200, height: 900 } });
  const p = await c.newPage();
  await p.goto(BASE + "/planner", { waitUntil: "networkidle" });
  await answer(p, { business: "General public", goal: "Clearer dialogue", channels: ["WhatsApp"], team: "One assistant", timeline: "This week" });
  await p.emulateMedia({ media: "print" });
  const vis = await p.evaluate(() => ({
    brief: getComputedStyle(document.querySelector(".print-brief")).display,
    header: getComputedStyle(document.querySelector("header[data-header]")).display,
    bar: getComputedStyle(document.querySelector("[data-sales-bar]")).display,
    tabs: getComputedStyle(document.querySelector('[role="tablist"]')).display,
    dir: getComputedStyle(document.querySelector(".print-brief")).direction,
  }));
  ok("print: only the brief, LTR, no fixed bars or controls", vis.brief === "block" && vis.header === "none" && vis.bar === "none" && vis.tabs === "none" && vis.dir === "ltr", JSON.stringify(vis));
  await p.pdf({ path: new URL("brief.pdf", OUT).pathname.replace(/^\/([A-Za-z]:)/, "$1"), format: "A4", printBackground: true });
  ok("print: PDF rendered via browser print", true, "artifacts/brief.pdf");
  await c.close();
}

// ——— 4) الصفحات: RTL، التنويه، noindex، عرض 320/390/768/1440 وتكبير 200% ———
for (const [w, h] of [[320, 700], [390, 844], [768, 1024], [1440, 900], [640, 450]]) {
  const c = await ctx({ viewport: { width: w, height: h } });
  const p = await c.newPage();
  const bad = [];
  for (const r of ROUTES) {
    const res = await p.goto(BASE + r, { waitUntil: "networkidle" });
    const i = await p.evaluate(() => ({
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      robots: document.querySelector('meta[name="robots"]')?.content ?? "",
      label: document.body.innerText.includes("Independent concept. Not an official site."),
      over: document.documentElement.scrollWidth - innerWidth,
    }));
    if (res.status() !== 200 || i.lang !== "en" || i.dir !== "ltr" || !/noindex/.test(i.robots) || !/noindex/.test(res.headers()["x-robots-tag"] ?? "") || !i.label || i.over > 0) bad.push(`${r}:${JSON.stringify(i)}`);
  }
  ok(`pages @${w}px${w === 640 ? " (≈200% zoom of 1280)" : ""}: 200, en/ltr, label, noindex, no overflow`, bad.length === 0, bad.join(" | "));
  await c.close();
}

// ——— 5) استكشاف الخدمات والتدريب والأعمال ———
{
  const c = await ctx({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  await p.goto(BASE + "/services", { waitUntil: "networkidle" });
  const all = await p.locator("[data-service]").count();
  await p.getByRole("button", { name: /Learn and enable/ }).click();
  const learn = await p.locator("[data-service]").count();
  ok("services: filter narrows list and is announced", all === 11 && learn === 4 && (await p.locator('[aria-live="polite"]').last().innerText()).includes("4 of 11"));
  await p.locator('[data-service="meta"] summary').click();
  ok("services: details disclose when/needs/next", (await p.locator('[data-service="meta"]').innerText()).includes("What you need"));
  await p.locator('[data-service="meta"]').getByRole("link", { name: /Start a plan/ }).click();
  await p.waitForURL(/goal=training/);
  ok("services → planner with safe goal mapping", (await p.locator("main").innerText()).includes("Share experience"));
  await p.goto(BASE + "/planner?goal=<script>", { waitUntil: "networkidle" });
  ok("planner ignores unknown ?goal", !(await p.locator("main").innerText()).includes("Goal preset"));
  await p.goto(BASE + "/training", { waitUntil: "networkidle" });
  ok("training: three guided paths labelled non-official", (await p.locator("[data-path]").count()) === 3 && (await p.locator("main").innerText()).includes("not programmes announced by Ghina Media"));
  await p.goto(BASE + "/activities", { waitUntil: "networkidle" });
  const t = await p.locator("main").innerText();
  ok("activities: sourced record and disagreement stay visible", t.includes("Published biography") && t.includes("Where sources differ") && (await p.locator('a[href*="zadforarts.com"]').count()) >= 1);
  ok("activities: illustrative story clearly labelled", (await p.locator("[data-illustrative]").innerText()).includes("not a real client"));
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("home: sample output labelled illustrative", (await p.locator("#sample").locator("..").innerText()).length > 0 && (await p.locator("main").innerText()).includes("Illustrative example. Sample answers."));
  ok("home: photo + founder anchor kept", await p.locator('img[src*="samir-portrait"]').count() === 1 && (await p.locator("#founder").count()) === 1);
  ok("home: Amman clock not announced every second", (await p.locator(".amman-clock time").first().getAttribute("aria-live")) === null && (await p.locator(".amman-clock [aria-live]").count()) === 0);
  await c.close();
}

// ——— 6) بلا JavaScript وتقليل الحركة ———
{
  const c = await ctx({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const p = await c.newPage();
  await p.goto(BASE + "/services", { waitUntil: "load" });
  ok("no-JS: services content visible", (await p.locator("[data-service]").count()) === 11);
  await p.goto(BASE + "/planner", { waitUntil: "load" });
  ok("no-JS: planner shows fallback with direct contact", (await p.locator("main").innerText()).includes("The studio needs JavaScript"));
  await c.close();
  const r = await ctx({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const q = await r.newPage();
  await q.goto(BASE + "/", { waitUntil: "networkidle" });
  ok("reduced-motion: gateway cards visible immediately", (await q.locator("[data-gate]").first().evaluate((e) => getComputedStyle(e).opacity)) === "1");
  await r.close();
}

await b.close();
console.log(`\n${pass}/${pass + fails.length} passed`);
if (fails.length) {
  console.log("FAILED:\n- " + fails.join("\n- "));
  process.exit(1);
}
