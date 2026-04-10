"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Navigation } from "@/components/Navigation";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { LeaderboardEntry } from "@/types";
import { UNIVERSITIES, isMedikus } from "@/lib/constants";
import { Trophy } from "lucide-react";
import Image from "next/image";

export default function LeaderboardPage() {
  const router = useRouter();
  const userId = useUserStore((s) => s.userId);
  const { locale, t } = useLanguageStore();
  const medikus = isMedikus();

  const [period, setPeriod] = useState<"24h" | "alltime">("24h");
  const [uniFilter, setUniFilter] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/leaderboard?period=${period}`;
      if (uniFilter) url += `&university=${uniFilter}`;

      const res = await fetch(url);
      if (!res.ok) return;

      const data = await res.json();
      setEntries(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [period, uniFilter]);

  useEffect(() => {
    if (!userId) {
      router.replace("/onboarding");
      return;
    }
    fetchLeaderboard();
  }, [userId, router, fetchLeaderboard]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className="pb-20 pt-3">
      <div className="max-w-md mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h1 className="text-lg sm:text-xl font-bold">
              {t("leaderboard.title")}
            </h1>
          </div>
          <LanguageSwitcher />
        </div>

        {medikus && (
          <p className="text-xs text-center text-violet-600 font-medium">
            53. Medikus Kupa · Pécs 2026
          </p>
        )}

        {/* Period tabs */}
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as "24h" | "alltime")}
          className="w-full"
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="24h">{t("leaderboard.24h")}</TabsTrigger>
            <TabsTrigger value="alltime">{t("leaderboard.alltime")}</TabsTrigger>
          </TabsList>

          {/* University filter (Medikus only) */}
          {medikus && (
            <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-hide">
              <Button
                size="sm"
                variant={uniFilter === null ? "default" : "outline"}
                className="h-7 text-[10px] sm:text-xs shrink-0"
                onClick={() => setUniFilter(null)}
              >
                {t("leaderboard.allUnis")}
              </Button>
              {UNIVERSITIES.map((uni) => (
                <Button
                  key={uni.id}
                  size="sm"
                  variant={uniFilter === uni.id ? "default" : "outline"}
                  className="h-7 text-[10px] sm:text-xs shrink-0 gap-1"
                  style={
                    uniFilter === uni.id
                      ? { backgroundColor: uni.color, borderColor: uni.color }
                      : {}
                  }
                  onClick={() => setUniFilter(uni.id)}
                >
                  <Image
                    src={uni.logo}
                    alt={uni.id}
                    width={14}
                    height={14}
                    className="rounded-sm"
                  />
                  {uni.id}
                </Button>
              ))}
            </div>
          )}

          <TabsContent value="24h" className="space-y-2 mt-2">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                ⏳
              </p>
            ) : entries.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                🍺 {t("leaderboard.empty")}
              </p>
            ) : (
              entries.map((entry) => (
                <LeaderboardCard
                  key={entry.user.id}
                  entry={entry}
                  isCurrentUser={entry.user.id === userId}
                  mode="24h"
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="alltime" className="space-y-2 mt-2">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                ⏳
              </p>
            ) : entries.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                🍺 {t("leaderboard.emptyAlltime")}
              </p>
            ) : (
              entries.map((entry) => (
                <LeaderboardCard
                  key={entry.user.id}
                  entry={entry}
                  isCurrentUser={entry.user.id === userId}
                  mode="alltime"
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </div>
  );
}
