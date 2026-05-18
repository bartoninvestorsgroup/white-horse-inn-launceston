import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getPageMetadata } from "@/lib/seo-config";
import { getMenusByTypes } from "@/sanity/lib/queries";

export const metadata = getPageMetadata("sundayMenu");

export default async function SundayMenuPage() {
  const menus = await getMenusByTypes("sundayMenu");

  return (
    <MenuPageShell
      seoKey="sundayMenu"
      eyebrow="Sunday Menu"
      title="Sunday Menu"
      description="Comforting Sunday favourites served in a warm and welcoming pub setting."
      activeHref="/food/sunday-menu"
    >
      <SanityMenuView menus={menus} emptyTitle="Sunday menu coming soon" />
    </MenuPageShell>
  );
}
