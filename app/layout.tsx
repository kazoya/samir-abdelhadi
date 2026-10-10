import type { Metadata, Viewport } from "next";
import { PrefsProvider } from "@/components/prefs";
import { Shell } from "@/components/shell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Abdelhadi Presence — independent concept", template: "%s | Abdelhadi Presence" },
  description:
    "An independent concept for the public presence of Samir Yasser Abdelhadi: a sourced public record, and a planning studio that sends nothing by itself. Not the Senate website.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#110f0d" };

const boot = `(function(){var d=document.documentElement;d.classList.add("js");try{var l=localStorage.getItem("abdelhadi-locale");var t=localStorage.getItem("abdelhadi-theme");if(l==="en"||l==="ar"||l==="tr"||l==="de"){d.lang=l;d.dir=l==="ar"?"rtl":"ltr"}if(t==="night"||t==="light"||t==="desert"||t==="aqua")d.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-theme="night" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <PrefsProvider>
          <Shell>{children}</Shell>
        </PrefsProvider>
      </body>
    </html>
  );
}
