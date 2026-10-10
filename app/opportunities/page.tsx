import type { Metadata } from "next";
import { OpportunitiesView } from "./view";

export const metadata: Metadata = { title: "What comes next" };

export default function OpportunitiesPage() {
  return <OpportunitiesView />;
}
