import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApiResponse, CreateUserPayload } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserPayload = await request.json();

    if (!body.name || !body.weightKg || !body.gender || !body.emoji) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "All fields required" },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim().slice(0, 20);
    if (trimmedName.length === 0) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    if (body.weightKg < 30 || body.weightKg > 250) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Weight must be 30-250 kg" },
        { status: 400 }
      );
    }

    if (body.gender !== "male" && body.gender !== "female") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "Invalid gender" },
        { status: 400 }
      );
    }

    const validUnis = ["DOTE", "POTE", "SOTE", "SZOTE"];
    const university = body.university && validUnis.includes(body.university)
      ? body.university
      : null;

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        weightKg: body.weightKg,
        gender: body.gender,
        emoji: body.emoji,
        university,
      },
      include: { drinks: true },
    });

    return NextResponse.json<ApiResponse<typeof user>>({
      success: true,
      data: user,
    });
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
