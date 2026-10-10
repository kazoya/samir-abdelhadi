import type { Metadata } from "next";
import { ServicesView } from "./view";

export const metadata: Metadata = { title: "Paths" };

export default function ServicesPage() {
  return <ServicesView />;
}
