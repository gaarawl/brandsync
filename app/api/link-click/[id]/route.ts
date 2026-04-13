import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.link.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
