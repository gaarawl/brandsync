import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 200,
  business: 500,
};

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autoris\u00E9" }, { status: 401 });
  }

  const userId = session.user.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  const plan = user?.plan || "free";
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  const today = new Date().toISOString().split("T")[0];

  const usage = await prisma.aiUsage.findUnique({
    where: { userId_date: { userId, date: today } },
  });

  return NextResponse.json({
    used: usage?.count || 0,
    limit,
    plan,
    remaining: Math.max(limit - (usage?.count || 0), 0),
  });
}
