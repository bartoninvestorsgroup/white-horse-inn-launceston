import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getPageMetadata } from "@/lib/seo-config";
import { getMenusByTypes } from "@/sanity/lib/queries";

export const metadata = getPageMetadata("kidsMenu");

export default async function KidsMenuPage() {
  const menus = await getMenusByTypes("kidsMenu");

  return (
    <MenuPageShell
      seoKey="kidsMenu"
      eyebrow="Kids Menu"
      title="Kids Menu"
      description="Family-friendly food options for younger guests."
      activeHref="/food/kids-menu"
    >
      <SanityMenuView menus={menus} emptyTitle="Kids menu coming soon" />
    </MenuPageShell>
  );
}
