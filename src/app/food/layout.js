import AutoScrollHeroCarousel from "@/components/layout/AutoScrollHeroCarousel";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import FoodTabs from "@/components/menu/FoodTabs";
import { buildMenuHeroSlides } from "@/lib/menu-hero-images";
import { sortMenusForDisplay } from "@/lib/menu-order";
import { getMenus } from "@/sanity/lib/queries";

function menuHref(menu) {
  return menu.slug ? `/food/${menu.slug}` : "/food/menu";
}

function buildFoodLinks(menus = []) {
  return menus
    .filter((menu) => menu.slug && menu.title)
    .map((menu) => ({
      label: menu.title,
      href: menuHref(menu),
    }));
}

export default async function FoodLayout({ children }) {
  const menus = await getMenus();
  const visibleMenus = sortMenusForDisplay(
    menus.filter((menu) => menu.showOnWebsite !== false),
  );
  const foodLinks = buildFoodLinks(visibleMenus);
  const heroSlides = buildMenuHeroSlides(visibleMenus, menuHref);

  return (
    <>
      {heroSlides.length ? (
        <AutoScrollHeroCarousel slides={heroSlides} />
      ) : (
        <PageIntro
          eyebrow="Food & Drink"
          title="Food and drink at the White Horse Inn."
          description="Explore our menus for relaxed pub dining, Sunday visits, family meals, desserts, and drinks."
        />
      )}

      <section className="relative z-20 bg-[color:var(--color-surface)] py-16 md:py-20">
        <SectionReveal className="site-container px-2">
          <FoodTabs links={foodLinks} />
          <div className="pt-10">{children}</div>
        </SectionReveal>
      </section>
    </>
  );
}
