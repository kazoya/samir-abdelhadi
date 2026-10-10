import { ar } from "./ar";
import { de } from "./de";
import { en, type Copy } from "./en";
import { tr } from "./tr";

export type { Copy };
export const LOCALES = ["en", "ar", "tr", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const THEMES = ["night", "light", "desert", "aqua"] as const;
export type ThemeId = (typeof THEMES)[number];

export const packs: Record<Locale, Copy> = { en, ar, tr, de };

export const LOCALE_KEY = "abdelhadi-locale";
export const THEME_KEY = "abdelhadi-theme";

export function isLocale(v: string | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function isTheme(v: string | null): v is ThemeId {
  return !!v && (THEMES as readonly string[]).includes(v);
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export const dateLocales: Record<Locale, string> = { en: "en-GB", ar: "ar-JO", tr: "tr-TR", de: "de-DE" };
