import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

const PRO_PRICE_IDS = [
  process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  process.env.STRIPE_PRO_YEARLY_PRICE_ID,
].filter(Boolean);

const BUSINESS_PRICE_IDS = [
  process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
  process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID,
].filter(Boolean);

function getPlanFromSubscription(subscription: any): string {
  const priceId = subscription.items?.data?.[0]?.price?.id;
  if (priceId && BUSINESS_PRICE_IDS.includes(priceId)) return "business";
  if (priceId && PRO_PRICE_IDS.includes(priceId)) return "pro";
  // Default: if we can't detect, keep pro (backwards compat)
  return "pro";
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = getStripe().webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } else {
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const customerId = session.customer as string;
      const usedCoupon = session.metadata?.usedCoupon === "true";

      // Retrieve subscription to detect plan
      let plan = "pro";
      if (session.subscription) {
        try {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription as string
          );
          plan = getPlanFromSubscription(subscription);
        } catch {
          // Fallback to pro
        }
      }

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          plan,
          ...(usedCoupon && { usedPromotion: true }),
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;
      const status = subscription.status;

      const plan = status === "active" ? getPlanFromSubscription(subscription) : "free";

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const customerId = subscription.customer as string;

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { plan: "free" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
