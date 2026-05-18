import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getPageMetadata } from "@/lib/seo-config";
import { getMenusByTypes } from "@/sanity/lib/queries";

export const metadata = getPageMetadata("drinks");

export default async function DrinksPage() {
  const menus = await getMenusByTypes("drinksMenu");

  return (
    <MenuPageShell
      seoKey="drinks"
      eyebrow="Drinks List"
      title="Drinks List"
      description="Draught beers, wines, spirits, soft drinks, and pub favourites."
      activeHref="/food/drinks"
    >
      <SanityMenuView menus={menus} emptyTitle="Drinks list coming soon" />
    </MenuPageShell>
  );
}
