import AutoScrollHeroCarousel from "@/components/layout/AutoScrollHeroCarousel";
import FixedRevealSection from "@/components/layout/FixedRevealSection";
import SectionReveal from "@/components/layout/SectionReveal";
import HomeAboutStory from "@/components/home/HomeAboutStory";
import HomeFoodShowcase from "@/components/home/HomeFoodShowcase";
import StructuredData from "@/components/seo/StructuredData";
import FoodImageCard from "@/components/ui/FoodImageCard";
import { getLocalPageHero } from "@/lib/content";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";

export const metadata = getPageMetadata("home");

const homeSchema = getPageSchema("home");

const foodCards = [
  {
    src: "/assets/images/food_and_drink/IMG-20260409-WA0034_hero_2000.jpg",
    alt: "Selection of roast dinners with traditional trimmings",
    title: "Sunday Roasts",
    description:
      "Generous plates, traditional trimmings and the kind of roast worth gathering around.",
    eyebrow: "Pub Classics",
    size: "portrait",
    innerBorderTone: "gold",
  },
  {
    src: "/assets/images/food_and_drink/FB_IMG_1775752352654_hero_2000.jpg",
    alt: "Beef Wellington plated in a premium pub dining setting",
    title: "Seasonal Favourites",
    description:
      "Thoughtfully prepared dishes that bring a more elevated feel to relaxed pub dining.",
    eyebrow: "Chef's Picks",
    size: "portrait",
    innerBorderTone: "soft",
  },
  {
    src: "/assets/images/food_and_drink/PXL_20260124_141824715_hero_2000.jpg",
    alt: "Poached eggs on toasted potato cake",
    title: "Brunch & Specials",
    description:
      "Fresh, inviting plates that add variety to the menu and give guests another reason to return.",
    eyebrow: "Kitchen Moments",
    size: "portrait",
    innerBorderTone: "gold",
  },
];

const aboutCards = [
  {
    title: "A Proper Launceston Local",
    body: "The White Horse Inn is a welcoming pub in the heart of Launceston, built around good food, friendly service and easy moments around the table. Whether you are calling in for a drink, staying overnight or gathering for a family meal, the aim is simple: make every visit feel comfortable and looked after.",
    alignment: "left",
  },
  {
    title: "Food, Drink and Rooms Under One Roof",
    body: "From seasonal pub dishes and Sunday favourites to comfortable accommodation, the inn is set up for everything from relaxed lunches to longer stays. It is a straightforward, characterful place to eat, drink, rest and spend time with people.",
    alignment: "right",
  },
  {
    title: "Room for Gatherings",
    body: "Alongside the pub and dining spaces, our large function room gives guests a practical setting for birthdays, private events, meetings and local celebrations, with the team on hand to help shape the details.",
    alignment: "left",
  },
];

export default function HomePage() {
  const heroSlides = getLocalPageHero("home")?.slides || [];

  return (
    <>
      <StructuredData data={homeSchema} />
      <AutoScrollHeroCarousel slides={heroSlides} />

      <section className="page-section no-snap-zone relative z-20 bg-[color:var(--muted)]">
        <SectionReveal className="site-container px-2 py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Food & Drink</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
              Seasonal dishes, pub favourites and plates worth making time for.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[color:var(--color-copy-soft)]">
              From comforting classics to beautifully presented specials, our
              food offering is shaped around quality ingredients, warm
              hospitality and the kind of dining people come back for.
            </p>
          </div>
          <HomeFoodShowcase cards={foodCards} />
        </SectionReveal>
      </section>

      <FixedRevealSection
        src="/assets/images/locations/PXL_20250611_210014049.MP_hero_2000.jpg"
        alt="Exterior view of the White Horse Inn"
        zoomRange={[1.02, 1.2]}
        contentClassName="no-snap-zone relative"
        revealHeightClassName="h-[72svh] md:h-[88svh]"
      >
        <div className="site-container flex w-full items-end px-2 pb-12 md:pb-18">
          <HomeAboutStory cards={aboutCards} />
        </div>
      </FixedRevealSection>

      <section className="page-section no-snap-zone relative z-20 bg-[color:var(--color-surface)]">
        <SectionReveal className="site-container space-y-6 px-2 py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Food & Drink</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
              A taste of what we&apos;re about...
            </h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--color-copy-soft)]">
              Seasonal ingredients, classic pours, and dishes built with real
              local character.
            </p>
          </div>

          <FoodImageCard
            src="/assets/images/food_and_drink/cocktail.png"
            alt="An old fashioned cocktail with whiskey and orange peel"
            title="Cocktail Selection"
            description="Try our extensive range of cocktails, from timeless classics to modern twists."
            eyebrow="Signature Pour"
            size="landscape"
            innerBorderTone="gold"
            blurFrame
            className="h-[280px] md:h-auto md:aspect-[16/6]"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FoodImageCard
              src="/assets/images/food_and_drink/scallops.png"
              alt="Freshly caught coastal scallops plated at the White Horse Inn"
              title="Coastal Scallops"
              description="Freshly caught coastal scallops, sourced local to our pubs."
              eyebrow="From Shore to Plate"
              size="landscape"
              innerBorderTone="soft"
              blurFrame
              className="h-[280px] md:h-auto"
            />

            <FoodImageCard
              src="/assets/images/food_and_drink/steak.png"
              alt="Signature steak dish served with seasonal vegetables"
              title="Signature Steak"
              description="A signature steak dish prepared with grass-fed beef and cuts sourced from local butchers."
              eyebrow="Prime Cut"
              size="landscape"
              innerBorderTone="gold"
              blurFrame
              className="h-[280px] md:h-auto"
            />
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
