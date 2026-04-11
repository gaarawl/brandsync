import { getCollaborations } from "@/lib/actions/collaborations";
import { getBrands } from "@/lib/actions/brands";
import CollabListPage from "@/components/dashboard/collab-list-page";

export default async function CollaborationsPage() {
  const [collaborations, brands] = await Promise.all([
    getCollaborations(),
    getBrands(),
  ]);

  return (
    <CollabListPage
      collaborations={collaborations}
      brands={brands}
    />
  );
}
