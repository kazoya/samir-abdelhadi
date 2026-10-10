import type { Metadata } from "next";
import { ServiceExplorer } from "@/components/service-explorer";
import { CtaLink, PageHead, Source } from "@/components/ui";
import { GHINA_ENGINE } from "@/lib/site";

export const metadata: Metadata = { title: "المسارات" };

export default function ServicesPage() {
  return (
    <>
      <PageHead kicker="مسارات الحضور" title="أحد عشر مساراً تختار منها، ولا تشتريها من هنا">
        <p>الأسماء كُتبت لهذا التصور فوق محرك التوصيات المأخوذ من تصور غنى ميديا. افتح «متى تحتاجها؟» أو ابدأ خطة. لا أسعار.</p>
      </PageHead>
      <ServiceExplorer />
      <div className="mt-10">
        <CtaLink href="/planner">ابدأ من خمسة أسئلة</CtaLink>
      </div>
      <Source page="محرك ghina-media-concept" href={GHINA_ENGINE} />
    </>
  );
}
