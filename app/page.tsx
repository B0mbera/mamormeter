"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trophy, UserPlus, Wine, ChartLine, Medal, ClipboardList, Clock } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const restoreFromCookie = useUserStore((s) => s.restoreFromCookie);
  const _hasHydrated = useUserStore((s) => s._hasHydrated);
  const { t } = useLanguageStore();

  useEffect(() => {
    restoreFromCookie();
  }, [restoreFromCookie]);

  useEffect(() => {
    if (_hasHydrated && userId) {
      router.replace("/dashboard");
    }
  }, [userId, router, _hasHydrated]);

  if (_hasHydrated && userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="text-5xl">🍻</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="space-y-2">
          <span className="text-6xl block">🎪</span>
          <h1 className="text-3xl sm:text-4xl font-bold">EFOTT Ivásszámláló</h1>
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
            🍻 EFOTT 2026 · Velencei-tó
          </p>
        </div>

        {/* Intro */}
        <p className="text-sm text-muted-foreground leading-relaxed px-2">
          {t("landing.intro")}
        </p>

        {/* How it works */}
        <div className="text-left space-y-2 bg-card/60 dark:bg-card/40 rounded-xl p-4 border">
          <h2 className="text-sm font-semibold text-center">{t("landing.howTitle")}</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ClipboardList className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
              {t("landing.step1")}
            </li>
            <li className="flex items-start gap-2">
              <Wine className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
              {t("landing.step2")}
            </li>
            <li className="flex items-start gap-2">
              <ChartLine className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
              {t("landing.step3")}
            </li>
            <li className="flex items-start gap-2">
              <Medal className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
              {t("landing.step4")}
            </li>
            <li className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 text-violet-500 shrink-0" />
              {t("landing.step5")}
            </li>
          </ul>
        </div>

        {/* Features */}
        <div className="text-left space-y-2 bg-card/60 dark:bg-card/40 rounded-xl p-4 border">
          <h2 className="text-sm font-semibold text-center">{t("landing.featTitle")}</h2>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>{t("landing.feat1")}</li>
            <li>{t("landing.feat2")}</li>
            <li>{t("landing.feat3")}</li>
            <li>{t("landing.feat4")}</li>
            <li>{t("landing.feat5")}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link href="/onboarding" className="block">
            <Button className="w-full h-12 text-base gap-2" size="lg">
              <UserPlus className="h-5 w-5" />
              {t("onboarding.submit")}
            </Button>
          </Link>

          <Link href="/leaderboard" className="block">
            <Button variant="outline" className="w-full h-12 text-base gap-2" size="lg">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {t("leaderboard.title")}
            </Button>
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground text-center">
          {t("landing.disclaimer")}
        </p>
      </div>
    </div>
  );
}
