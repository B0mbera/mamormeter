import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculatePromille } from "@/lib/widmark";
import { UserWithPromille } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        drinks: { orderBy: { consumedAt: "desc" } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentDrinks = user.drinks.filter(
      (d) => new Date(d.consumedAt) >= twentyFourHoursAgo
    );

    const promille = calculatePromille(
      recentDrinks.map((d) => ({
        ml: d.ml,
        alcoholPct: d.alcoholPct,
        consumedAt: d.consumedAt.toISOString(),
      })),
      user.weightKg,
      user.gender as "male" | "female"
    );

    const response: UserWithPromille = {
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
      promille,
    };

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
