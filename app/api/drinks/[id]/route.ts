import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
