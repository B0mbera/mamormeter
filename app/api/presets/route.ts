import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DrinkPreset } from "@/types";

export async function GET() {
  try {
    const presets = await prisma.drinkPreset.findMany({
      orderBy: { name: "asc" },
    });

    const response: DrinkPreset[] = presets.map((p) => ({
      id: p.id,
      name: p.name,
      nameEn: p.nameEn,
      ml: p.ml,
      alcoholPct: p.alcoholPct,
      category: p.category,
      categoryEn: p.categoryEn,
      emoji: p.emoji,
    }));

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
