import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { invalidateCache } from "@/lib/cache";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const drink = await prisma.drink.findUnique({
      where: { id },
    });

    if (!drink) {
      return NextResponse.json(
        { error: "Drink not found" },
        { status: 404 }
      );
    }

    await prisma.drink.delete({ where: { id } });

    // Invalidate leaderboard cache after drink deletion
    invalidateCache("lb:");

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
