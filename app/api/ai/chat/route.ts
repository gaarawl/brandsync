import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { messages } = await req.json();

  // Fetch user context from DB
  const userId = session.user.id;
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
    (p) => p.status === "overdue" || (p.status === "pending" && p.dueDate && new Date(p.dueDate) < new Date())
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

  return NextResponse.json({ message: text });
}
