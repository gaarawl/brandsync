import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscriber } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    // Protect with a secret key
    const { secret } = await req.json();
    if (secret !== process.env.NEWSLETTER_SECRET) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Read the newsletter HTML template
    const htmlPath = join(process.cwd(), "lib", "emails", "newsletter-launch.html");
    const htmlContent = readFileSync(htmlPath, "utf-8");

    // Get all subscribers
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
        // Small delay to avoid rate limiting
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
