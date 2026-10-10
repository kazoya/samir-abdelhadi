"use client";

import { QRCodeSVG } from "qrcode.react";
import { useCopy } from "@/components/prefs";
import { brand, developer } from "@/lib/site";

export function DevQr() {
  const c = useCopy();
  return (
    <figure className="w-fit rounded-2xl bg-white p-3">
      <QRCodeSVG value={developer.whatsappUrl} size={112} fgColor="#110f0d" bgColor="#ffffff" level="M" title={c.devQr} />
      <figcaption className="mt-1 text-center text-[11px] font-bold text-[#110f0d]">{c.devQr}</figcaption>
    </figure>
  );
}

export function BrandQr() {
  const c = useCopy();
  return (
    <figure className="w-fit rounded-2xl bg-white p-4">
      <QRCodeSVG value={brand.whatsappUrl} size={168} fgColor="#110f0d" bgColor="#ffffff" level="M" title={c.brandQr} />
      <figcaption className="mt-2 text-center text-xs font-bold text-[#110f0d]">{c.brandQr}</figcaption>
    </figure>
  );
}
