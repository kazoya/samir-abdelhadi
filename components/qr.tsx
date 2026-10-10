import { QRCodeSVG } from "qrcode.react";
import { brand, developer } from "@/lib/site";

export function DevQr() {
  return (
    <figure className="w-fit rounded-2xl bg-white p-3">
      <QRCodeSVG value={developer.whatsappUrl} size={112} fgColor="#110f0d" bgColor="#ffffff" level="M" title="Developer WhatsApp" />
      <figcaption className="mt-1 text-center text-[11px] font-bold text-[#110f0d]">Developer WhatsApp</figcaption>
    </figure>
  );
}

export function BrandQr() {
  return (
    <figure className="w-fit rounded-2xl bg-white p-4">
      <QRCodeSVG value={brand.whatsappUrl} size={168} fgColor="#110f0d" bgColor="#ffffff" level="M" title="WhatsApp for Samir Yasser Abdelhadi" />
      <figcaption className="mt-2 text-center text-xs font-bold text-[#110f0d]">WhatsApp, Samir Yasser Abdelhadi</figcaption>
    </figure>
  );
}
