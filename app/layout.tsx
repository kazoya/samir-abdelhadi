import type { Metadata, Viewport } from "next";
import { Interactions } from "@/components/interactions";
import { SalesBar } from "@/components/sales-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { disclaimer, paymentNotice } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Abdelhadi Presence — independent concept", template: "%s | Abdelhadi Presence" },
  description:
    "An independent concept for the public presence of Samir Yasser Abdelhadi: a sourced public record, and a planning studio that sends nothing by itself. Not the Senate website.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#110f0d" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-gold focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <div role="note" data-print-hide className="bg-[#ff3b3b] px-[18px] py-3.5 text-center text-[15px] font-bold leading-snug text-[#1a0505]">
          {paymentNotice}
        </div>
        <div role="note" data-print-hide className="bg-gold px-4 py-1.5 text-center text-xs font-bold text-bg">
          {disclaimer} Not a Senate page and not an official site.
        </div>
        <SiteHeader />
        <main id="main" className="mx-auto max-w-6xl px-4 pb-24 pt-8">
          {children}
        </main>
        <SiteFooter />
        <SalesBar />
        <Interactions />
      </body>
    </html>
  );
}
