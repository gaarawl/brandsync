import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    await prisma.user.update({
      where: { id: userId },
      data: { pageViews: { increment: 1 } },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
