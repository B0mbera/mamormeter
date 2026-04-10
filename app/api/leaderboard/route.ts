import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille, calculateTotalAlcoholGrams } from "@/lib/widmark";
import { ApiResponse, LeaderboardEntry } from "@/types";

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
      };
    });

    if (period === "alltime") {
      entries.sort((a, b) => b.totalAlcoholGrams - a.totalAlcoholGrams);
    } else {
      entries.sort(
        (a, b) => b.promille.currentPromille - a.promille.currentPromille
      );
    }

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return NextResponse.json<ApiResponse<LeaderboardEntry[]>>({
      success: true,
      data: entries,
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
