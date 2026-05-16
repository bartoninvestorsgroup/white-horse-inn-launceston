import AutoScrollHeroCarousel from "@/components/layout/AutoScrollHeroCarousel";
import PageIntro from "@/components/layout/PageIntro";
import LocationCard from "@/components/locations/LocationCard";
import StructuredData from "@/components/seo/StructuredData";
import { getLocalLocations, getLocalPageHero } from "@/lib/content";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";

export const metadata = getPageMetadata("locations");

const allowedTabs = new Set(["details", "reviews", "hours"]);

function buildOpeningHoursSpecification(openingTimes = []) {
  return openingTimes
    .filter((slot) => !slot?.isClosed && slot?.openTime && slot?.closeTime)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${slot.day}`,
      opens: slot.openTime,
      closes: slot.closeTime,
    }));
}

function buildLocationSchema(location) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl(`/locations#${location.slug}`),
    name: location.title,
    description: location.summary,
    url: location.website || absoluteUrl(`/locations#${location.slug}`),
    telephone: location.telephone,
    email: location.email,
    image: location.heroImage?.asset?.url
      ? [absoluteUrl(location.heroImage.asset.url)]
      : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: location.address,
      addressCountry: "GB",
    },
    sameAs: [
      location.website,
      location.googleMapsUrl,
      location.googleReviewsUrl,
      location.tripAdvisorUrl,
      location.tripadvisorReviewsUrl,
      location.socialLinks?.facebook,
      location.socialLinks?.instagram,
      location.socialLinks?.tiktok,
    ].filter(Boolean),
    openingHoursSpecification: buildOpeningHoursSpecification(
      location.openingTimes,
    ),
    servesCuisine: ["British", "Pub Food"],
    priceRange: "££",
    parentOrganization: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}

export default async function LocationsPage({ searchParams }) {
  const locations = getLocalLocations();
  const pageHero = getLocalPageHero("locations");
  const resolvedSearchParams = (await searchParams) || {};
  const heroSlides = pageHero?.slides || [];
  const locationsPageSchema = [
    getPageSchema("locations"),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Locations", path: "/locations" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Barton Investors Group Locations",
      itemListElement: locations.map((location, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/locations#${location.slug || location._id}`),
        name: location.title,
      })),
    },
    ...locations.map(buildLocationSchema),
  ];

  return (
    <>
      <StructuredData data={locationsPageSchema} />
      <AutoScrollHeroCarousel slides={heroSlides} />
      <PageIntro
        eyebrow="Locations"
        title="Local pubs. Family run."
        description="Barton Investors Group is proud to bring together a collection of family-run independent pubs, each rooted in its local area and known for its friendly, welcoming atmosphere. While every venue has its own personality, they all reflect the same values of community, character and genuine hospitality."
      />
      <section className="relative z-20 bg-[color:var(--color-surface)] pt-8 pb-20 md:pt-10 md:pb-24">
        <div className="site-container grid gap-10 px-2">
          {locations.length ? (
            locations.map((location) => (
              <LocationCard
                key={location._id}
                location={location}
                activeTab={
                  allowedTabs.has(
                    resolvedSearchParams[
                      `tab-${location.slug || location._id}`
                    ],
                  )
                    ? resolvedSearchParams[
                        `tab-${location.slug || location._id}`
                      ]
                    : "details"
                }
                currentParams={resolvedSearchParams}
                layout="half"
              />
            ))
          ) : (
            <div className="border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-soft)] px-6 py-10 text-lg leading-8 text-[color:var(--color-copy-soft)]">
              Add your first location in Sanity Studio to populate this page.
            </div>
          )}
        </div>
      </section>
    </>
  );
}
