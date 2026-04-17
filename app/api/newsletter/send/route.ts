import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscriber } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // 3 requests per IP per minute (admin endpoint)
  if (!checkRateLimit(getClientIp(req), 3, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  // Secret via Authorization header: "Bearer <NEWSLETTER_SECRET>"
  const authorization = req.headers.get("authorization");
  const secret = process.env.NEWSLETTER_SECRET;
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const htmlPath = join(process.cwd(), "lib", "emails", "newsletter-launch.html");
    const htmlContent = readFileSync(htmlPath, "utf-8");

    const subscribers = await prisma.newsletterSubscriber.findMany({
      select: { email: true },
    });

    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const sub of subscribers) {
      try {
        await sendNewsletterToSubscriber(sub.email, htmlContent);
        sent++;
        await new Promise((r) => setTimeout(r, 200));
      } catch (e) {
        failed++;
        errors.push(sub.email);
        console.error(`Failed to send to ${sub.email}:`, e);
      }
    }

    return NextResponse.json({
      total: subscribers.length,
      sent,
      failed,
      errors,
    });
  } catch (e) {
    console.error("Newsletter send error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
