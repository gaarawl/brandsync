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

function parseAIJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      try {
        return JSON.parse(match[1].trim());
      } catch {}
    }
    const trimmed = text.replace(/^[^{[]*/, "").replace(/[^}\]]*$/, "");
    try {
      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { briefText } = await req.json();
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

  const systemPrompt = `Tu es un assistant expert en analyse de briefs pour créateurs de contenu.

MISSION : Extrais les informations structurées d'un email ou brief de marque.

RÈGLES :
- Extrais le maximum d'informations du texte fourni
- Si une information n'est pas trouvée, mets null
- Le budget/montant doit être un nombre entier en euros (pas de décimales). Si c'est en dollars, convertis approximativement.
- La deadline doit être au format YYYY-MM-DD si trouvée
- Pour le statut, mets toujours "lead" (c'est un nouveau brief)
- Pour la plateforme, choisis parmi : TikTok, Instagram, YouTube, Snapchat, Twitter, Autre
- Si plusieurs plateformes sont mentionnées, choisis la principale
- Pour les livrables, sois précis (ex: "2 reels + 3 stories" plutôt que "du contenu")

RÉPONDS UNIQUEMENT en JSON valide, sans markdown, sans backticks :
{
  "brandName": "Nom de la marque",
  "brandEmail": "email@marque.com",
  "brandContact": "Nom du contact",
  "platform": "Instagram",
  "deliverables": "Description des livrables",
  "amount": 500,
  "deadline": "2026-05-15",
  "notes": "Résumé des points clés du brief (2-3 phrases)",
  "confidence": "high"
}

Le champ "confidence" indique ta confiance dans l'extraction : "high" si le brief est clair et complet, "medium" si certaines infos sont incertaines ou manquantes, "low" si le texte est très ambigu.`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: `Analyse ce brief/email et extrais les informations :\n\n${briefText}`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  const parsed = parseAIJson(text);

  await prisma.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, count: 1 },
  });

  const newUsed = currentCount + 1;

  if (parsed) {
    return NextResponse.json({
      parsed,
      usage: { used: newUsed, limit, plan, remaining: limit - newUsed },
    });
  }

  return NextResponse.json({
    parsed: null,
    raw: text,
    usage: { used: newUsed, limit, plan, remaining: limit - newUsed },
  });
}
