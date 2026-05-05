import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille, calculateTotalAlcoholGrams } from "@/lib/widmark";
import { LeaderboardEntry, PartyScore } from "@/types";
import { TOP_UNIVERSITIES, LEADERBOARD_TOP_N } from "@/lib/universities";
import { getCached, setCached } from "@/lib/cache";

export const dynamic = "force-dynamic";

const LEADERBOARD_LIMIT = 50;
const CACHE_TTL = 5000; // 5 seconds in-memory

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "24h";
    const university = searchParams.get("university") || null;

    const cacheKey = `lb:${period}:${university || "all"}`;
    const cached = getCached<{ entries: LeaderboardEntry[]; partyScores: PartyScore[] }>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
        },
      });
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Only load users who actually have drinks in the relevant period
    const whereClause = {
      ...(university ? { university } : {}),
      drinks: {
        some: period === "alltime" ? {} : { consumedAt: { gte: twentyFourHoursAgo } },
      },
    };

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        weightKg: true,
        gender: true,
        emoji: true,
        university: true,
        createdAt: true,
        drinks: {
          where: period === "alltime" ? {} : { consumedAt: { gte: twentyFourHoursAgo } },
          orderBy: { consumedAt: "desc" },
          select: {
            name: true,
            ml: true,
            alcoholPct: true,
            consumedAt: true,
          },
        },
      },
    });

    // For alltime, calculate total alcohol grams per user
    let alltimeGramsMap: Map<string, number> | null = null;
    if (period === "alltime") {
      alltimeGramsMap = new Map();
      for (const user of users) {
        const grams = calculateTotalAlcoholGrams(
          user.drinks.map((d) => ({
            ml: d.ml,
            alcoholPct: d.alcoholPct,
            consumedAt: d.consumedAt.toISOString(),
          }))
        );
        alltimeGramsMap.set(user.id, grams);
      }
    }

    const entries: LeaderboardEntry[] = users.map((user) => {
      const drinkInputs = user.drinks.map((d) => ({
        ml: d.ml,
        alcoholPct: d.alcoholPct,
        consumedAt: d.consumedAt.toISOString(),
      }));

      const promille = calculatePromille(
        drinkInputs,
        user.weightKg,
        user.gender as "male" | "female"
      );

      const totalAlcoholGrams = alltimeGramsMap
        ? (alltimeGramsMap.get(user.id) || 0)
        : calculateTotalAlcoholGrams(drinkInputs);

      // Build drink summary
      const drinkCounts: Record<string, number> = {};
      for (const d of user.drinks) {
        drinkCounts[d.name] = (drinkCounts[d.name] || 0) + 1;
      }
      const drinksSummary = Object.entries(drinkCounts).map(
        ([name, count]) => (count > 1 ? `${count}× ${name}` : name)
      );

      return {
        user: {
          id: user.id,
          name: user.name,
          weightKg: user.weightKg,
          gender: user.gender as "male" | "female",
          emoji: user.emoji,
          university: user.university,
          createdAt: user.createdAt.toISOString(),
          drinks: [],
        },
        promille,
        totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
        rank: 0,
        drinksSummary,
      };
    });

    // Sort and limit
    if (period === "alltime") {
      entries.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      entries.sort(
        (a, b) => b.promille.currentPromille - a.promille.currentPromille
      );
    }

    const limited = entries.slice(0, LEADERBOARD_LIMIT);
    limited.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Build party scores using lightweight aggregation
    // Count members per party (only those with drinks in period)
    const memberCounts = await prisma.user.groupBy({
      by: ["university"],
      where: {
        university: { not: null },
        drinks: {
          some: period === "alltime" ? {} : { consumedAt: { gte: twentyFourHoursAgo } },
        },
      },
      _count: { id: true },
    });

    const memberCountMap = new Map(
      memberCounts.map((m) => [m.university, m._count.id])
    );

    // For party promille totals, use the already-computed entries (all of them, not just limited)
    const partyTotals = new Map<string, { promille: number; grams: number }>();
    for (const e of entries) {
      const pid = e.user.university;
      if (!pid) continue;
      const prev = partyTotals.get(pid) || { promille: 0, grams: 0 };
      prev.promille += e.promille.currentPromille;
      prev.grams += e.totalAlcoholGrams;
      partyTotals.set(pid, prev);
    }

    const partyScores: PartyScore[] = TOP_UNIVERSITIES.map((uni) => {
      const totals = partyTotals.get(uni.id) || { promille: 0, grams: 0 };
      return {
        partyId: uni.id,
        name: uni.name,
        nameEn: uni.nameEn,
        color: uni.color,
        emoji: uni.emoji,
        totalPromille: Math.round(totals.promille * 100) / 100,
        totalAlcoholGrams: Math.round(totals.grams * 10) / 10,
        memberCount: memberCountMap.get(uni.id) || 0,
        rank: 0,
      };
    });

    if (period === "alltime") {
      partyScores.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      partyScores.sort((a, b) => b.totalPromille - a.totalPromille);
    }
    partyScores.forEach((p, i) => {
      p.rank = i + 1;
    });

    const topPartyScores = partyScores.slice(0, LEADERBOARD_TOP_N);

    const result = { entries: limited, partyScores: topPartyScores };
    setCached(cacheKey, result, CACHE_TTL);

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
