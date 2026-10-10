import type { Metadata } from "next";
import { DevQr } from "@/components/qr";
import { CtaLink, PageHead } from "@/components/ui";
import { developer, disclaimer, GHINA_ENGINE, SKILLS_REPO } from "@/lib/site";

export const metadata: Metadata = { title: "The concept" };

export default function DeveloperPage() {
  return (
    <>
      <PageHead kicker="About this concept" title={disclaimer}>
        <p>
          The interactive engine was built from the public repository{" "}
          <a className="underline" href={GHINA_ENGINE}>ghina-media-concept</a>
          : five questions, recommendations from fixed rules, a thirty-day plan, and a calendar that stays in the browser. The words were rewritten for a public presence.
          The attraction method is a short adaptation of{" "}
          <a className="underline" href={SKILLS_REPO}>marketingskills</a>
          {" "}under the MIT licence. There is no database, and nothing is sent without a click.
        </p>
      </PageHead>
      <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
        <DevQr />
        <div>
          <p className="text-lg font-bold">{developer.name}</p>
          <p className="mt-1 text-sm text-muted">To edit the concept, or to move it to a domain the office approves.</p>
          <div className="mt-4">
            <CtaLink href={developer.whatsappUrl} ghost>Developer WhatsApp</CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}
