import { getPayments } from "@/lib/actions/payments";
import { getBrands } from "@/lib/actions/brands";
import { getCollaborations } from "@/lib/actions/collaborations";
import PaymentsPage from "@/components/dashboard/payments-page";

export default async function PaiementsPage() {
  const [payments, brands, collaborations] = await Promise.all([
    getPayments(),
    getBrands(),
    getCollaborations(),
  ]);

  return (
    <PaymentsPage
      payments={payments}
      brands={brands}
      collaborations={collaborations}
    />
  );
}
