"use client";

import Link from "next/link";
import { AmmanClock } from "@/components/amman-clock";
import { useCopy } from "@/components/prefs";
import { DevQr } from "@/components/qr";
import { brand, developer } from "@/lib/site";

export function SiteFooter() {
  const c = useCopy();
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="gold-text text-xl font-bold">{c.brand}</p>
          <p className="mt-3 max-w-md text-sm leading-7 text-muted">{c.footerBlurb}</p>
          <ul className="mt-4 grid gap-1 text-sm">
            <li>
              <a className="hover:text-gold-strong" href={brand.tel} dir="ltr">
                {brand.phoneDisplay}
              </a>
              <span className="text-muted"> {c.hisWhatsapp}</span>
            </li>
            <li className="text-muted">{c.contact.city}</li>
          </ul>
          <AmmanClock className="mt-5 w-fit" />
        </div>
        <div className="text-sm">
          <p className="font-bold">{c.theSite}</p>
          <ul className="mt-3 grid gap-2 text-muted">
            {c.nav.map((n) => (
              <li key={n.href}>
                <Link className="hover:text-ink" href={n.href}>
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-ink" href="/developer">
                {c.developerLink}
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-bold">
            {c.developerLabel}: {developer.name}
          </p>
          <DevQr />
        </div>
      </div>
      <div className="border-t border-line py-4 pb-20 text-center text-xs text-muted">
        <span className="rounded-full bg-gold-soft px-3 py-1 font-bold text-gold-strong">{c.disclaimer}</span>
      </div>
    </footer>
  );
}
