"use client";

import { createContext, useContext, useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { dirFor, isLocale, isTheme, LOCALE_KEY, LOCALES, packs, THEME_KEY, THEMES, type Copy, type Locale, type ThemeId } from "@/lib/i18n";

type Prefs = {
  locale: Locale;
  theme: ThemeId;
  copy: Copy;
  setLocale: (l: Locale) => void;
  setTheme: (t: ThemeId) => void;
};

const Ctx = createContext<Prefs | null>(null);

function apply(locale: Locale, theme: ThemeId) {
  const root = document.documentElement;
  root.lang = locale;
  root.dir = dirFor(locale);
  root.dataset.theme = theme;
}

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [theme, setThemeState] = useState<ThemeId>("night");

  useLayoutEffect(() => {
    let nextLocale: Locale = "en";
    let nextTheme: ThemeId = "night";
    try {
      const storedLocale = localStorage.getItem(LOCALE_KEY);
      const storedTheme = localStorage.getItem(THEME_KEY);
      if (isLocale(storedLocale)) nextLocale = storedLocale;
      if (isTheme(storedTheme)) nextTheme = storedTheme;
    } catch {
      /* private browsing */
    }
    setLocaleState(nextLocale);
    setThemeState(nextTheme);
    apply(nextLocale, nextTheme);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    apply(next, theme);
    try {
      localStorage.setItem(LOCALE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const setTheme = (next: ThemeId) => {
    setThemeState(next);
    apply(locale, next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* ignore */
    }
  };

  return <Ctx.Provider value={{ locale, theme, copy: packs[locale], setLocale, setTheme }}>{children}</Ctx.Provider>;
}

export function usePrefs() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePrefs outside PrefsProvider");
  return ctx;
}

export function useCopy() {
  return usePrefs().copy;
}

const LANG: Record<Locale, string> = { en: "EN", ar: "AR", tr: "TR", de: "DE" };

export function LanguageSwitch() {
  const { locale, setLocale, copy } = usePrefs();
  return (
    <div role="group" aria-label={copy.language} className="flex overflow-hidden rounded-full border border-line bg-paper">
      {LOCALES.map((id) => (
        <button
          key={id}
          type="button"
          aria-pressed={locale === id}
          onClick={() => setLocale(id)}
          className={`min-h-9 cursor-pointer px-2.5 text-xs font-bold ${locale === id ? "bg-gold text-bg" : "text-muted hover:text-ink"}`}
        >
          {LANG[id]}
        </button>
      ))}
    </div>
  );
}

export function ThemeSwitch() {
  const { theme, setTheme, copy } = usePrefs();
  return (
    <select
      aria-label={copy.theme}
      value={theme}
      onChange={(e) => setTheme(e.target.value as ThemeId)}
      className="h-9 cursor-pointer rounded-full border border-line bg-paper px-2 text-xs font-bold text-ink"
    >
      {THEMES.map((id) => (
        <option key={id} value={id}>
          {copy.themes[id]}
        </option>
      ))}
    </select>
  );
}

export function TitleSync() {
  const path = usePathname() || "/";
  const { copy } = usePrefs();
  useLayoutEffect(() => {
    const known = copy.titles[path as keyof typeof copy.titles];
    if (!known) return;
    const next = path === "/" ? known : `${known} | Abdelhadi Presence`;
    const apply = () => {
      if (document.title !== next) document.title = next;
    };
    apply();
    const obs = new MutationObserver(apply);
    obs.observe(document.head, { subtree: true, childList: true, characterData: true });
    const timer = window.setTimeout(apply, 0);
    return () => {
      obs.disconnect();
      window.clearTimeout(timer);
    };
  }, [path, copy]);
  return null;
}
