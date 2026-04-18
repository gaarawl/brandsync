import PricingPage from "@/components/pricing-page";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function Pricing() {
  const session = await auth();
  let currentPlan: string | null = null;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });
    currentPlan = user?.plan || "free";
  }

  const priceIds = {
    proMonthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
    proYearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
    businessMonthly: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID || "",
    businessYearly: process.env.STRIPE_BUSINESS_YEARLY_PRICE_ID || "",
  };

  return <PricingPage currentPlan={currentPlan} priceIds={priceIds} />;
}
