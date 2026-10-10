import type { Metadata } from "next";
import { Suspense } from "react";
import { Studio } from "@/components/studio/studio";
import { PageHead } from "@/components/ui";
import { brand } from "@/lib/site";

export const metadata: Metadata = { title: "Planning studio" };

export default function PlannerPage() {
  return (
    <>
      <div className="print:hidden">
        <PageHead kicker="Presence studio" title="From five questions to a 30-day plan you review yourself">
          <p>
            Answer for the situation as it is now. You get explained first recommendations from fixed rules, a four-phase plan, and an editable content calendar.
            Then you export the brief or open it in WhatsApp and send it yourself. No account and no server: everything stays in your browser unless you export it.
          </p>
        </PageHead>
      </div>
      <Suspense
        fallback={
          <div className="card min-h-[675px] p-8 text-muted md:min-h-[485px]" aria-busy="true">
            <p>Loading the studio…</p>
            <noscript>
              <p className="mt-2">
                The studio needs JavaScript. You can write directly:{" "}
                <a className="underline" href={brand.whatsappUrl}>
                  his WhatsApp
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
