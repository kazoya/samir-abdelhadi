import type { Metadata } from "next";
import { ServiceExplorer } from "@/components/service-explorer";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { GHINA_ENGINE } from "@/lib/site";

export const metadata: Metadata = { title: "Paths" };

export default function ServicesPage() {
  return (
    <>
      <PageHead kicker="Presence paths" title="Eleven paths to choose from. Nothing is sold here.">
        <p>The names were written for this concept on top of the recommendation engine taken from the Ghina Media concept. Open “When do you need it?” or start a plan. No prices.</p>
      </PageHead>
      <ServiceExplorer />
      <div className="mt-10">
        <CtaLink href="/planner">Start with five questions</CtaLink>
      </div>
      <Source page="ghina-media-concept engine" href={GHINA_ENGINE} />
    </>
  );
}
