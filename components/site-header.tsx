"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AmmanClock } from "@/components/amman-clock";
import { LanguageSwitch, ThemeSwitch, useCopy } from "@/components/prefs";
import { brand } from "@/lib/site";

export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const c = useCopy();
  return (
    <header data-header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label={c.homeAria}>
          <span className="gold-text text-xl font-bold tracking-wide">{c.brand}</span>
          <span className="hidden rounded-full border border-gold/40 px-2 py-0.5 text-[11px] text-gold-strong sm:inline">{c.concept}</span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label={c.mainNav}>
          {c.nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={path === n.href ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 text-sm transition ${path === n.href ? "bg-gold-soft text-gold-strong" : "text-muted hover:text-ink"}`}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitch />
          <ThemeSwitch />
          <AmmanClock className="hidden xl:flex" />
          <a href={brand.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary hidden px-4 text-sm sm:inline-flex">
            {c.whatsapp}
          </a>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="grid size-11 cursor-pointer place-items-center rounded-xl text-ink transition hover:bg-raised lg:hidden"
            aria-expanded={open}
            aria-controls="mnav"
            aria-label={c.menu}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mnav" className="border-t border-line px-4 py-3 lg:hidden" aria-label={c.menu}>
          <ul className="grid gap-1">
            {c.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} onClick={() => setOpen(false)} className={`block rounded-lg px-3 py-2.5 ${path === n.href ? "bg-gold-soft text-gold-strong" : "text-ink"}`}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <AmmanClock className="mt-3" />
        </nav>
      )}
    </header>
  );
}
