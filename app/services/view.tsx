"use client";

import { ServiceExplorer } from "@/components/service-explorer";
import { useCopy } from "@/components/prefs";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { GHINA_ENGINE } from "@/lib/site";

export function ServicesView() {
  const c = useCopy();
  return (
    <>
      <PageHead kicker={c.services.kicker} title={c.services.title}>
        <p>{c.services.lead}</p>
      </PageHead>
      <ServiceExplorer />
      <div className="mt-10">
        <CtaLink href="/planner">{c.services.cta}</CtaLink>
      </div>
      <Source page={c.services.sourceLine} href={GHINA_ENGINE} />
    </>
  );
}
