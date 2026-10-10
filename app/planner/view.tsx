"use client";

import { Suspense } from "react";
import { useCopy } from "@/components/prefs";
import { Studio } from "@/components/studio/studio";
import { PageHead } from "@/components/ui";
import { brand } from "@/lib/site";

export function PlannerView() {
  const c = useCopy();
  return (
    <>
      <div className="print:hidden">
        <PageHead kicker={c.planner.kicker} title={c.planner.title}>
          <p>{c.planner.lead}</p>
        </PageHead>
      </div>
      <Suspense
        fallback={
          <div className="card min-h-[675px] p-8 text-muted md:min-h-[485px]" aria-busy="true">
            <p>{c.planner.loading}</p>
            <noscript>
              <p className="mt-2">
                {c.planner.noscript}{" "}
                <a className="underline" href={brand.whatsappUrl}>
                  {c.hisWhatsapp}
                </a>
                .
              </p>
            </noscript>
          </div>
        }
      >
        <Studio />
      </Suspense>
    </>
  );
}
