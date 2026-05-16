import { absoluteUrl } from "@/lib/seo";
import { getEventSlugs } from "@/sanity/lib/queries";

const routes = [
  "/",
  "/locations",
  "/whats-on",
  "/gallery",
  "/book-a-table",
  "/contact",
  "/privacy-policy",
];

export default async function sitemap() {
  const eventSlugs = await getEventSlugs();
  const staticRoutes = routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));

  const eventRoutes = eventSlugs.map((slug) => ({
    url: absoluteUrl(`/whats-on/${slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...eventRoutes];
}
