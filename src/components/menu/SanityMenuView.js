import { existsSync } from "node:fs";
import path from "node:path";
import { buildMenuItemImageKey, slugifyFilenamePart } from "@/lib/menu-hero-images";
import MenuItemHighlighter from "@/components/menu/MenuItemHighlighter";
import MenuJumpTo from "@/components/menu/MenuJumpTo";
import Image from "next/image";
import Link from "next/link";

const dietaryBadges = [
  {
    field: "vegetarian",
    value: "yes",
    label: "V",
    description: "Vegetarian",
  },
  {
    field: "vegetarian",
    value: "option",
    label: "VO",
    description: "Vegetarian option",
  },
  {
    field: "vegan",
    value: "yes",
    label: "VE",
    description: "Vegan",
  },
  {
    field: "vegan",
    value: "option",
    label: "VEO",
    description: "Vegan option",
  },
  {
    field: "glutenFree",
    value: "yes",
    label: "GF",
    description: "Gluten free",
  },
  {
    field: "glutenFree",
    value: "option",
    label: "GFO",
    description: "Gluten free option",
  },
];

const menuTypeLabels = {
  ourMenu: "Our Menu",
  lunchMenu: "Lunch Menu",
  dinnerMenu: "Dinner Menu",
  kidsMenu: "Kids Menu",
  sundayMenu: "Sunday Menu",
  dessertsMenu: "Desserts Menu",
  drinksMenu: "Drinks Menu",
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
  christmas: "Christmas",
  specials: "Specials",
  allYear: "All Year",
};

const kidsSectionColors = {
  meals: "#FFAADB",
  snacks: "#F1C816",
  drinks: "#F08D2B",
};

const kidsSectionImages = {
  Meals: {
    src: "/assets/images/kids_menu/kids_menu_meals.png",
    alt: "Kids menu meals",
    imageSide: "right",
  },
  Snacks: {
    src: "/assets/images/kids_menu/kids_menu_snacks.png",
    alt: "Kids menu snacks",
    imageSide: "left",
  },
  Drinks: {
    src: "/assets/images/kids_menu/kids_menu_drinks.png",
    alt: "Kids menu drinks",
    imageSide: "right",
  },
};

const dietaryTokenMap = new Map(
  dietaryBadges.map((badge) => [badge.label, badge]),
);

function getItemBadges(item) {
  return dietaryBadges.filter((badge) => item?.[badge.field] === badge.value);
}

function getDietarySignature(item) {
  return ["vegetarian", "vegan", "glutenFree"]
    .map((field) => item?.[field] || "no")
    .join("|");
}

function choicesShareDietaryValues(choices) {
  if (!choices.length) {
    return false;
  }

  const [firstChoice] = choices;
  const firstSignature = getDietarySignature(firstChoice);

  return choices.every((choice) => getDietarySignature(choice) === firstSignature);
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).replaceAll("Â£", "£").replaceAll("�", "£").trim();
}

function formatPrice(value) {
  const normalized = normalizeText(value);

  if (!normalized) {
    return "";
  }

  const numericCandidate = normalized.replace(/^£\s*/, "").trim();

  if (/^\d+(?:\.\d{1,2})?$/.test(numericCandidate)) {
    return `£${Number(numericCandidate).toFixed(2)}`;
  }

  return normalized;
}

function buildMenuSectionAnchorId(menuTitle, sectionTitle) {
  return `section-${slugifyFilenamePart(menuTitle)}-${slugifyFilenamePart(sectionTitle)}`;
}

function publicAssetExists(src) {
  return existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
}

function DietaryBadge({ badge }) {
  return (
    <span
      title={badge.description}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] text-[0.62rem] font-extrabold leading-none text-[color:var(--color-gold)]"
    >
      {badge.label}
    </span>
  );
}

function InlineDietaryBadge({ badge }) {
  return (
    <span
      title={badge.description}
      className="mx-1 inline-flex min-h-5 min-w-5 translate-y-[-0.08em] items-center justify-center rounded-full border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] px-1.5 text-[0.55rem] font-extrabold leading-none text-[color:var(--color-gold)]"
    >
      {badge.label}
    </span>
  );
}

