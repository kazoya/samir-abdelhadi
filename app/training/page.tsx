import type { Metadata } from "next";
import { TrainingView } from "./view";

export const metadata: Metadata = { title: "Method" };

export default function TrainingPage() {
  return <TrainingView />;
}
