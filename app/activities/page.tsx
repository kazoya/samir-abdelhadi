import type { Metadata } from "next";
import { ActivitiesView } from "./view";

export const metadata: Metadata = { title: "Public record" };

export default function ActivitiesPage() {
  return <ActivitiesView />;
}
