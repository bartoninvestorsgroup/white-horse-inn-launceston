import WhatsOnExplorer from "@/components/events/WhatsOnExplorer";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { getLocalLocations } from "@/lib/content";
import {
  buildDetailsExcerpt,
  formatEventStatusLabel,
  resolveEventStatus,
} from "@/lib/events";
import { breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";
import { getEvents } from "@/sanity/lib/queries";

export const metadata = getPageMetadata("whatsOn");

const statusOptions = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function hydrateEvents(events, locations) {
  const now = new Date();

  return events.map((event) => {
    const resolvedLocations = Array.isArray(event.locations)
      ? event.locations
      : [];
    const preferredLocationTitle = resolvedLocations[0];
    const locationMatch = locations.find(
      (location) => location.title === preferredLocationTitle,
    );
    const statusKey = resolveEventStatus(event, now);

    return {
      ...event,
      statusKey,
      statusLabel: formatEventStatusLabel(statusKey),
      detailsExcerpt: buildDetailsExcerpt(event.body),
      locationSlug: locationMatch?.slug || null,
      locationLabel: resolvedLocations.join(", "),
      imageSrc:
        event.image?.src ||
        locationMatch?.heroImage?.asset?.url ||
        "/assets/images/locations/PXL_20260408_152408187.jpg",
      imageAlt: event.image?.alt || locationMatch?.heroImage?.alt || event.title,
    };
  });
}

export default async function WhatsOnPage({ searchParams }) {
  const [events, locations, resolvedSearchParams] = await Promise.all([
    getEvents(),
    Promise.resolve(getLocalLocations()),
    searchParams,
  ]);

  const selectedStatus = statusOptions.some(
    (option) => option.key === resolvedSearchParams?.status,
  )
    ? resolvedSearchParams.status
    : "upcoming";
  const locationOptions = locations.map((location) => location.title);
  const selectedLocation =
    resolvedSearchParams?.location &&
    locationOptions.includes(resolvedSearchParams.location)
      ? resolvedSearchParams.location
      : "all";
  const eventsPageSchema = [
    getPageSchema("whatsOn"),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "What's On", path: "/whats-on" },
    ]),
  ];
  const hydratedEvents = hydrateEvents(events, locations);

  return (
    <>
      <StructuredData data={eventsPageSchema} />
      <PageIntro
        eyebrow="What's On"
        title="Events and occasions across Barton Investors Group."
        description="Discover what is coming up across our venues, from special events and seasonal occasions to memorable moments worth planning around."
      />

      <section className="relative z-20 bg-[color:var(--color-surface)] pb-24 pt-6 md:pb-32 md:pt-8">
        <SectionReveal className="site-container px-2" amount="some">
          <WhatsOnExplorer
            events={hydratedEvents}
            locations={locations}
            initialStatus={selectedStatus}
            initialLocation={selectedLocation}
          />
        </SectionReveal>
      </section>
    </>
  );
}
