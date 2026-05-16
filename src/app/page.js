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
    title: "A Family-Run Passion for Local Living",
    body: "At Barton Investors Group, we believe the heart of every community is its local pub. As a family-run independent team, we aren't just running businesses; we're looking after the places where memories are made. From the moment we opened the doors to our very first venues, our mission has been simple: to create a home-away-from-home for every guest who walks through our doors.",
    alignment: "left",
  },
  {
    title: "Growing Our Community",
    body: "We are incredibly proud of our collection of pubs across Devon, Somerset, Hampshire, and the South East. Most recently, we've been delighted to welcome the Cricketers Inn in Longparish into our family. Each of our pubs maintains its own unique charm and local character while sharing the same commitment to genuine hospitality and a friendly, inclusive atmosphere.",
    alignment: "right",
  },
  {
    title: "Quality Food, Wherever You Are",
    body: "Our love for great food doesn't stop at the pub table. With Burgers in General, we've brought our passion for gourmet quality to the comfort of your own home. Whether you're joining us at the bar or ordering in for a movie night, we're dedicated to serving up quality, comfort, and a very warm welcome.",
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
        alt="Exterior view of a Barton Investors Group venue"
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
              alt="Freshly caught coastal scallops plated at a Barton Investors Group venue"
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
