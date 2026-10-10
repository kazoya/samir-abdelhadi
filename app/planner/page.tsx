import type { Metadata } from "next";
import { PlannerView } from "./view";

export const metadata: Metadata = { title: "Planning studio" };

export default function PlannerPage() {
  return <PlannerView />;
}
