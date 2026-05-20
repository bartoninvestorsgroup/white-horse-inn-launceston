import FoodFaqs from "@/components/food/FoodFaqs";
import { notFound } from "next/navigation";
import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getFoodFaqs } from "@/lib/food-faqs";
import { buildMetadata } from "@/lib/seo";
import { getMenuBySlug, getMenus } from "@/sanity/lib/queries";

function getMenuOgImage(menu) {
  return menu?.menuType === "dessertsMenu" ? "/og-desserts.jpg" : "/og-food.jpg";
}

export async function generateStaticParams() {
  const menus = await getMenus();

  return menus
    .filter((menu) => menu.slug)
    .map((menu) => ({
      slug: menu.slug,
    }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug);

  if (!menu) {
    return {};
  }

  return buildMetadata({
    title: `${menu.title} | White Horse Inn Launceston`,
    description: `View the ${menu.title} at the White Horse Inn in Launceston.`,
    path: `/food/${menu.slug}`,
    image: getMenuOgImage(menu),
    imageAlt: `${menu.title} at the White Horse Inn Launceston.`,
    appendSiteName: false,
  });
}

export default async function DynamicFoodMenuPage({ params }) {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug);

  if (!menu) {
    notFound();
  }

  const faqs = getFoodFaqs(menu.slug);

  return (
    <MenuPageShell
      seoKey="menu"
      title={menu.title}
      activeHref={`/food/${menu.slug}`}
      schemaOverrides={{
        path: `/food/${menu.slug}`,
        schemaName: `${menu.title} at White Horse Inn Launceston`,
        description: `View the ${menu.title} at the White Horse Inn in Launceston.`,
        image: getMenuOgImage(menu),
      }}
    >
      <SanityMenuView menus={[menu]} emptyTitle={`${menu.title} coming soon`} />
      <FoodFaqs faqs={faqs} />
    </MenuPageShell>
  );
}
