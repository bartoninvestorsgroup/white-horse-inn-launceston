import { unstable_cache } from "next/cache";
import { groq } from "next-sanity";
import { sanityFetch } from "./client";

const CACHE_REVALIDATE_SECONDS = 3600;
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

export const eventBaseProjection = groq`{
  _id,
  title,
  "slug": slug.current,
  summary,
  startAt,
  endAt,
  priceLabel,
  body,
  ctaLink,
  featured,
  image{
    "src": asset->url,
    "alt": alt
  },
  status,
  "locations": select(
    defined(locations) => locations,
    defined(location) => [location],
    []
  )
}`;

export const eventsQuery = groq`
  *[_type == "event"] | order(startAt asc)
  ${eventBaseProjection}
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0]
  ${eventBaseProjection}
`;

export const eventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)].slug.current
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

export function getEvents() {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: eventsQuery,
        fallback: [],
      }),
    ["sanity-events"],
    {
      tags: ["sanity:events"],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export function getEventBySlug(slug) {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: eventBySlugQuery,
        params: { slug },
        fallback: null,
      }),
    ["sanity-event-by-slug", slug],
    {
      tags: ["sanity:events", `sanity:event:${slug}`],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}

export function getEventSlugs() {
  return unstable_cache(
    async () =>
      sanityFetch({
        query: eventSlugsQuery,
        fallback: [],
      }),
    ["sanity-event-slugs"],
    {
      tags: ["sanity:events"],
      revalidate: CACHE_REVALIDATE_SECONDS,
    },
  )();
}
