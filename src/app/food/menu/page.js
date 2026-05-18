import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getPageMetadata } from "@/lib/seo-config";
import { getMenusByTypes } from "@/sanity/lib/queries";

const mainMenuTypes = [
  "ourMenu",
  "lunchMenu",
  "dinnerMenu",
  "spring",
  "summer",
  "autumn",
  "winter",
  "christmas",
  "specials",
  "allYear",
];

export const metadata = getPageMetadata("menu");

export default async function MainMenuPage() {
  const menus = await getMenusByTypes(mainMenuTypes);

  return (
    <MenuPageShell
      seoKey="menu"
      eyebrow="Main Menu"
      title="Main Menu"
      activeHref="/food/menu"
    >
      <SanityMenuView menus={menus} emptyTitle="Main menu coming soon" />
    </MenuPageShell>
  );
}
