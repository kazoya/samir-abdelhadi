"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useCopy } from "@/components/prefs";
import { brand, waLink } from "@/lib/site";

export function SalesBar() {
  const c = useCopy();
  return (
    <div data-sales-bar className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <p className="hidden text-sm text-muted md:block">{c.salesHint}</p>
        <div className="flex w-full gap-2 md:w-auto">
          <a
            href={waLink("Hello, I saw the Abdelhadi presence concept and would like to review the brief.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary flex-1 py-2 text-sm md:flex-none"
          >
            <MessageCircle size={16} aria-hidden /> {c.whatsapp}
          </a>
          <a href={brand.tel} className="btn btn-ghost flex-1 py-2 text-sm md:flex-none">
            <Phone size={16} aria-hidden /> <span className="md:hidden">{c.call}</span>
            <span className="hidden md:inline" dir="ltr">
              {brand.phoneDisplay}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
