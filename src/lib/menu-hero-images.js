import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const foodImageDirectory = path.join(
  process.cwd(),
  "public",
  "assets",
  "images",
  "food_and_drink",
);

const imageExtensions = new Set([".avif", ".webp", ".png", ".jpg", ".jpeg"]);

export function slugifyFilenamePart(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildMenuItemImageKey(menuTitle, sectionTitle, itemTitle) {
  return [
    slugifyFilenamePart(menuTitle),
    slugifyFilenamePart(sectionTitle),
    slugifyFilenamePart(itemTitle),
  ]
    .filter(Boolean)
    .join("_");
}

function normalizeDescription(value) {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("�", "£")
    .replace(/\s+/g, " ")
    .trim();
}

function getFoodImageMap() {
  if (!existsSync(foodImageDirectory)) {
    return new Map();
  }

  return readdirSync(foodImageDirectory).reduce((imageMap, filename) => {
    const extension = path.extname(filename).toLowerCase();

    if (!imageExtensions.has(extension)) {
      return imageMap;
    }

    const basename = path.basename(filename, extension).toLowerCase();
    imageMap.set(basename, filename);

    return imageMap;
  }, new Map());
}

function resolveHref(href, menu) {
  if (typeof href === "function") {
    return href(menu);
  }

  if (href && typeof href === "object") {
    return href[menu.menuType] || href.default || "/food/menu";
  }

  return href || "/food/menu";
}

export function buildMenuHeroSlides(menus = [], href = "/food/menu") {
  const imageMap = getFoodImageMap();
  const slides = [];

  for (const menu of menus) {
    for (const section of menu.sections || []) {
      for (const item of section.items || []) {
        if (item.show === false) {
          continue;
        }

        const imageKey = buildMenuItemImageKey(menu.title, section.title, item.title);
        const filename = imageMap.get(imageKey);

        if (!filename) {
          continue;
        }

        slides.push({
          id: `${menu._id}-${section._key}-${item._key}`,
          src: `/assets/images/food_and_drink/${filename}`,
          alt: `${item.title} from ${section.title} on ${menu.title}`,
          menuType: menu.menuType,
          sectionTitle: section.title,
          eyebrow: section.title,
          title: item.title,
          description: normalizeDescription(item.description),
          primaryCta: {
            label: "View Menu",
            href: `${resolveHref(href, menu)}#${imageKey}`,
          },
        });
      }
    }
  }

  return slides;
}
