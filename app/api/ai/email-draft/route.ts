import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 200,
  business: 500,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { prompt, context } = await req.json();
  const userId = session.user.id;

  // Check usage limits (shared with AI chat)
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

  const currentCount = usage?.count || 0;

  if (currentCount >= limit) {
    return NextResponse.json(
      {
        error: "limit_reached",
        message:
          plan === "free"
            ? `Limite de ${limit} messages/jour atteinte. Passe au Pro !`
            : `Limite de ${limit} messages/jour atteinte.`,
      },
      { status: 429 }
    );
  }

  // Fetch user context
  const [brands, collaborations] = await Promise.all([
    prisma.brand.findMany({
      where: { userId },
      select: { name: true, contact: true, email: true },
    }),
    prisma.collaboration.findMany({
      where: { userId },
      select: {
        platform: true,
        status: true,
        amount: true,
        brand: { select: { name: true } },
      },
    }),
  ]);

  const brandContext =
    brands.map((b) => `${b.name} (contact: ${b.contact || "?"}, email: ${b.email || "?"})`).join(", ") || "aucune";

  const systemPrompt = `Tu es l'assistant email de BrandSync. Tu rédiges des emails professionnels pour des créateurs de contenu qui collaborent avec des marques.

CONTEXTE DU CRÉATEUR (${session.user.name || "Créateur"}) :
- Marques partenaires : ${brandContext}
- ${collaborations.length} collaboration(s) en cours

CONSIGNES :
- Rédige UNIQUEMENT le contenu de l'email (pas le sujet, pas de "Objet:", pas de métadonnées)
- Ton professionnel mais chaleureux, adapté au monde de l'influence
- Pas de formules trop corporate, reste naturel
- Personnalise si un nom de marque ou contact est mentionné
- Réponds en français
- Ne mets PAS de signature (elle sera ajoutée automatiquement)
- Si le contexte mentionne des destinataires, adapte le contenu

${context ? `CONTEXTE SUPPLÉMENTAIRE : ${context}` : ""}`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: prompt }],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Increment usage
  await prisma.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, count: 1 },
  });

  return NextResponse.json({ content: text });
}
