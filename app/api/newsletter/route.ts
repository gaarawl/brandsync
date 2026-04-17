import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscriber } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const subscribeSchema = z.object({
  email: z.string().email().max(254),
});

export async function POST(req: NextRequest) {
  // 5 requests per IP per minute
  if (!checkRateLimit(getClientIp(req), 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const normalized = parsed.data.email.trim().toLowerCase();

    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalized },
    });

    try {
      const htmlPath = join(process.cwd(), "lib", "emails", "newsletter-launch.html");
      const htmlContent = readFileSync(htmlPath, "utf-8");
      await sendNewsletterToSubscriber(normalized, htmlContent);
    } catch (e) {
      console.error("Failed to send newsletter to", normalized, e);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
