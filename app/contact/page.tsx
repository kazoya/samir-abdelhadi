import type { Metadata } from "next";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { BrandQr } from "@/components/qr";
import { PageHead } from "@/components/ui";
import { brand, developer } from "@/lib/site";

export const metadata: Metadata = { title: "تواصل" };

export default function ContactPage() {
  const rows = [
    { icon: MessageCircle, l: "واتسابه", v: brand.phoneDisplay, href: brand.whatsappUrl, ltr: true },
    { icon: Phone, l: "هاتفه", v: brand.phoneDisplay, href: brand.tel, ltr: true },
    { icon: MapPin, l: "المدينة في السجل", v: brand.addressAr, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(brand.addressEn)}`, ltr: false },
  ];
  return (
    <>
      <PageHead kicker="تواصل" title="واتسابه كما زوّده صاحب التصور">
        <p>
          الرقم ليس من صفحة مجلس الأعيان. ساعات الدوام: {brand.hours}. الرسالة لا تُرسل إلا إذا ضغطت الرابط. لتعديل الصفحة نفسها، واتساب المطوّر{" "}
          <a className="underline" href={developer.whatsappUrl}>
            {developer.name}
          </a>
          .
        </p>
      </PageHead>
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-3">
          {rows.map((r) => (
            <li key={r.l}>
              <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card flex min-h-16 items-center gap-4 p-5">
                <r.icon className="text-gold" aria-hidden />
                <span className="text-sm text-muted">{r.l}</span>
                <span className="ms-auto font-bold" dir={r.ltr ? "ltr" : undefined}>{r.v}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="card grid place-items-center p-8">
          <BrandQr />
        </div>
      </div>
    </>
  );
}