function renderTextWithDietaryTokens(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return null;
  }

  const parts = normalized.split(/(\((?:VEO|GFO|VO|VE|GF|V)\))/g);

  return parts.map((part, index) => {
    const token = part.match(/^\((VEO|GFO|VO|VE|GF|V)\)$/)?.[1];
    const badge = token ? dietaryTokenMap.get(token) : null;

    if (badge) {
      return <InlineDietaryBadge key={`${part}-${index}`} badge={badge} />;
    }

    return part;
  });
}

function isSafeMarkdownHref(href) {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function renderMarkdownLinks(text, keyPrefix) {
  const parts = String(text).split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!match) {
      return part;
    }

    const [, label, rawHref] = match;
    const href = rawHref.trim();

    if (!isSafeMarkdownHref(href)) {
      return label;
    }

    const external = href.startsWith("http://") || href.startsWith("https://");
    const className =
      "font-bold text-[color:var(--color-primary)] underline decoration-[color:var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--color-gold)]";

    if (href.startsWith("/")) {
      return (
        <Link key={`${keyPrefix}-link-${index}`} href={href} className={className}>
          {label}
        </Link>
      );
    }

    return (
      <a
        key={`${keyPrefix}-link-${index}`}
        href={href}
        className={className}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {label}
      </a>
    );
  });
}

