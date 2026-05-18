import MenuPageShell from "@/components/menu/MenuPageShell";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("food");

export default function FoodPage() {
  return (
    <MenuPageShell
      seoKey="food"
      eyebrow="Food & Drink"
      title="Food and drink at the White Horse Inn."
      description="Explore our menus for relaxed pub dining, Sunday visits, family meals, desserts, and drinks."
      activeHref="/food"
    />
  );
}
