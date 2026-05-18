import { absoluteUrl } from "@/lib/seo";
import { getMenus } from "@/sanity/lib/queries";

const routes = [
  "/",
  "/food",
  "/accommodation",
  "/find-us",
  "/functions",
  "/gallery",
  "/book-a-table",
  "/contact",
  "/privacy-policy",
];

export default async function sitemap() {
  const menus = await getMenus();
  const staticRoutes = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const menuRoutes = menus
    .filter((menu) => menu.slug && menu.listInSitemap !== false)
    .map((menu) => ({
      url: absoluteUrl(`/food/${menu.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }));

  return [...staticRoutes, ...menuRoutes];
}
