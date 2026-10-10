import { services, type ServiceId } from "@/lib/site";
import type { Copy } from "./en";

export function serviceIndex(id: string) {
  return services.findIndex((s) => s.id === id);
}

export function serviceName(copy: Copy, id: string) {
  const i = serviceIndex(id);
  return i < 0 ? id : copy.services.names[i];
}

export function serviceDesc(copy: Copy, id: string) {
  const i = serviceIndex(id);
  return i < 0 ? "" : copy.services.desc[i];
}

export function serviceGuideAt(copy: Copy, id: ServiceId) {
  const i = serviceIndex(id);
  return copy.services.guide[i] ?? ["", "", ""];
}
