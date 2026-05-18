import { unstable_cache } from "next/cache";
import { groq } from "next-sanity";
import { sanityFetch } from "./client";

const CACHE_REVALIDATE_SECONDS = 10;
const BANNER_REVALIDATE_SECONDS = 10;

export const activeSiteBannersQuery = groq`
  *[
    _type == "siteBanner"
    && (!defined(endAt) || dateTime(endAt) >= dateTime(now()))
  ] | order(coalesce(startAt, _createdAt) asc, _updatedAt desc){
    _id,
    title,
    link,
    "start": startAt,
    "end": endAt
  }
`;

export const menuBaseProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  menuType,
  "showOnWebsite": coalesce(showOnWebsite, true),
  "listInSitemap": coalesce(listInSitemap, true),
  introduction,
  sections[]{
    _key,
    title,
    items[]{
      _key,
      title,
      description,
      price,
      choices[]{
        _key,
        label,
        price,
        "show": coalesce(show, true),
        vegetarian,
        vegan,
        glutenFree
      },
      "show": coalesce(show, true),
      vegetarian,
      vegan,
      glutenFree
    }
  }
}`;

export const menusQuery = groq`
  *[_type == "menu"] | order(menuType asc, title asc)
  ${menuBaseProjection}
`;

export const menuBySlugQuery = groq`
  *[_type == "menu" && slug.current == $slug][0]
  ${menuBaseProjection}
`;

export const menusByTypesQuery = groq`
  *[_type == "menu" && menuType in $menuTypes] | order(menuType asc, title asc)
  ${menuBaseProjection}
`;

export function getActiveSiteBanners() {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: activeSiteBannersQuery,
        fallback: [],
      }),
    ["sanity-site-banners"],
    {
      tags: ["sanity:siteBanner"],
      revalidate: BANNER_REVALIDATE_SECONDS,
    },
  )();
}

export function getMenus() {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: menusQuery,
        fallback: [],
      }),
    ["sanity-menus"],
    {
      tags: ["sanity:menus"],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export function getMenuBySlug(slug) {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: menuBySlugQuery,
        params: { slug },
        fallback: null,
      }),
    ["sanity-menu-by-slug", slug],
    {
      tags: ["sanity:menus", `sanity:menu:${slug}`],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export function getMenusByTypes(menuTypes = []) {
  const normalizedMenuTypes = Array.isArray(menuTypes) ? menuTypes : [menuTypes];

  return unstable_cache(
    async () =>
      sanityFetch({
        query: menusByTypesQuery,
        params: { menuTypes: normalizedMenuTypes },
        fallback: [],
      }),
    ["sanity-menus-by-types", normalizedMenuTypes.join(":")],
    {
      tags: ["sanity:menus", ...normalizedMenuTypes.map((type) => `sanity:menus:${type}`)],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export function getEvents() {
  return Promise.resolve([]);
}

export function getEventBySlug() {
  return Promise.resolve(null);
}

export function getEventSlugs() {
  return Promise.resolve([]);
}
