import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateDrinkPayload, Drink } from "@/types";
import {
  COOLDOWN_SECONDS,
  MAX_ML_PER_DRINK,
  MAX_ALCOHOL_PCT,
} from "@/lib/constants";
import { invalidateCache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const body: CreateDrinkPayload = await request.json();

    if (
      !body.userId ||
      !body.name?.trim() ||
      !body.ml ||
      body.alcoholPct === undefined
    ) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (body.ml < 0 || body.ml > MAX_ML_PER_DRINK) {
      return NextResponse.json(
        {
          error: `Amount must be 0-${MAX_ML_PER_DRINK} ml`,
        },
        { status: 400 }
      );
    }

    if (body.alcoholPct < 0 || body.alcoholPct > MAX_ALCOHOL_PCT) {
      return NextResponse.json(
        { error: `Alcohol must be 0-${MAX_ALCOHOL_PCT}%` },
        { status: 400 }
      );
    }

    // Combined user lookup + cooldown check in one query
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      select: {
        id: true,
        drinks: {
          orderBy: { consumedAt: "desc" },
          take: 1,
          select: { consumedAt: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Cooldown check
    if (user.drinks.length > 0) {
      const elapsed =
        (Date.now() - new Date(user.drinks[0].consumedAt).getTime()) / 1000;
      if (elapsed < COOLDOWN_SECONDS) {
        const remaining = Math.ceil(COOLDOWN_SECONDS - elapsed);
        return NextResponse.json(
          {
            error: `Cooldown: wait ${remaining} seconds`,
          },
          { status: 429 }
        );
      }
    }

    const drink = await prisma.drink.create({
      data: {
        userId: body.userId,
        name: body.name.trim().slice(0, 50),
        ml: Math.round(body.ml),
        alcoholPct: Math.round(body.alcoholPct * 10) / 10,
        ...(body.consumedAt ? { consumedAt: new Date(body.consumedAt) } : {}),
      },
    });

    // Invalidate leaderboard cache after new drink
    invalidateCache("lb:");

    const drinkResponse: Drink = {
      id: drink.id,
      userId: drink.userId,
      name: drink.name,
      ml: drink.ml,
      alcoholPct: drink.alcoholPct,
      consumedAt: drink.consumedAt.toISOString(),
    };

    return NextResponse.json(drinkResponse);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
