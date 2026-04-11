import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autoris\u00E9" }, { status: 401 });
  }

  const { priceId } = await req.json();
  const userId = session.user.id;

  // Get or create Stripe customer
  const user = await prisma.user.findUnique({ where: { id: userId } });
  let customerId = user?.stripeCustomerId;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user?.email || undefined,
      name: user?.name || undefined,
      metadata: { userId },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const origin = req.headers.get("origin") || "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/settings?billing=success`,
    cancel_url: `${origin}/pricing?billing=cancelled`,
    metadata: { userId },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
