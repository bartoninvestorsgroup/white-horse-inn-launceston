import { notFound } from "next/navigation";
import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { buildMetadata } from "@/lib/seo";
import { getMenuBySlug, getMenus } from "@/sanity/lib/queries";

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
    appendSiteName: false,
  });
}

export default async function DynamicFoodMenuPage({ params }) {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug);

  if (!menu) {
    notFound();
  }

  return (
    <MenuPageShell
      seoKey="menu"
      title={menu.title}
      activeHref={`/food/${menu.slug}`}
    >
      <SanityMenuView menus={[menu]} emptyTitle={`${menu.title} coming soon`} />
    </MenuPageShell>
  );
}
