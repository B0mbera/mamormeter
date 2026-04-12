import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateUserPayload } from "@/types";
import { containsProfanity } from "@/lib/profanity";

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserPayload = await request.json();

    if (!body.name || !body.weightKg || !body.gender) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    const trimmedName = body.name.trim().slice(0, 20);
    if (trimmedName.length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (containsProfanity(trimmedName)) {
      return NextResponse.json(
        { error: "Choose a nicer nickname" },
        { status: 400 }
      );
    }

    if (body.weightKg < 30 || body.weightKg > 250) {
      return NextResponse.json(
        { error: "Weight must be 30-250 kg" },
        { status: 400 }
      );
    }

    if (body.gender !== "male" && body.gender !== "female") {
      return NextResponse.json(
        { error: "Invalid gender" },
        { status: 400 }
      );
    }

    const validParties = ["FIDESZ", "TISZA", "MIHAZANK", "DK", "MKKP"];
    const university = body.university && validParties.includes(body.university)
      ? body.university
      : null;

    const user = await prisma.user.create({
      data: {
        name: trimmedName,
        weightKg: body.weightKg,
        gender: body.gender,
        emoji: body.emoji || "🍻",
        university,
      },
      include: { drinks: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
