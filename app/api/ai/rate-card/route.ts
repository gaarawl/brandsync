import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getGemini, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

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

  const { platforms, followers, engagementRate, niche } = await req.json();
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

  const platformList = Array.isArray(platforms) ? platforms.join(", ") : platforms;

  const prompt = `Tu es un expert en tarification pour créateurs de contenu / influenceurs sur le marché français.

MISSION : Génère une grille tarifaire personnalisée basée sur les informations du créateur.

DONNÉES DU CRÉATEUR :
- Plateforme(s) : ${platformList}
- Nombre d'abonnés : ${followers}
- Taux d'engagement : ${engagementRate}%
- Niche/catégorie : ${niche}

RÈGLES DE TARIFICATION :
- Base le prix sur le CPM (coût pour mille impressions) standard du marché français
- Ajuste selon le taux d'engagement (>3% = premium, >5% = très premium)
- Les niches tech, finance, luxe = tarifs plus élevés
- Les niches lifestyle, humour = tarifs standard
- Prends en compte la plateforme (YouTube > Instagram > TikTok en CPM)
- Sois réaliste avec les tarifs pour le marché français

RÉPONDS UNIQUEMENT en JSON valide, sans markdown, sans backticks, avec cette structure exacte :
{
  "rates": [
    { "type": "Story Instagram", "price": 150, "description": "1 story avec lien" }
  ],
  "notes": "Courte note explicative sur la logique de pricing (2-3 phrases max)",
  "range": { "min": 100, "max": 2000 }
}

Inclus les types de contenu pertinents pour la/les plateforme(s) sélectionnée(s) :
- Instagram : Story, Post feed, Reel, Carrousel, Live
- TikTok : Vidéo TikTok, Live TikTok, Série TikTok (3 vidéos)
- YouTube : Vidéo intégrée, Vidéo dédiée, Short YouTube, Mention
- Snapchat : Story Snap, Filtre sponsorisé
- Twitter : Tweet sponsorisé, Thread
- Général (toujours inclure) : Pack mensuel, Ambassadeur (tarif mensuel)

Génère ma grille tarifaire pour ${platformList} avec ${followers} abonnés, ${engagementRate}% d'engagement, niche : ${niche}.`;

  let text = "";
  try {
    const model = getGemini().getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    text = result.response.text();
  } catch (e) {
    console.error("Gemini rate-card error:", e);
    return NextResponse.json(
      { error: "ai_error", message: "Génération indisponible, réessaie dans un instant." },
      { status: 503 }
    );
  }

  const parsed = parseAIJson(text);

  await prisma.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, count: 1 },
  });

  const newUsed = currentCount + 1;

  if (parsed) {
    return NextResponse.json({
      rates: parsed,
      usage: { used: newUsed, limit, plan, remaining: limit - newUsed },
    });
  }

  return NextResponse.json({
    rates: null,
    raw: text,
    usage: { used: newUsed, limit, plan, remaining: limit - newUsed },
  });
}
