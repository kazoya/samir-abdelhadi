"use client";

import { useCopy } from "@/components/prefs";
import { DevQr } from "@/components/qr";
import { CtaLink, PageHead } from "@/components/ui";
import { developer, GHINA_ENGINE, SKILLS_REPO } from "@/lib/site";

export function DeveloperView() {
  const c = useCopy();
  return (
    <>
      <PageHead kicker={c.developer.kicker} title={c.disclaimer}>
        <p>
          {c.developer.body.includes("ghina-media-concept") ? (
            <>
              {c.developer.body.split("ghina-media-concept")[0]}
              <a className="underline" href={GHINA_ENGINE}>
                ghina-media-concept
              </a>
              {c.developer.body.split("ghina-media-concept")[1]?.split("marketingskills")[0]}
              <a className="underline" href={SKILLS_REPO}>
                marketingskills
              </a>
              {c.developer.body.split("marketingskills")[1]}
            </>
          ) : (
            c.developer.body
          )}
        </p>
      </PageHead>
      <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
        <DevQr />
        <div>
          <p className="text-lg font-bold">{developer.name}</p>
          <p className="mt-1 text-sm text-muted">{c.developer.note}</p>
          <div className="mt-4">
            <CtaLink href={developer.whatsappUrl} ghost>
              {c.developer.cta}
            </CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}
