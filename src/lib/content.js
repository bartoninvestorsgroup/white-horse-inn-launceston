import footerSettings from "@/data/footer-settings.json";
import galleryItems from "@/data/gallery.json";
import locations from "@/data/locations.json";
import pageHeroes from "@/data/page-heroes.json";
import siteSettings from "@/data/site-settings.json";

export function getLocalSiteSettings() {
  return siteSettings;
}

export function getLocalFooterSettings() {
  return footerSettings;
}

export function getLocalLocations() {
  return [...locations].sort((a, b) => {
    const aOrder = Number.isFinite(Number(a?.sortOrder))
      ? Number(a.sortOrder)
      : Number.MAX_SAFE_INTEGER;
    const bOrder = Number.isFinite(Number(b?.sortOrder))
      ? Number(b.sortOrder)
      : Number.MAX_SAFE_INTEGER;

    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }

    return String(a?.title || "").localeCompare(String(b?.title || ""), "en-GB");
  });
}

export function getLocalPageHero(heroKey) {
  return pageHeroes[heroKey] || null;
}

export function getLocalGalleryItems() {
  return galleryItems;
}