function MenuIntroduction({ text }) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return null;
  }

  const paragraphs = normalized.split(/\n{2,}/).filter(Boolean);

  return (
    <div className="mx-auto mt-6 max-w-5xl space-y-4 text-center text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg">
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split(/\n/);

        return (
          <p key={`menu-intro-${paragraphIndex}`}>
            {lines.map((line, lineIndex) => (
              <span key={`menu-intro-${paragraphIndex}-${lineIndex}`}>
                {lineIndex > 0 ? <br /> : null}
                {renderMarkdownLinks(line, `menu-intro-${paragraphIndex}-${lineIndex}`)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function DietaryKey() {
  return (
    <div className="border-y border-[color:var(--color-border-soft)] py-5">
      <p className="eyebrow">Dietary Key</p>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
        {dietaryBadges.map((badge) => (
          <div
            key={`${badge.field}-${badge.value}`}
            className="flex items-center gap-2 text-sm font-semibold text-[color:var(--color-copy-soft)]"
          >
            <DietaryBadge badge={badge} />
            <span>{badge.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaintBlobLabel({
  children,
  color = "var(--color-primary)",
  className = "",
  textClassName = "",
}) {
  return (
    <span className={`relative inline-grid place-items-center px-8 py-4 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 240 96"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M22.6 53.7C11.4 39.4 22.7 17.5 47.8 13.8c15.9-2.3 26.6 2.9 40.7-1.8 18.2-6.1 39.6-11.2 58-1.2 15.5 8.4 17.9 20.9 39.4 20.1 22.5-.8 39 9.1 37.9 26.3-1 15.6-16.3 25.1-37.4 24.5-17.5-.5-26.3 8.7-47.7 9.8-17.3.9-27.5-5-43.6-3.6-24.8 2.1-42.6 4.6-57.2-7.2-8.5-6.9-7.9-16.4-15.3-27Z"
          fill={color}
        />
      </svg>
      <span className={`relative z-10 ${textClassName}`}>{children}</span>
    </span>
  );
}

function DecorativePaintBlob({ color, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 240 96"
      preserveAspectRatio="none"
      className={`absolute ${className}`}
    >
      <path
        d="M22.6 53.7C11.4 39.4 22.7 17.5 47.8 13.8c15.9-2.3 26.6 2.9 40.7-1.8 18.2-6.1 39.6-11.2 58-1.2 15.5 8.4 17.9 20.9 39.4 20.1 22.5-.8 39 9.1 37.9 26.3-1 15.6-16.3 25.1-37.4 24.5-17.5-.5-26.3 8.7-47.7 9.8-17.3.9-27.5-5-43.6-3.6-24.8 2.1-42.6 4.6-57.2-7.2-8.5-6.9-7.9-16.4-15.3-27Z"
        fill={color}
      />
    </svg>
  );
}

function KidsMenuDecorativeBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-visible"
    >
      <DecorativePaintBlob
        color="#F1C816"
        className="-left-[42vw] top-[3rem] h-[15rem] w-[45rem] -rotate-12 opacity-55 md:-left-[18vw] md:top-[4rem] md:h-[24rem] md:w-[72rem]"
      />
      <DecorativePaintBlob
        color="var(--color-primary)"
        className="-right-[44vw] top-[15rem] h-[15rem] w-[45rem] rotate-12 opacity-35 md:-right-[20vw] md:top-[10rem] md:h-[25.5rem] md:w-[75rem]"
      />
      <DecorativePaintBlob
        color="var(--color-primary)"
        className="-left-[44vw] top-[36%] h-[15rem] w-[45rem] rotate-6 opacity-35 md:-left-[20vw] md:top-1/2 md:h-[25.5rem] md:w-[75rem] md:-translate-y-1/2"
      />
      <DecorativePaintBlob
        color="#FFAADB"
        className="-right-[44vw] top-[52%] h-[15rem] w-[45rem] -rotate-6 opacity-55 md:-right-[20vw] md:top-1/2 md:h-[25.5rem] md:w-[75rem] md:-translate-y-1/2"
      />
      <DecorativePaintBlob
        color="#FFAADB"
        className="-left-[44vw] bottom-[15rem] h-[15rem] w-[45rem] rotate-10 opacity-55 md:-left-[20vw] md:bottom-[6rem] md:h-[25.5rem] md:w-[75rem]"
      />
      <DecorativePaintBlob
        color="#F1C816"
        className="-right-[42vw] bottom-[1rem] h-[15rem] w-[45rem] -rotate-10 opacity-55 md:-right-[18vw] md:bottom-0 md:h-[24rem] md:w-[72rem]"
      />
    </div>
  );
}

function KidsMenuTitle() {
  return (
    <div className="relative mx-auto flex w-fit flex-col items-center pb-4 pt-2">
      <span className="kids-menu-font-heading kids-menu-outlined-text relative z-20 text-[clamp(4.2rem,14vw,8.5rem)] leading-[0.82] tracking-[0.01em]">
        Kids
      </span>
      <PaintBlobLabel
        color="#d9322e"
        className="-mt-5 min-h-[5.8rem] min-w-[15rem] md:-mt-8 md:min-h-[7rem] md:min-w-[20rem]"
        textClassName="kids-menu-font-body text-[clamp(3.1rem,10vw,6.4rem)] leading-none text-white"
      >
        Menu
      </PaintBlobLabel>
    </div>
  );
}

function KidsSectionHeading({ title }) {
  const color = kidsSectionColors[normalizeText(title).toLowerCase()] || "var(--color-primary)";
  const textColor = color.startsWith("#") ? "#111111" : "var(--color-gold)";

  return (
    <PaintBlobLabel
      color={color}
      className="min-h-[4.8rem] min-w-[12rem] px-7 py-3"
      textClassName="kids-menu-font-heading text-4xl leading-none md:text-5xl"
    >
      <span style={{ color: textColor }}>{title}</span>
    </PaintBlobLabel>
  );
}

function KidsSectionImage({ image }) {
  if (!image || !publicAssetExists(image.src)) {
    return null;
  }

  return (
    <div className="relative min-h-[18rem] overflow-hidden md:min-h-[100%]">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 768px) 40vw, 90vw"
        className="object-contain"
      />
    </div>
  );
}

function MenuItem({ item, menuTitle, sectionTitle, isKidsMenu = false }) {
  const choices = (item.choices || []).filter((choice) => choice.show !== false);
  const sharedChoiceDietary = choicesShareDietaryValues(choices);
  const badges = choices.length
    ? sharedChoiceDietary
      ? getItemBadges(choices[0])
      : []
    : getItemBadges(item);
  const description = normalizeText(item.description);
  const price = formatPrice(item.price);
  const anchorId = buildMenuItemImageKey(menuTitle, sectionTitle, item.title);

  return (
    <article
      id={anchorId}
      className={`menu-item-anchor grid scroll-mt-32 grid-cols-[minmax(0,4fr)_minmax(4rem,1fr)] gap-4 border-b border-[color:var(--color-border-soft)] py-5 last:border-b-0 ${
        isKidsMenu ? "kids-menu-font-body" : ""
      }`}
    >
      <div className="min-w-0">
        <h3
          className={`text-2xl leading-tight text-[color:var(--color-primary)] ${
            isKidsMenu ? "kids-menu-font-heading text-3xl" : "font-heading"
          }`}
        >
          {item.title}
        </h3>
        {description ? (
          <p
            className={`mt-2 whitespace-pre-line text-[color:var(--color-copy-soft)] ${
              isKidsMenu ? "text-lg leading-7" : "text-sm leading-6"
            }`}
          >
            {renderTextWithDietaryTokens(description)}
          </p>
        ) : null}
        {badges.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <DietaryBadge key={`${item._key}-${badge.label}`} badge={badge} />
            ))}
          </div>
        ) : null}
      </div>
      {price ? (
        <p
          className={`pt-1 text-right font-extrabold text-[color:var(--color-primary)] ${
            isKidsMenu ? "text-xl" : "text-base"
          }`}
        >
          {price}
        </p>
      ) : null}
      {choices.length ? (
        <div className="col-span-full mt-1 grid gap-2">
          {choices.map((choice) => {
            const choiceBadges = sharedChoiceDietary ? [] : getItemBadges(choice);
            const choicePrice = formatPrice(choice.price);

            return (
              <div
                key={choice._key}
                className="grid grid-cols-[minmax(0,4fr)_minmax(4rem,1fr)] gap-4 border-t border-[color:var(--color-border-soft)] pt-3"
              >
                <div className="min-w-0">
                  <p
                    className={`font-semibold text-[color:var(--color-primary)] ${
                      isKidsMenu ? "text-lg leading-7" : "text-base leading-6"
                    }`}
                  >
                    {renderTextWithDietaryTokens(choice.label)}
                  </p>
                  {choiceBadges.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {choiceBadges.map((badge) => (
                        <DietaryBadge
                          key={`${choice._key}-${badge.label}`}
                          badge={badge}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
                {choicePrice ? (
                  <p
                    className={`pt-0.5 text-right font-extrabold text-[color:var(--color-primary)] ${
                      isKidsMenu ? "text-xl" : "text-base"
                    }`}
                  >
                    {choicePrice}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </article>
  );
}

function MenuSection({ section, menuTitle, isKidsMenu = false }) {
  const visibleItems = (section.items || []).filter((item) => item.show !== false);
  const kidsImage = isKidsMenu ? kidsSectionImages[section.title] : null;
  const hasKidsImage = kidsImage && publicAssetExists(kidsImage.src);

  if (!visibleItems.length) {
    return null;
  }

  const sectionContent = (
    <>
      <div
        className={`mb-6 flex flex-col gap-2 ${
          isKidsMenu
            ? "items-center text-center"
            : "md:flex-row md:items-end md:justify-between"
        }`}
      >
        {isKidsMenu ? (
          <KidsSectionHeading title={section.title} />
        ) : (
          <h2 className="font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
            {section.title}
          </h2>
        )}
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-copy-soft)]">
          {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className={`grid gap-x-10 ${isKidsMenu ? "" : "md:grid-cols-2"}`}>
        {visibleItems.map((item) => (
          <MenuItem
            key={item._key}
            item={item}
            menuTitle={menuTitle}
            sectionTitle={section.title}
            isKidsMenu={isKidsMenu}
          />
        ))}
      </div>
    </>
  );

  if (isKidsMenu && hasKidsImage) {
    const image = <KidsSectionImage image={kidsImage} />;
    const content = <div>{sectionContent}</div>;

    return (
      <section
        id={buildMenuSectionAnchorId(menuTitle, section.title)}
        className="scroll-mt-32 border-t border-[color:var(--color-primary)] pt-8"
      >
        <div className="grid items-stretch gap-8 md:grid-cols-2">
          {kidsImage.imageSide === "left" ? (
            <>
              {image}
              {content}
            </>
          ) : (
            <>
              {content}
              {image}
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section
      id={buildMenuSectionAnchorId(menuTitle, section.title)}
      className="scroll-mt-32 border-t border-[color:var(--color-primary)] pt-8"
    >
      {sectionContent}
    </section>
  );
}

function SundayLunchNote() {
  return (
    <div className="border-t border-[color:var(--color-border-soft)] pt-8 text-center">
      <p className="mx-auto max-w-4xl text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg">
        All our Sunday Dishes are Served with Herb Ruffled Roast Potatoes, Honey
        Parsnips, Braised Red Cabbage, Roast Carrots, Homemade Yorkshire
        Pudding, Tender stem, Gravy and Cauliflower Cheese.
      </p>
      <div className="mx-auto mt-5 inline-flex max-w-4xl items-center justify-center rounded-[0.9rem] border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] px-4 py-3 text-center text-sm font-bold leading-6 text-[color:var(--color-gold)] md:text-base">
        If you would like your Beef cooked a certain way or Gravy on the Side,
        please let the server know.
      </div>
    </div>
  );
}

function MenuDocument({ menu, showDietaryKey = false }) {
  const sections = (menu.sections || []).filter((section) =>
    section.items?.some((item) => item.show !== false),
  );
  const isKidsMenu = menu.menuType === "kidsMenu";
  const shouldShowSundayNote =
    menu.menuType === "sundayMenu" &&
    sections.some((section) => section.title === "Sunday Lunch") &&
    sections.some((section) => section.title === "Non-Roast Mains");

  if (!sections.length) {
    return null;
  }

  return (
    <div
      className={`space-y-12 ${
        isKidsMenu ? "kids-menu-font-body relative overflow-visible" : ""
      }`}
    >
      {isKidsMenu ? <KidsMenuDecorativeBlobs /> : null}
      <div className={isKidsMenu ? "relative z-10 space-y-12" : "space-y-12"}>
        <div className="text-center">
          {isKidsMenu ? (
            <KidsMenuTitle />
          ) : (
            <>
              <p className="eyebrow">{menuTypeLabels[menu.menuType] || menu.menuType}</p>
              <h2 className="mt-3 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl">
                {menu.title}
              </h2>
            </>
          )}
          <MenuJumpTo
            menuTitle={menu.title}
            sections={sections}
            isKidsMenu={isKidsMenu}
          />
          <MenuIntroduction text={menu.introduction} />
        </div>
        {showDietaryKey ? <DietaryKey /> : null}
        <div className="space-y-14">
          {sections.map((section) => (
            <div key={section._key} className="space-y-8">
              <MenuSection
                section={section}
                menuTitle={menu.title}
                isKidsMenu={isKidsMenu}
              />
              {shouldShowSundayNote && section.title === "Sunday Lunch" ? (
                <SundayLunchNote />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SanityMenuView({ menus = [], emptyTitle = "Menu coming soon" }) {
  const visibleMenus = menus.filter((menu) =>
    menu.sections?.some((section) => section.items?.some((item) => item.show !== false)),
  );

  if (!visibleMenus.length) {
    return (
      <div className="max-w-2xl border border-[color:var(--color-border-soft)] bg-[color:var(--muted)] p-6">
        <h2 className="font-heading text-3xl text-[color:var(--color-primary)]">
          {emptyTitle}
        </h2>
        <p className="mt-3 text-base leading-7 text-[color:var(--color-copy-soft)]">
          We are preparing this menu for the website. Please check back soon or
          contact us for the latest availability.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <MenuItemHighlighter />
      {visibleMenus.map((menu, index) => (
        <MenuDocument key={menu._id} menu={menu} showDietaryKey={index === 0} />
      ))}
    </div>
  );
}
