import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const PRO_MONTHLY_PRICE_ID =
  process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "price_1TL3RuLVSEf30cSA5RBI6eKD";
const PRO_YEARLY_PRICE_ID =
  process.env.STRIPE_PRO_YEARLY_PRICE_ID || "price_1TL3RuLVSEf30cSAxbkyUNnN";
const BUSINESS_MONTHLY_PRICE_ID =
  process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || "";
const BUSINESS_YEARLY_PRICE_ID =
  process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || "";

const ALL_PRICE_IDS = [
  PRO_MONTHLY_PRICE_ID,
  PRO_YEARLY_PRICE_ID,
  BUSINESS_MONTHLY_PRICE_ID,
  BUSINESS_YEARLY_PRICE_ID,
].filter(Boolean);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("[checkout] STRIPE_SECRET_KEY missing");
      return NextResponse.json(
        { error: "Configuration Stripe manquante côté serveur" },
        { status: 500 }
      );
    }

    const { priceId } = await req.json();
    const userId = session.user.id;

    // Validate price ID
    if (!priceId || !ALL_PRICE_IDS.includes(priceId)) {
      console.error("[checkout] invalid priceId", { priceId, ALL_PRICE_IDS });
      return NextResponse.json(
        { error: `Prix invalide ou non configuré (${priceId || "vide"})` },
        { status: 400 }
      );
    }

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

    // Check if user is eligible for first-time promo
    const isMonthly = priceId === PRO_MONTHLY_PRICE_ID || priceId === BUSINESS_MONTHLY_PRICE_ID;
    const isYearly = priceId === PRO_YEARLY_PRICE_ID || priceId === BUSINESS_YEARLY_PRICE_ID;
    const eligibleForPromo = (isMonthly || isYearly) && !user?.usedPromotion;

    // Create or get the appropriate coupon
    const isPro = priceId === PRO_MONTHLY_PRICE_ID || priceId === PRO_YEARLY_PRICE_ID;
    let couponId: string | undefined;
    if (eligibleForPromo) {
      let couponName: string;
      let percentOff: number;

      if (isMonthly) {
        couponName = isPro ? "WELCOME50" : "WELCOME10";
        percentOff = isPro ? 50 : 10;
      } else {
        couponName = "WELCOME33";
        percentOff = 33;
      }

      const coupons = await getStripe().coupons.list({ limit: 100 });
      const existing = coupons.data.find((c) => c.name === couponName);

      if (existing) {
        couponId = existing.id;
      } else {
        const coupon = await getStripe().coupons.create({
          name: couponName,
          percent_off: percentOff,
          duration: "once",
        });
        couponId = coupon.id;
      }
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(couponId && {
        discounts: [{ coupon: couponId }],
      }),
      success_url: `${origin}/dashboard/settings?billing=success`,
      cancel_url: `${origin}/pricing?billing=cancelled`,
      metadata: { userId },
    });

    // Mark promo as used
    if (eligibleForPromo) {
      await prisma.user.update({
        where: { id: userId },
        data: { usedPromotion: true },
      });
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue";
    console.error("[checkout] error:", message, err);
    return NextResponse.json(
      { error: `Erreur Stripe : ${message}` },
      { status: 500 }
    );
  }
}
