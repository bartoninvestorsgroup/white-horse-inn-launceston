import FoodFaqs from "@/components/food/FoodFaqs";
import { notFound } from "next/navigation";
import Link from "next/link";
import MenuPageShell from "@/components/menu/MenuPageShell";
import SanityMenuView from "@/components/menu/SanityMenuView";
import { getFoodFaqs } from "@/lib/food-faqs";
import { buildMetadata } from "@/lib/seo";
import { getMenuBySlug, getMenus } from "@/sanity/lib/queries";

const temporaryHiddenMenuPages = {
  "lunch-menu": {
    title: "Lunch Menu",
    description:
      "Our lunch menu is being finalised and will be released in the next 7 days.",
  },
  "dinner-menu": {
    title: "Dinner Menu",
    description:
      "Our dinner menu is being finalised and will be released in the next 7 days.",
  },
  "sunday-menu": {
    title: "Sunday Menu",
    description:
      "Our Sunday menu is being finalised and will be released in the next 7 days.",
  },
};

function getTemporaryHiddenMenuPage(slug, menu) {
  const temporaryPage = temporaryHiddenMenuPages[slug];

  if (!temporaryPage || (menu && menu.showOnWebsite !== false)) {
    return null;
  }

  return {
    ...temporaryPage,
    title: menu?.title || temporaryPage.title,
    slug,
  };
}

function getMenuOgImage(menu) {
  return menu?.menuType === "dessertsMenu" ? "/og-desserts.jpg" : "/og-food.jpg";
}

export async function generateStaticParams() {
  const menus = await getMenus();
  const slugs = new Set([
    ...menus.filter((menu) => menu.slug).map((menu) => menu.slug),
    ...Object.keys(temporaryHiddenMenuPages),
  ]);

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug);
  const temporaryPage = getTemporaryHiddenMenuPage(slug, menu);

  if (temporaryPage) {
    return buildMetadata({
      title: `${temporaryPage.title} Coming Soon | White Horse Inn Launceston`,
      description: temporaryPage.description,
      path: `/food/${slug}`,
      image: "/og-food.jpg",
      imageAlt: "A freshly prepared dish from the White Horse Inn food menu.",
      appendSiteName: false,
    });
  }

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

function TemporaryHiddenMenuPage({ page }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="eyebrow">Menus coming soon</p>
      <h1 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl">
        {page.title} is nearly ready.
      </h1>
      <div className="mx-auto mt-6 max-w-2xl space-y-4 text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg">
        <p>
          We have just opened the pub and are finalising this menu now. It will
          be released in the next 7 days.
        </p>
        <p>
          In the meantime, you can still view the menus currently available or
          book a table with us.
        </p>
      </div>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/food"
          className="inline-flex min-h-12 items-center justify-center rounded-[0.9rem] border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[color:rgba(var(--color-primary-rgb),0.88)] hover:text-white"
        >
          View current menus
        </Link>
        <Link
          href="/book-a-table"
          className="inline-flex min-h-12 items-center justify-center rounded-[0.9rem] border border-[color:var(--color-border-soft)] px-5 py-3 text-sm font-extrabold text-[color:var(--color-primary)] transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-primary)]"
        >
          Book a table
        </Link>
      </div>
    </div>
  );
}

export default async function DynamicFoodMenuPage({ params }) {
  const { slug } = await params;
  const menu = await getMenuBySlug(slug);
  const temporaryPage = getTemporaryHiddenMenuPage(slug, menu);

  if (temporaryPage) {
    return (
      <MenuPageShell
        seoKey="food"
        title={temporaryPage.title}
        activeHref={`/food/${temporaryPage.slug}`}
        schemaOverrides={{
          path: `/food/${temporaryPage.slug}`,
          schemaName: `${temporaryPage.title} at White Horse Inn Launceston`,
          description: temporaryPage.description,
          image: "/og-food.jpg",
        }}
      >
        <TemporaryHiddenMenuPage page={temporaryPage} />
      </MenuPageShell>
    );
  }

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
