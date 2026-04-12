"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStore } from "@/store/useUserStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";
import { LeaderboardCard } from "@/components/LeaderboardCard";
import { LeaderboardEntry, PartyScore } from "@/types";
import { PARTIES } from "@/lib/constants";
import { Trophy, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LeaderboardPage() {
  const userId = useUserStore((s) => s.userId);
  const restoreFromCookie = useUserStore((s) => s.restoreFromCookie);
  const { locale, t } = useLanguageStore();

  const [period, setPeriod] = useState<"24h" | "alltime">("24h");
  const [uniFilter, setUniFilter] = useState<string | null>(null);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [partyScores, setPartyScores] = useState<PartyScore[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const hasFetched = useRef(false);

  // Restore session from cookie on mount
  useEffect(() => {
    restoreFromCookie();
  }, [restoreFromCookie]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      let url = `/api/leaderboard?period=${period}`;
      if (uniFilter) url += `&university=${uniFilter}`;

      const res = await fetch(url);
      if (!res.ok) return;

      const data = await res.json();
      setEntries(data.entries || []);
      setPartyScores(data.partyScores || []);
    } catch {
      // ignore
    } finally {
      if (!hasFetched.current) {
        hasFetched.current = true;
        setInitialLoading(false);
      }
    }
  }, [period, uniFilter]);

  useEffect(() => {
    hasFetched.current = false;
    setInitialLoading(true);
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, [fetchLeaderboard]);

  function getRankEmoji(rank: number): string {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}.`;
  }

  const partyScoreLabel = period === "alltime"
    ? (locale === "hu" ? "Össz. standard ital" : "Total standard drinks")
    : (locale === "hu" ? "Össz. promille" : "Total promille");

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
          🗳️ Választás 2026 · Április 12.
        </p>

        {/* Party combined scores */}
        {!uniFilter && partyScores.length > 0 && (
          <Card>
            <CardContent className="pt-3 pb-3">
              <p className="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">
                {locale === "hu" ? "Párt rangsor" : "Party ranking"}
              </p>
              <div className="space-y-1.5">
                {partyScores.map((p) => (
                  <div key={p.partyId} className="flex items-center gap-2">
                    <span className="text-sm font-bold w-6 text-center">{getRankEmoji(p.rank)}</span>
                    <span className="text-base">{p.emoji}</span>
                    <span className="text-xs font-medium flex-1" style={{ color: p.color }}>
                      {p.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {p.memberCount} {locale === "hu" ? "fő" : "members"}
                    </span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: p.color }}>
                      {period === "alltime"
                        ? Math.round((p.totalAlcoholGrams / 10) * 10) / 10
                        : p.totalPromille.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {period === "alltime" ? "std" : "‰"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">{partyScoreLabel}</p>
            </CardContent>
          </Card>
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

          {/* Party filter */}
          <div className="flex gap-1.5 overflow-x-auto py-2 scrollbar-hide">
              <Button
                size="sm"
                variant={uniFilter === null ? "default" : "outline"}
                className="h-7 text-[10px] sm:text-xs shrink-0"
                onClick={() => setUniFilter(null)}
              >
                {t("leaderboard.allParties")}
              </Button>
              {PARTIES.map((party) => (
                <Button
                  key={party.id}
                  size="sm"
                  variant={uniFilter === party.id ? "default" : "outline"}
                  className="h-7 text-[10px] sm:text-xs shrink-0 gap-1"
                  style={
                    uniFilter === party.id
                      ? { backgroundColor: party.color, borderColor: party.color }
                      : {}
                  }
                  onClick={() => setUniFilter(party.id)}
                >
                  <span>{party.emoji}</span>
                  {party.id}
                </Button>
              ))}
            </div>

          <TabsContent value="24h" className="space-y-2 mt-2">
            {initialLoading ? (
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
            {initialLoading ? (
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
      {userId && <Navigation />}
    </div>
  );
}
