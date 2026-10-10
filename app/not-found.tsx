"use client";

import { CtaLink } from "@/components/ui";
import { useCopy } from "@/components/prefs";

export default function NotFound() {
  const c = useCopy();
  return (
    <div className="grid place-items-center py-24 text-center">
      <p className="gold-text text-6xl font-bold">404</p>
      <p className="mt-4 text-muted">{c.notFound}</p>
      <div className="mt-6">
        <CtaLink href="/">{c.backHome}</CtaLink>
      </div>
    </div>
  );
}
