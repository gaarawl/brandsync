import { prisma } from "@/lib/prisma";
import { sendNewsletterToSubscriber } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      );
    }

    const normalized = email.trim().toLowerCase();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalized },
    });

    if (existing) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    await prisma.newsletterSubscriber.create({
      data: { email: normalized },
    });

    // Send the newsletter immediately
    try {
      const htmlPath = join(process.cwd(), "lib", "emails", "newsletter-launch.html");
      const htmlContent = readFileSync(htmlPath, "utf-8");
      await sendNewsletterToSubscriber(normalized, htmlContent);
    } catch (e) {
      console.error("Failed to send newsletter to", normalized, e);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
