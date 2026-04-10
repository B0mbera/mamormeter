"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Heart, ExternalLink, Coffee } from "lucide-react";

const REVOLUT_LINK = "https://revolut.me/bencesmq9";

export default function SupportPage() {
  const { t } = useLanguageStore();

  return (
    <div className="pb-20 pt-3">
      <div className="max-w-md mx-auto px-3 sm:px-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-pink-500" />
            <h1 className="text-lg sm:text-xl font-bold">
              {t("support.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="text-center space-y-2">
              <span className="text-5xl">☕</span>
              <h2 className="text-lg font-bold">{t("support.subtitle")}</h2>
              <p className="text-sm text-muted-foreground">
                {t("support.description")}
              </p>
            </div>

            <a href={REVOLUT_LINK} target="_blank" rel="noopener noreferrer">
              <Button className="w-full h-12 text-base gap-2 bg-[#0075EB] hover:bg-[#0066CC]">
                <Coffee className="h-4 w-4" />
                {t("support.button")}
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Button>
            </a>

            <p className="text-[10px] text-center text-muted-foreground">
              {t("support.thanks")}
            </p>
          </CardContent>
        </Card>

        {/* Credits */}
        <Card>
          <CardContent className="pt-5 space-y-2 text-center">
            <p className="text-sm font-semibold">🍻 MámorMéter</p>
            <p className="text-xs text-violet-600 font-medium">
              53. Medikus Kupa · Pécs 2026
            </p>
            <p className="text-xs text-muted-foreground">
              Made with ❤️ + 🍺
            </p>
          </CardContent>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
