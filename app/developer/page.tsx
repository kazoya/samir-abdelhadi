import type { Metadata } from "next";
import { DeveloperView } from "./view";

export const metadata: Metadata = { title: "The concept" };

export default function DeveloperPage() {
  return <DeveloperView />;
}
