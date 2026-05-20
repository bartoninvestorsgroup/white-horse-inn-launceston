import AutoScrollHeroCarousel from "@/components/layout/AutoScrollHeroCarousel";
import FaqSection from "@/components/layout/FaqSection";
import FixedRevealSection from "@/components/layout/FixedRevealSection";
import SectionReveal from "@/components/layout/SectionReveal";
import HomeAboutStory from "@/components/home/HomeAboutStory";
import HomeFoodShowcase from "@/components/home/HomeFoodShowcase";
import Link from "next/link";
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

const familyCards = [
  {
    src: "/assets/images/locations/children_playing_indoor_play_area_teepee.png",
    alt: "Preview image of children enjoying a planned indoor play area at the White Horse Inn",
    title: "Family-Friendly Now",
    description:
      "A relaxed Launceston pub where families can feel welcome for meals, short visits and proper local hospitality.",
    eyebrow: "Families Welcome",
    size: "portrait",
    innerBorderTone: "gold",
  },
  {
    src: "/assets/images/locations/children_playing_uno_indoor_play_area.png",
    alt: "Preview image of children playing in a planned indoor play area",
    title: "Play Space Planned",
    description:
      "Later this year, we hope to introduce an indoor play area designed to give children somewhere fun to enjoy.",
    eyebrow: "Coming Later This Year",
    size: "portrait",
    innerBorderTone: "soft",
  },
];

const aboutCards = [
  {
    title: "A Proper Launceston Local",
    body: "The White Horse Inn is a welcoming pub, restaurant, and inn in the heart of Launceston, built around good honest food, friendly service, and a genuine love of local hospitality.\n\nWhether you are joining us for [lunch](/food/lunch-menu), settling in for [Sunday dinner](/food/sunday-menu), calling in for a drink, [staying overnight](/accommodation), or gathering with family and friends, our aim is simple: to make every visit feel relaxed, comfortable, and properly looked after.",
    alignment: "left",
  },
  {
    title: "Good Honest Food, Done Properly",
    body: "Food is at the heart of what we do. Our [menus](/food) are shaped around generous pub favourites, seasonal specials, comforting classics, and dishes made with care.\n\nWe believe great pub food starts with quality ingredients, which is why we are focused on using fresh, local produce wherever possible, including award-winning butchers Phillip Warren & Son, and Palmers of Tavistock. From hearty mains and proper Sunday roasts to lighter lunches, children's meals, and homemade desserts, our food is made to be satisfying, welcoming, and full of flavour.",
    alignment: "right",
  },
  {
    title: "Food, Drink and Rooms Under One Roof",
    body: "The White Horse Inn is more than a place to eat. With [comfortable rooms](/accommodation), relaxed dining spaces, and a proper pub atmosphere, it is set up for everything from a quick drink to a weekend stay.\n\nGuests can enjoy freshly prepared food, a well-stocked bar, a friendly local setting, and the convenience of having food, drink, and accommodation all under one roof.",
    alignment: "left",
  },
  {
    title: "Room for Gatherings",
    body: "Alongside the pub, restaurant, and rooms, our large [function room](/functions) provides a practical and welcoming space for birthdays, private events, meetings, wakes, family celebrations, and local gatherings.\n\nWhether you are planning something small and simple or a larger occasion, our team will be on hand to help shape the details and make the day feel personal, relaxed, and well organised. You can also [book a table](/book-a-table) before visiting.",
    alignment: "right",
  },
];

const dogFriendlyCards = [
  {
    title: "Dogs Welcome in Launceston",
    body: "The White Horse Inn is a dog friendly pub in Launceston, welcoming well-behaved dogs and their owners to relax with us. Whether you are stopping by after a local walk, meeting friends for a drink, or joining us for [food](/food), we want everyone, including four-legged guests, to feel comfortable and looked after.",
    alignment: "left",
  },
  {
    title: "A Rest After Local Walks",
    body: "Launceston is a great base for exploring the surrounding countryside, nearby walking routes, and the wider Cornwall and Devon border area, so we know how important it is to find a welcoming place to rest afterwards. Our pub offers a relaxed setting where dog owners can enjoy good honest food, quality local ingredients, and proper hospitality without having to leave their dog behind. You can [find us in Launceston](/find-us) before visiting.",
    alignment: "right",
  },
  {
    title: "Water Bowls and Treats",
    body: "We simply ask that dogs are kept under control, on a lead where appropriate, and considerate of other guests. Water bowls are available, and our team will always do their best to make you and your dog feel welcome. We even have a selection of dog treats available at the bar. Pawfect!",
    alignment: "left",
  },
];

