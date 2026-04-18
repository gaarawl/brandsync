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
  return <PricingPage currentPlan={currentPlan} />;
}
