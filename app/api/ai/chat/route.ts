import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getGemini, GEMINI_MODEL } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,      // 10 messages / jour
  pro: 200,      // 200 messages / jour
  business: 500, // 500 messages / jour
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
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
CONTEXTE UTILISATEUR (${session.user.name || "Créateur"}) :
- ${brands.length} marque(s) : ${brands.map((b) => `${b.name} (${b.status})`).join(", ") || "aucune"}
- ${collaborations.length} collaboration(s) : ${collaborations.map((c) => `${c.brand.name} - ${c.platform} - ${c.status} - ${c.amount}€`).join("; ") || "aucune"}
- Revenu total encaissé : ${totalRevenue}€
- ${pendingPayments.length} paiement(s) en attente (${pendingPayments.reduce((s, p) => s + p.amount, 0)}€)
- ${overduePayments.length} paiement(s) en retard
- Prochaines deadlines : ${collaborations.filter((c) => c.deadline && new Date(c.deadline) > new Date()).sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()).slice(0, 3).map((c) => `${c.brand.name} le ${new Date(c.deadline!).toLocaleDateString("fr-FR")}`).join(", ") || "aucune"}
`.trim();

  const systemPrompt = `Tu es l'assistant IA de BrandSync, une plateforme SaaS pour les créateurs de contenu qui gèrent leurs collaborations avec des marques.

Tu t'appelles BrandSync AI. Tu es expert en :
- Stratégie d'influence et création de contenu
- Négociation de tarifs avec les marques
- Gestion de collaborations et de planning
- Optimisation des revenus et pricing
- Rédaction d'emails professionnels pour les marques
- Conseils business pour les créateurs

${contextSummary}

Règles :
- Réponds toujours en français
- Sois concis et pratique (pas de blabla)
- Utilise les données du créateur pour personnaliser tes conseils
- Si on te demande de rédiger un email, fais-le directement sans demander de détails inutiles
- Propose des actions concrètes
- Tu peux utiliser des emojis avec modération
- Si une question est hors sujet (pas liée au business de créateur), réponds quand même poliment mais brièvement`;

  // Build Gemini conversation history
  const geminiHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const model = getGemini().getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: systemPrompt,
  });

  let text = "";
  try {
    const chat = model.startChat({ history: geminiHistory });
    const result = await chat.sendMessage(lastMessage.content);
    text = result.response.text();
  } catch (e) {
    console.error("Gemini chat error:", e);
    return NextResponse.json(
      { error: "ai_error", message: "L'assistant IA est temporairement indisponible, réessaie dans un instant." },
      { status: 503 }
    );
  }

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
