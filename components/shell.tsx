"use client";

import { Interactions } from "@/components/interactions";
import { TitleSync } from "@/components/prefs";
import { SalesBar } from "@/components/sales-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { useCopy } from "@/components/prefs";

export function Shell({ children }: { children: React.ReactNode }) {
  const c = useCopy();
  return (
    <>
      <TitleSync />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
      >
        {c.skip}
      </a>
      <div role="note" data-print-hide className="bg-[#ff3b3b] px-[18px] py-3.5 text-center text-[15px] font-bold leading-snug text-[#1a0505]">
        {c.payment}
      </div>
      <div role="note" data-print-hide className="bg-gold px-4 py-1.5 text-center text-xs font-bold text-bg">
        {c.disclaimer} {c.bannerExtra}
      </div>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        {children}
      </main>
      <SiteFooter />
      <SalesBar />
      <Interactions />
    </>
  );
}
