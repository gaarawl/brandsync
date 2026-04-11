import { getBrands } from "@/lib/actions/brands";
import BrandList from "@/components/dashboard/brand-list";

export default async function MarquesPage() {
  const brands = await getBrands();
  return <BrandList brands={brands} />;
}
