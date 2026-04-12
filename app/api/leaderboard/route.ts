import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille, calculateTotalAlcoholGrams } from "@/lib/widmark";
import { LeaderboardEntry, PartyScore } from "@/types";
import { PARTIES } from "@/lib/constants";
import { getCached, setCached } from "@/lib/cache";

export const dynamic = "force-dynamic";

const LEADERBOARD_LIMIT = 200;
const CACHE_TTL = 3000; // 3 seconds in-memory

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

    // Build party combined scores from ALL matching entries (not just limited)
    const partyScores: PartyScore[] = PARTIES.map((party) => {
      const partyEntries = entries.filter((e) => e.user.university === party.id);
      const totalPromille = partyEntries.reduce(
        (sum, e) => sum + e.promille.currentPromille,
        0
      );
      const totalAlcoholGrams = partyEntries.reduce(
        (sum, e) => sum + e.totalAlcoholGrams,
        0
      );
      return {
        partyId: party.id,
        name: party.name,
        nameEn: party.nameEn,
        color: party.color,
        emoji: party.emoji,
        totalPromille: Math.round(totalPromille * 100) / 100,
        totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
        memberCount: partyEntries.length,
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

    const result = { entries: limited, partyScores };
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
