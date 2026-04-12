import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DrinkPreset } from "@/types";
import { getCached, setCached } from "@/lib/cache";

export const dynamic = "force-dynamic";

const CACHE_KEY = "presets";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes in-memory

export async function GET() {
  try {
    const cached = getCached<DrinkPreset[]>(CACHE_KEY);
    if (cached) {
      return NextResponse.json(cached, {
        headers: {
          "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
          "CDN-Cache-Control": "public, max-age=86400",
        },
      });
    }

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

    setCached(CACHE_KEY, response, CACHE_TTL);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
        "CDN-Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
