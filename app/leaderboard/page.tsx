"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { UniversityLeaderboardCard } from "@/components/UniversityLeaderboardCard";
import { LeaderboardEntry, UniversityLeaderboardEntry } from "@/types";
import { UNIVERSITIES } from "@/lib/constants";
import { Trophy, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LeaderboardPage() {
  const userId = useUserStore((s) => s.userId);
  const { t } = useLanguageStore();

  const [view, setView] = useState<"individual" | "university">("individual");
  const [period, setPeriod] = useState<"24h" | "alltime">("24h");
  const [uniFilter, setUniFilter] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [uniEntries, setUniEntries] = useState<UniversityLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/leaderboard?period=${period}`;
      if (uniFilter) url += `&university=${uniFilter}`;

      const uniUrl = `/api/leaderboard/university?period=${period}`;

      const [res, uniRes] = await Promise.all([fetch(url), fetch(uniUrl)]);

      if (res.ok) {
        setEntries(await res.json());
      }
      if (uniRes.ok) {
        setUniEntries(await uniRes.json());
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [period, uniFilter]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Auto-refresh every 5s
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  return (
    <div className={userId ? "pb-20 pt-3" : "pb-6 pt-3"}>
      <div className="max-w-md mx-auto px-3 sm:px-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!userId && (
              <Link href="/">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <Trophy className="h-5 w-5 text-yellow-500" />
            <h1 className="text-lg sm:text-xl font-bold">
              {t("leaderboard.title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>

        <p className="text-xs text-center text-violet-600 font-medium">
          53. Medikus Kupa · Pécs 2026
        </p>

        {/* View toggle: Individual vs University */}
        <div className="flex gap-1.5">
          <Button
            size="sm"
            variant={view === "individual" ? "default" : "outline"}
            className="flex-1 h-8 text-xs"
            onClick={() => setView("individual")}
          >
            {t("leaderboard.title")}
          </Button>
          <Button
            size="sm"
            variant={view === "university" ? "default" : "outline"}
            className="flex-1 h-8 text-xs"
            onClick={() => setView("university")}
          >
            {t("leaderboard.university")}
          </Button>
        </div>

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

          {view === "individual" && (
            <>
              {/* University filter */}
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

              <TabsContent value="24h" className="space-y-2 mt-2">
                {loading ? (
                  <p className="text-center text-sm text-muted-foreground py-8">⏳</p>
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
                  <p className="text-center text-sm text-muted-foreground py-8">⏳</p>
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
            </>
          )}

          {view === "university" && (
            <>
              <TabsContent value="24h" className="space-y-2 mt-2">
                {loading ? (
                  <p className="text-center text-sm text-muted-foreground py-8">⏳</p>
                ) : uniEntries.filter((e) => e.memberCount > 0).length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    🍺 {t("leaderboard.emptyUni")}
                  </p>
                ) : (
                  uniEntries.map((entry) => (
                    <UniversityLeaderboardCard
                      key={entry.universityId}
                      entry={entry}
                      mode="24h"
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="alltime" className="space-y-2 mt-2">
                {loading ? (
                  <p className="text-center text-sm text-muted-foreground py-8">⏳</p>
                ) : uniEntries.filter((e) => e.memberCount > 0).length === 0 ? (
                  <p className="text-center text-sm text-muted-foreground py-8">
                    🍺 {t("leaderboard.emptyAlltime")}
                  </p>
                ) : (
                  uniEntries.map((entry) => (
                    <UniversityLeaderboardCard
                      key={entry.universityId}
                      entry={entry}
                      mode="alltime"
                    />
                  ))
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      {userId && <Navigation />}
    </div>
  );
}

