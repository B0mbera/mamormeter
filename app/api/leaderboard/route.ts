import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille, calculateTotalAlcoholGrams } from "@/lib/widmark";
import { LeaderboardEntry, UniversityScore } from "@/types";
import { UNIVERSITIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "24h";
    const university = searchParams.get("university") || null;

    const users = await prisma.user.findMany({
      where: university ? { university } : undefined,
      include: {
        drinks: { orderBy: { consumedAt: "desc" } },
      },
    });

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const entries: LeaderboardEntry[] = users.map((user) => {
      const recentDrinks = user.drinks.filter(
        (d) => new Date(d.consumedAt) >= twentyFourHoursAgo
      );

      const allDrinkInputs = user.drinks.map((d) => ({
        ml: d.ml,
        alcoholPct: d.alcoholPct,
        consumedAt: d.consumedAt.toISOString(),
      }));

      const recentDrinkInputs = recentDrinks.map((d) => ({
        ml: d.ml,
        alcoholPct: d.alcoholPct,
        consumedAt: d.consumedAt.toISOString(),
      }));

      const promille = calculatePromille(
        recentDrinkInputs,
        user.weightKg,
        user.gender as "male" | "female"
      );

      const totalAlcoholGrams = calculateTotalAlcoholGrams(allDrinkInputs);

      // Build drink summary: count each drink name
      const drinkCounts: Record<string, number> = {};
      const drinksToSummarize = period === "alltime" ? user.drinks : recentDrinks;
      for (const d of drinksToSummarize) {
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
          drinks: recentDrinks.map((d) => ({
            id: d.id,
            userId: d.userId,
            name: d.name,
            ml: d.ml,
            alcoholPct: d.alcoholPct,
            consumedAt: d.consumedAt.toISOString(),
          })),
        },
        promille,
        totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
        rank: 0,
        drinksSummary,
      };
    });

    // Filter out users with no activity for the selected period
    let filtered: LeaderboardEntry[];
    if (period === "alltime") {
      filtered = entries.filter((e) => e.totalAlcoholGrams > 0);
      filtered.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      filtered = entries.filter((e) => e.promille.currentPromille > 0 || e.user.drinks.length > 0);
      filtered.sort(
        (a, b) => b.promille.currentPromille - a.promille.currentPromille
      );
    }

    filtered.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    // Build university combined scores
    const uniScores: UniversityScore[] = UNIVERSITIES.map((uni) => {
      const uniEntries = entries.filter((e) => e.user.university === uni.id);
      const totalPromille = uniEntries.reduce(
        (sum, e) => sum + e.promille.currentPromille,
        0
      );
      const totalAlcoholGrams = uniEntries.reduce(
        (sum, e) => sum + e.totalAlcoholGrams,
        0
      );
      return {
        universityId: uni.id,
        name: uni.name,
        nameEn: uni.nameEn,
        color: uni.color,
        logo: uni.logo,
        totalPromille: Math.round(totalPromille * 100) / 100,
        totalAlcoholGrams: Math.round(totalAlcoholGrams * 10) / 10,
        memberCount: uniEntries.length,
        rank: 0,
      };
    });

    // Rank universities
    if (period === "alltime") {
      uniScores.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      uniScores.sort((a, b) => b.totalPromille - a.totalPromille);
    }
    uniScores.forEach((u, i) => {
      u.rank = i + 1;
    });

    return NextResponse.json({ entries: filtered, universityScores: uniScores });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