const homeFaqs = [
  {
    question: "Where can I find a family-friendly pub in Launceston?",
    answer:
      "The White Horse Inn is a family-friendly pub in the heart of Launceston, with relaxed dining, welcoming spaces and dedicated menus for [lunch](/food/lunch-menu), [dinner](/food/dinner-menu), [children](/food/kids-menu) and [Sunday roast](/food/sunday-menu).",
  },
  {
    question: "Which pubs in Launceston have a kids' menu?",
    answer:
      "The White Horse Inn offers a dedicated [kids' menu](/food/kids-menu), making it a good choice for families looking for child-friendly pub food in Launceston.",
  },
  {
    question: "Where can I find a dog-friendly pub in Launceston?",
    answer:
      "The White Horse Inn is a dog-friendly pub in Launceston, welcoming well-behaved dogs so you can enjoy [food and drinks](/food) without leaving your four-legged friend behind.",
  },
  {
    question: "Where is good for Sunday roast in Launceston?",
    answer:
      "The White Horse Inn serves a dedicated [Sunday roast menu](/food/sunday-menu), offering proper pub food, quality ingredients and a relaxed local setting in the heart of Launceston.",
  },
  {
    question: "Where can I get lunch in Launceston?",
    answer:
      "The White Horse Inn serves [lunch in Launceston](/food/lunch-menu), with good honest pub food made using quality locally sourced ingredients wherever possible.",
  },
  {
    question: "Where can I eat dinner in Launceston?",
    answer:
      "The White Horse Inn serves [dinner in Launceston](/food/dinner-menu), with a dedicated evening menu featuring proper pub dishes, local ingredients and a warm traditional pub atmosphere.",
  },
  {
    question: "Are there pubs with accommodation in Launceston?",
    answer:
      "Yes. The White Horse Inn offers [pub accommodation in Launceston](/accommodation), ideal for visitors looking to eat, drink and stay in the heart of town.",
  },
  {
    question: "Where can I hire a function room in Launceston?",
    answer:
      "The White Horse Inn has [function rooms available to hire in Launceston](/functions), suitable for celebrations, meetings, family gatherings, wakes, birthdays and private events.",
  },
  {
    question: "Where can I find locally sourced pub food in Launceston?",
    answer:
      "The White Horse Inn focuses on good honest [food made with quality locally sourced ingredients](/food) wherever possible, served across lunch, dinner, kids' and Sunday menus.",
  },
  {
    question: "What is a good local pub in Launceston town centre?",
    answer:
      "The White Horse Inn is a local pub in the heart of Launceston, offering [food](/food), drinks, [accommodation](/accommodation), [function room hire](/functions), dog-friendly spaces and family-friendly dining.",
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
        src="/assets/images/locations/white_horse_inn_launceston_front_view.jpg"
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
        <SectionReveal className="site-container px-2 py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Family Friendly Pub</p>
            <h2 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
              A kid-friendly place to eat, relax and spend time together.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[color:var(--color-copy-soft)]">
              The White Horse Inn is already a welcoming place for families,
              with{" "}
              <Link
                href="/food/kids-menu"
                className="font-extrabold text-[color:var(--color-primary)] underline decoration-[color:var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--color-gold-soft)]"
              >
                children&apos;s food options
              </Link>{" "}
              and a relaxed local-pub setting. Later this year, we hope to
              introduce an indoor play area where children can play while adults
              catch up, chat, or wait for food.
            </p>
          </div>
          <HomeFoodShowcase cards={familyCards} />
        </SectionReveal>
      </section>

      <FixedRevealSection
        src="/assets/images/locations/dog_friendly_local_pub.jpg"
        alt="Dog friendly local pub setting at the White Horse Inn"
        zoomRange={[1.02, 1.2]}
        contentClassName="no-snap-zone relative"
        revealHeightClassName="h-[72svh] md:h-[88svh]"
      >
        <div className="site-container flex w-full items-end px-2 pb-12 md:pb-18">
          <HomeAboutStory
            cards={dogFriendlyCards}
            eyebrow="Dog Friendly Pub"
            title="Dog Friendly Pub in Launceston"
          />
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

      <FaqSection
        faqs={homeFaqs}
        eyebrow="White Horse Inn FAQs"
        title="Helpful answers before you visit."
      />
    </>
  );
}
