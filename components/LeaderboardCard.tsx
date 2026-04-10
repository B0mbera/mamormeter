"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeaderboardEntry } from "@/types";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getStatusText, getSoberingText } from "@/lib/i18n";
import { getUniversity } from "@/lib/constants";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  isCurrentUser: boolean;
  mode: "24h" | "alltime";
}

function getRankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
}

/** Aggregate drinks into a human-readable summary like "3× Beer 5dl, 2× Vodka" */
function getDrinkSummary(drinks: LeaderboardEntry["user"]["drinks"]): string {
  if (drinks.length === 0) return "";
  const counts: Record<string, number> = {};
  for (const d of drinks) {
    const label = d.ml > 0 ? `${d.name} ${d.ml}ml` : d.name;
    counts[label] = (counts[label] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([name, count]) => (count > 1 ? `${count}× ${name}` : name))
    .join(", ");
}

export function LeaderboardCard({ entry, isCurrentUser, mode }: LeaderboardCardProps) {
  const { locale, t } = useLanguageStore();
  const { user, promille, totalAlcoholGrams, rank } = entry;
  const uni = getUniversity(user.university);
  const [expanded, setExpanded] = useState(false);

  const standardDrinks = Math.round((totalAlcoholGrams / 10) * 10) / 10;
  const drinkSummary = getDrinkSummary(user.drinks);

  return (
    <Card
      className={`cursor-pointer select-none transition-colors ${
        isCurrentUser ? "border-primary/50 bg-primary/5" : ""
      }`}
      onClick={() => setExpanded((v) => !v)}
    >
      <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xl sm:text-2xl font-bold w-8 sm:w-10 text-center shrink-0">
            {getRankDisplay(rank)}
          </div>

          {uni ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
              <Image src={uni.logo} alt={uni.id} width={28} height={28} className="rounded-sm object-contain" />
            </div>
          ) : (
            <div className="text-2xl sm:text-3xl shrink-0">🍻</div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-semibold text-sm sm:text-base truncate">{user.name}</p>
              {isCurrentUser && (
                <Badge variant="secondary" className="text-[9px] sm:text-[10px] px-1.5 py-0">
                  {t("leaderboard.you")}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              {uni && (
                <span className="text-[10px] font-medium" style={{ color: uni.color }}>
                  {uni.id}
                </span>
              )}
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {mode === "alltime"
                  ? t("leaderboard.totalDrinks", { count: standardDrinks })
                  : promille.currentPromille > 0
                  ? getSoberingText(promille.soberingMinutes, locale)
                  : getStatusText("sober", locale)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <div className="text-right">
              {mode === "24h" ? (
                <>
                  <p
                    className="text-xl sm:text-2xl font-bold tabular-nums"
                    style={{ color: promille.statusColor }}
                  >
                    {promille.currentPromille.toFixed(2)}‰
                  </p>
                  <Badge
                    className="text-[9px] sm:text-[10px] mt-0.5"
                    style={{
                      backgroundColor: promille.statusColor,
                      color: "white",
                      borderColor: "transparent",
                    }}
                  >
                    {getStatusText(promille.status, locale)}
                  </Badge>
                </>
              ) : (
                <p className="text-xl sm:text-2xl font-bold tabular-nums text-primary">
                  {standardDrinks}
                </p>
              )}
            </div>
            <div className="text-muted-foreground ml-1">
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </div>
          </div>
        </div>

        {/* Expanded drink summary */}
        {expanded && drinkSummary && (
          <div className="mt-2 pt-2 border-t text-[11px] sm:text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {t("leaderboard.drinkSummary")}:
            </span>{" "}
            {drinkSummary}
          </div>
        )}
        {expanded && !drinkSummary && (
          <div className="mt-2 pt-2 border-t text-[11px] sm:text-xs text-muted-foreground">
            {t("leaderboard.empty")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

