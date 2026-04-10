"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Trophy, UserPlus } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const { t } = useLanguageStore();

  useEffect(() => {
    if (userId) {
      router.replace("/dashboard");
    }
  }, [userId, router]);

  if (userId) {
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

      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <span className="text-6xl block">🍻</span>
          <h1 className="text-3xl sm:text-4xl font-bold">MámorMéter</h1>
          <p className="text-sm font-bold text-violet-600 dark:text-violet-400">
            53. Medikus Kupa · Pécs 2026
          </p>
          <p className="text-[10px] text-muted-foreground">április 9–11.</p>
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
      </div>
    </div>
  );
}
