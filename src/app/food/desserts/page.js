import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getPageMetadata } from "@/lib/seo-config";
import { getMenusByTypes } from "@/sanity/lib/queries";

export const metadata = getPageMetadata("desserts");

export default async function DessertsPage() {
  const menus = await getMenusByTypes("dessertsMenu");

  return (
    <MenuPageShell
      seoKey="desserts"
      eyebrow="Desserts"
      title="Desserts"
      description="Sweet treats and comforting puddings to finish your meal."
      activeHref="/food/desserts"
    >
      <SanityMenuView menus={menus} emptyTitle="Dessert menu coming soon" />
    </MenuPageShell>
  );
}
