"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UniversityLeaderboardEntry } from "@/types";
import { useLanguageStore } from "@/store/useLanguageStore";
import { getUniversity } from "@/lib/constants";
import Image from "next/image";

interface UniversityLeaderboardCardProps {
  entry: UniversityLeaderboardEntry;
  mode: "24h" | "alltime";
}

function getRankDisplay(rank: number): string {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}.`;
}

export function UniversityLeaderboardCard({
  entry,
  mode,
}: UniversityLeaderboardCardProps) {
  const { t } = useLanguageStore();
  const uni = getUniversity(entry.universityId);
  if (!uni) return null;

  return (
    <Card>
      <CardContent className="pt-3 pb-3 sm:pt-4 sm:pb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xl sm:text-2xl font-bold w-8 sm:w-10 text-center shrink-0">
            {getRankDisplay(entry.rank)}
          </div>

          <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
            <Image
              src={uni.logo}
              alt={uni.id}
              width={28}
              height={28}
              className="rounded-sm object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p
              className="font-semibold text-sm sm:text-base truncate"
              style={{ color: uni.color }}
            >
              {uni.id}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {t("leaderboard.members", { count: entry.memberCount })}
            </p>
          </div>

          <div className="text-right shrink-0">
            {mode === "24h" ? (
              <>
                <p
                  className="text-xl sm:text-2xl font-bold tabular-nums"
                  style={{ color: uni.color }}
                >
                  {entry.avgPromille.toFixed(2)}‰
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("leaderboard.avgPromille", { val: entry.avgPromille.toFixed(2) })}
                </p>
              </>
            ) : (
              <>
                <p
                  className="text-xl sm:text-2xl font-bold tabular-nums"
                  style={{ color: uni.color }}
                >
                  {entry.totalAlcoholGrams}g
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {t("leaderboard.totalAlcohol", { val: entry.totalAlcoholGrams })}
                </p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
