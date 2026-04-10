"use client";

import { useLanguageStore } from "@/store/useLanguageStore";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguageStore();

  return (
    <div className="flex gap-1">
      <Button
        variant={locale === "hu" ? "default" : "outline"}
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() => setLocale("hu")}
      >
        🇭🇺 HU
      </Button>
      <Button
        variant={locale === "en" ? "default" : "outline"}
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={() => setLocale("en")}
      >
        🇬🇧 EN
      </Button>
    </div>
  );
}
