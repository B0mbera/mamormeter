import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateDrinkPayload, Drink } from "@/types";
import {
  COOLDOWN_SECONDS,
  MAX_ML_PER_DRINK,
  MIN_ML_PER_DRINK,
  MAX_ALCOHOL_PCT,
} from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body: CreateDrinkPayload = await request.json();

    if (
      !body.userId ||
      !body.name?.trim() ||
      body.ml === undefined ||
      body.ml === null ||
      body.alcoholPct === undefined
    ) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    if (body.ml < MIN_ML_PER_DRINK || body.ml > MAX_ML_PER_DRINK) {
      return NextResponse.json(
        {
          error: `Amount must be ${MIN_ML_PER_DRINK}-${MAX_ML_PER_DRINK} ml`,
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

    // Validate optional consumedAt
    let consumedAt: Date | undefined;
    if (body.consumedAt) {
      const parsed = new Date(body.consumedAt);
      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: "Invalid consumedAt date" },
          { status: 400 }
        );
      }
      // Cap to current time – cannot log future drinks
      consumedAt = parsed > new Date() ? new Date() : parsed;
    }

    const user = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Cooldown only applies when no custom consumedAt is provided (i.e. logging "now").
    // Historical entries (with an explicit past consumedAt) bypass the cooldown.
    if (!consumedAt) {
      const recentDrink = await prisma.drink.findFirst({
        where: {
          userId: body.userId,
          consumedAt: { gte: new Date(Date.now() - COOLDOWN_SECONDS * 1000) },
        },
        orderBy: { consumedAt: "desc" },
      });

      if (recentDrink) {
        const elapsed =
          (Date.now() - new Date(recentDrink.consumedAt).getTime()) / 1000;
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
    }

    const drink = await prisma.drink.create({
      data: {
        userId: body.userId,
        name: body.name.trim().slice(0, 50),
        ml: Math.round(body.ml),
        alcoholPct: Math.round(body.alcoholPct * 10) / 10,
        ...(consumedAt ? { consumedAt } : {}),
      },
    });

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
