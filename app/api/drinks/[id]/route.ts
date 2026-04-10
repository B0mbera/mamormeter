import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const drink = await prisma.drink.findUnique({
      where: { id: params.id },
    });

    if (!drink) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Drink not found" },
        { status: 404 }
      );
    }

    await prisma.drink.delete({ where: { id: params.id } });

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      data: { id: params.id },
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
