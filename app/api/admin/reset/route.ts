import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Admin not configured" }, { status: 503 });
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const drinks = await prisma.drink.deleteMany({});
    const users = await prisma.user.deleteMany({});
    return NextResponse.json({ deleted: { drinks: drinks.count, users: users.count } });
  } catch (err) {
    console.error("Admin reset error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
