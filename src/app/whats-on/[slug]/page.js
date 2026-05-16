import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import EventRichText from "@/components/events/EventRichText";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { getLocalLocations } from "@/lib/content";
import {
  buildDetailsExcerpt,
  formatEventStatusLabel,
  resolveEventStatus,
} from "@/lib/events";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { getEventBySlug, getEventSlugs } from "@/sanity/lib/queries";

export const revalidate = 3600;

const eventDateTimeOptions = {
  timeZone: "Europe/London",
};

function formatDateLabel(startAt, endAt) {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;
  const startDateLabel = start.toLocaleDateString("en-GB", {
    ...eventDateTimeOptions,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const startTimeLabel = start.toLocaleTimeString("en-GB", {
    ...eventDateTimeOptions,
    hour: "numeric",
    minute: "2-digit",
  });

  if (end) {
    const endDateLabel = end.toLocaleDateString("en-GB", {
      ...eventDateTimeOptions,
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const endTimeLabel = end.toLocaleTimeString("en-GB", {
      ...eventDateTimeOptions,
      hour: "numeric",
      minute: "2-digit",
    });

    if (startDateLabel === endDateLabel) {
      return `${startDateLabel}, ${startTimeLabel} to ${endTimeLabel}`;
    }

    return `${startDateLabel}, ${startTimeLabel} to ${endDateLabel}, ${endTimeLabel}`;
  }

  return `${startDateLabel}, ${startTimeLabel}`;
}

function hydrateEvent(event, locations) {
  const now = new Date();
  const locationMatches = locations.filter((location) =>
    event.locations?.includes(location.title),
  );
  const primaryLocation = locationMatches[0] || null;

  return {
    ...event,
    statusKey: resolveEventStatus(event, now),
    statusLabel: formatEventStatusLabel(resolveEventStatus(event, now)),
    detailsExcerpt: buildDetailsExcerpt(event.body),
    locationMatches,
    imageSrc:
      event.image?.src ||
      primaryLocation?.heroImage?.asset?.url ||
      "/assets/images/locations/PXL_20260408_152408187.jpg",
    imageAlt:
      event.image?.alt ||
      primaryLocation?.heroImage?.alt ||
      event.title,
  };
}

export async function generateStaticParams() {
  const slugs = await getEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [event, locations] = await Promise.all([
    getEventBySlug(slug),
    Promise.resolve(getLocalLocations()),
  ]);

  if (!event) {
    return buildMetadata({
      title: "Event Not Found",
      description: "The requested event could not be found.",
      path: `/whats-on/${slug}`,
    });
  }

  const hydratedEvent = hydrateEvent(event, locations);
  const metadataLocationName =
    hydratedEvent.locationMatches[0]?.title || siteConfig.name;

  return buildMetadata({
    title: `${hydratedEvent.title} | ${metadataLocationName}`,
    description:
      hydratedEvent.summary ||
      hydratedEvent.detailsExcerpt ||
      "Event details, timings, and venue information.",
    path: `/whats-on/${slug}`,
    image: hydratedEvent.imageSrc,
    appendSiteName: false,
  });
}

export default async function EventDetailPage({ params }) {
  const { slug } = await params;
  const [event, locations] = await Promise.all([
    getEventBySlug(slug),
    Promise.resolve(getLocalLocations()),
  ]);

  if (!event) {
    notFound();
  }

  const hydratedEvent = hydrateEvent(event, locations);
  const numericPrice = hydratedEvent.priceLabel
    ? Number.parseFloat(
        String(hydratedEvent.priceLabel).replace(/[^0-9.]/g, ""),
      )
    : null;

  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: hydratedEvent.title,
    description:
      hydratedEvent.summary || hydratedEvent.detailsExcerpt || hydratedEvent.title,
    startDate: hydratedEvent.startAt,
    endDate: hydratedEvent.endAt,
    eventStatus:
      hydratedEvent.statusKey === "current"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled",
    image: [absoluteUrl(hydratedEvent.imageSrc)],
    url: absoluteUrl(`/whats-on/${slug}`),
    organizer: {
      "@id": absoluteUrl("/#organization"),
    },
    offers: Number.isFinite(numericPrice)
      ? {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/whats-on/${slug}`),
          priceCurrency: "GBP",
          price: numericPrice,
        }
      : undefined,
    location: hydratedEvent.locationMatches[0]
      ? {
          "@type": "Place",
          name: hydratedEvent.locationMatches[0].title,
          address: {
            "@type": "PostalAddress",
            streetAddress: hydratedEvent.locationMatches[0].address,
            addressCountry: "GB",
          },
        }
      : undefined,
  };
  const schema = [
    eventSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "What's On", path: "/whats-on" },
      { name: hydratedEvent.title, path: `/whats-on/${slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <section className="relative z-20 bg-[color:var(--color-surface)]">
        <SectionReveal className="site-container px-2 pb-16 pt-32 md:pb-20 md:pt-40">
          <Link
            href="/whats-on"
            className="inline-flex items-center text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] transition-colors hover:text-[color:var(--color-gold)]"
          >
            Back to What&apos;s On
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow">{hydratedEvent.statusLabel}</p>
              <h1 className="mt-4 max-w-4xl font-heading text-5xl leading-[1.02] text-[color:var(--color-primary)] md:text-7xl">
                {hydratedEvent.title}
              </h1>
              {hydratedEvent.summary ? (
                <p className="mt-6 max-w-3xl text-xl leading-8 text-[color:var(--color-copy-soft)]">
                  {hydratedEvent.summary}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="inline-flex min-h-11 items-center rounded-[1rem] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]">
                  {formatDateLabel(hydratedEvent.startAt, hydratedEvent.endAt)}
                </span>
                {hydratedEvent.priceLabel ? (
                  <span className="inline-flex min-h-11 items-center rounded-[1rem] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]">
                    {hydratedEvent.priceLabel}
                  </span>
                ) : null}
                {hydratedEvent.locations?.map((locationTitle) => (
                  <span
                    key={locationTitle}
                    className="inline-flex min-h-11 items-center rounded-[1rem] border border-[color:var(--color-gold-soft)]/40 bg-[color:var(--color-gold-soft)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]"
                  >
                    {locationTitle}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative min-h-[24rem] overflow-hidden border border-[color:var(--color-primary)] bg-[color:var(--color-primary)]">
              <Image
                src={hydratedEvent.imageSrc}
                alt={hydratedEvent.imageAlt}
                fill
                sizes="(max-width: 1023px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
          </div>
        </SectionReveal>
      </section>

      <section className="relative z-20 bg-[color:var(--color-surface)]">
        <SectionReveal className="site-container grid gap-12 px-2 py-16 lg:grid-cols-[1.25fr_0.75fr]">
          <EventRichText body={hydratedEvent.body} />

          <aside className="space-y-6 border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-soft)] p-6">
            <div>
              <p className="eyebrow">Event Share Link</p>
              <p className="mt-3 break-all text-sm leading-7 text-[color:var(--color-copy-soft)]">
                {absoluteUrl(`/whats-on/${slug}`)}
              </p>
            </div>

            {hydratedEvent.ctaLink ? (
              <Link
                href={hydratedEvent.ctaLink}
                target={
                  hydratedEvent.ctaLink.startsWith("http") ? "_blank" : undefined
                }
                rel={
                  hydratedEvent.ctaLink.startsWith("http")
                    ? "noreferrer"
                    : undefined
                }
                className="cta-button inline-flex"
              >
                View Event Link
              </Link>
            ) : hydratedEvent.locationMatches[0] ? (
              <Link
                href={`/locations#${hydratedEvent.locationMatches[0].slug}`}
                className="cta-button inline-flex"
              >
                View Venue
              </Link>
            ) : null}
          </aside>
        </SectionReveal>
      </section>
    </>
  );
}
