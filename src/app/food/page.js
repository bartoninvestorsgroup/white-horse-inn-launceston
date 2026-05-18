import FoodFaqs from "@/components/food/FoodFaqs";
import MenuPageShell from "@/components/menu/MenuPageShell";
import { getFoodFaqs } from "@/lib/food-faqs";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("food");

export default function FoodPage() {
  const faqs = getFoodFaqs();

  return (
    <MenuPageShell
      seoKey="food"
      eyebrow="Food & Drink"
      title="Food and drink at the White Horse Inn."
      description="Explore our menus for relaxed pub dining, Sunday visits, family meals, desserts, and drinks."
      activeHref="/food"
    >
      <FoodFaqs faqs={faqs} />
    </MenuPageShell>
  );
}
