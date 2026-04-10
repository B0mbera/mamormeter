import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille, calculateTotalAlcoholGrams } from "@/lib/widmark";
import { UNIVERSITIES } from "@/lib/constants";
import { UniversityLeaderboardEntry } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "24h";

    const users = await prisma.user.findMany({
      where: { university: { not: null } },
      include: {
        drinks: { orderBy: { consumedAt: "desc" } },
      },
    });

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Aggregate per university
    const uniMap: Record<
      string,
      { totalAlcoholGrams: number; sumPromille: number; memberCount: number }
    > = {};

    for (const uni of UNIVERSITIES) {
      uniMap[uni.id] = { totalAlcoholGrams: 0, sumPromille: 0, memberCount: 0 };
    }

    for (const user of users) {
      const uniId = user.university as string;
      if (!uniMap[uniId]) continue;

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

      if (period === "alltime") {
        if (totalAlcoholGrams > 0) {
          uniMap[uniId].totalAlcoholGrams += totalAlcoholGrams;
          uniMap[uniId].memberCount += 1;
        }
      } else {
        if (promille.currentPromille > 0 || recentDrinks.length > 0) {
          uniMap[uniId].totalAlcoholGrams += totalAlcoholGrams;
          uniMap[uniId].sumPromille += promille.currentPromille;
          uniMap[uniId].memberCount += 1;
        }
      }
    }

    const entries: UniversityLeaderboardEntry[] = UNIVERSITIES.map((uni) => {
      const data = uniMap[uni.id];
      return {
        universityId: uni.id,
        totalAlcoholGrams: Math.round(data.totalAlcoholGrams * 10) / 10,
        avgPromille:
          data.memberCount > 0
            ? Math.round((data.sumPromille / data.memberCount) * 100) / 100
            : 0,
        memberCount: data.memberCount,
        rank: 0,
      };
    });

    // Sort: by avgPromille for 24h, by totalAlcoholGrams for alltime
    if (period === "alltime") {
      entries.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      entries.sort((a, b) => b.avgPromille - a.avgPromille);
    }

    entries.forEach((e, i) => {
      e.rank = i + 1;
    });

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
