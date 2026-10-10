"use client";

import Link from "next/link";
import { useCopy } from "@/components/prefs";

export function PageHead({ kicker, title, children }: { kicker: string; title: string; children?: React.ReactNode }) {
  return (
    <header className="rise mb-10 max-w-3xl">
      <p className="text-sm font-bold text-gold">{kicker}</p>
      <h1 className="mt-2 text-3xl font-bold leading-snug md:text-4xl">{title}</h1>
      {children && <div className="mt-4 leading-8 text-muted">{children}</div>}
    </header>
  );
}

export function Source({ page, href }: { page: string; href: string }) {
  const c = useCopy();
  return (
    <p className="mt-8 text-xs text-muted">
      {c.activities.source}: {page}{" "}
      <a className="underline hover:text-gold-strong" href={href} target="_blank" rel="noopener noreferrer">
        {c.activities.link}
      </a>
    </p>
  );
}

export function CtaLink({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  const cls = ghost ? "btn btn-ghost" : "btn btn-primary";
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
