import type { Metadata } from "next";
import { DevQr } from "@/components/qr";
import { CtaLink, PageHead } from "@/components/ui";
import { developer, disclaimer, GHINA_ENGINE, SKILLS_REPO } from "@/lib/site";

export const metadata: Metadata = { title: "فكرة المنصة" };

export default function DeveloperPage() {
  return (
    <>
      <PageHead kicker="عن هذا التصور" title={disclaimer}>
        <p>
          بُني المحرك التفاعلي من المستودع العام{" "}
          <a className="underline" href={GHINA_ENGINE}>ghina-media-concept</a>
          : خمسة أسئلة، توصيات بقواعد ثابتة، خطة ثلاثين يوماً، وتقويم يبقى في المتصفح. أُعيدت النصوص إلى حضور عام.
          منهج الجذب مختصر من{" "}
          <a className="underline" href={SKILLS_REPO}>marketingskills</a>
          {" "}برخصة MIT. لا قاعدة بيانات، ولا إرسال دون نقرة.
        </p>
      </PageHead>
      <div className="card flex flex-col items-start gap-6 p-8 md:flex-row md:items-center">
        <DevQr />
        <div>
          <p className="text-lg font-bold">{developer.name}</p>
          <p className="mt-1 text-sm text-muted">لتعديل التصور أو نقله إلى نطاق يعتمده المكتب.</p>
          <div className="mt-4">
            <CtaLink href={developer.whatsappUrl} ghost>واتساب المطوّر</CtaLink>
          </div>
        </div>
      </div>
    </>
  );
}
