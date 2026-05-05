import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CreateUserPayload } from "@/types";
import { containsProfanity } from "@/lib/profanity";
import { TOP_UNIVERSITIES, NON_STUDENT_ID, OTHER_ID } from "@/lib/universities";

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

    const validTopIds = new Set([
      ...TOP_UNIVERSITIES.map((u) => u.id),
      NON_STUDENT_ID,
    ]);

    let university: string | null = null;
    if (body.university) {
      const raw = body.university.toString();
      if (validTopIds.has(raw)) {
        university = raw;
      } else if (raw.startsWith(OTHER_ID + ":")) {
        const custom = raw.slice(OTHER_ID.length + 1).trim().slice(0, 40);
        if (custom.length === 0) {
          return NextResponse.json(
            { error: "University name required" },
            { status: 400 }
          );
        }
        if (containsProfanity(custom)) {
          return NextResponse.json(
            { error: "Choose a nicer university name" },
            { status: 400 }
          );
        }
        university = `${OTHER_ID}:${custom}`;
      } else {
        return NextResponse.json(
          { error: "Invalid university" },
          { status: 400 }
        );
      }
    }

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
