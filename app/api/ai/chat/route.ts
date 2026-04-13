import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const PLAN_LIMITS: Record<string, number> = {
  free: 10,      // 10 messages / jour
  pro: 200,      // 200 messages / jour
  business: 500, // 500 messages / jour
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autoris\u00E9" }, { status: 401 });
  }

  const { messages } = await req.json();
  const userId = session.user.id;

  // Check user plan and daily usage
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
        message: plan === "free"
          ? `Tu as atteint ta limite de ${limit} messages/jour. Passe au plan Pro pour 200 messages/jour !`
          : `Tu as atteint ta limite de ${limit} messages/jour.`,
        limit,
        used: currentCount,
        plan,
      },
      { status: 429 }
    );
  }

  // Fetch user context from DB
  const [brands, collaborations, payments] = await Promise.all([
    prisma.brand.findMany({
      where: { userId },
      select: { name: true, status: true, contact: true },
    }),
    prisma.collaboration.findMany({
      where: { userId },
      select: {
        platform: true,
        status: true,
        amount: true,
        deliverables: true,
        deadline: true,
        brand: { select: { name: true } },
      },
    }),
    prisma.payment.findMany({
      where: { userId },
      select: {
        amount: true,
        status: true,
        dueDate: true,
        brand: { select: { name: true } },
      },
    }),
  ]);

  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === "pending");
  const overduePayments = payments.filter(
    (p) =>
      p.status === "overdue" ||
      (p.status === "pending" && p.dueDate && new Date(p.dueDate) < new Date())
  );

  const contextSummary = `
CONTEXTE UTILISATEUR (${session.user.name || "Cr\u00E9ateur"}) :
- ${brands.length} marque(s) : ${brands.map((b) => `${b.name} (${b.status})`).join(", ") || "aucune"}
- ${collaborations.length} collaboration(s) : ${collaborations.map((c) => `${c.brand.name} - ${c.platform} - ${c.status} - ${c.amount}\u20AC`).join("; ") || "aucune"}
- Revenu total encaiss\u00E9 : ${totalRevenue}\u20AC
- ${pendingPayments.length} paiement(s) en attente (${pendingPayments.reduce((s, p) => s + p.amount, 0)}\u20AC)
- ${overduePayments.length} paiement(s) en retard
- Prochaines deadlines : ${collaborations.filter((c) => c.deadline && new Date(c.deadline) > new Date()).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()).slice(0, 3).map((c) => `${c.brand.name} le ${new Date(c.deadline!).toLocaleDateString("fr-FR")}`).join(", ") || "aucune"}
`.trim();

  const systemPrompt = `Tu es l'assistant IA de BrandSync, une plateforme SaaS pour les cr\u00E9ateurs de contenu qui g\u00E8rent leurs collaborations avec des marques.

Tu t'appelles BrandSync AI. Tu es expert en :
- Strat\u00E9gie d'influence et cr\u00E9ation de contenu
- N\u00E9gociation de tarifs avec les marques
- Gestion de collaborations et de planning
- Optimisation des revenus et pricing
- R\u00E9daction d'emails professionnels pour les marques
- Conseils business pour les cr\u00E9ateurs

${contextSummary}

R\u00E8gles :
- R\u00E9ponds toujours en fran\u00E7ais
- Sois concis et pratique (pas de blabla)
- Utilise les donn\u00E9es du cr\u00E9ateur pour personnaliser tes conseils
- Si on te demande de r\u00E9diger un email, fais-le directement sans demander de d\u00E9tails inutiles
- Propose des actions concr\u00E8tes
- Tu peux utiliser des emojis avec mod\u00E9ration
- Si une question est hors sujet (pas li\u00E9e au business de cr\u00E9ateur), r\u00E9ponds quand m\u00EAme poliment mais bri\u00E8vement`;

  const response = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  // Increment usage counter
  await prisma.aiUsage.upsert({
    where: { userId_date: { userId, date: today } },
    update: { count: { increment: 1 } },
    create: { userId, date: today, count: 1 },
  });

  return NextResponse.json({
    message: text,
    usage: {
      used: currentCount + 1,
      limit,
      plan,
    },
  });
}
