"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import EventCard from "@/components/events/EventCard";

const statusOptions = [
  { key: "upcoming", label: "Upcoming" },
  { key: "past", label: "Past" },
];

function getTimestamp(value) {
  const timestamp = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function getMonthLabel(dateValue) {
  return new Date(dateValue).toLocaleDateString("en-GB", {
    timeZone: "Europe/London",
    month: "long",
    year: "numeric",
  });
}

function buildEventGroups(events, selectedStatus) {
  const groupedEvents = new Map();

  if (selectedStatus === "upcoming") {
    const currentEvents = events
      .filter((event) => event.statusKey === "current")
      .sort((left, right) => getTimestamp(left.startAt) - getTimestamp(right.startAt));
    const upcomingEvents = events
      .filter((event) => event.statusKey === "upcoming")
      .sort((left, right) => getTimestamp(left.startAt) - getTimestamp(right.startAt));

    upcomingEvents.forEach((event) => {
      const monthLabel = getMonthLabel(event.startAt);
      const existing = groupedEvents.get(monthLabel) || [];
      groupedEvents.set(monthLabel, [...existing, event]);
    });

    const groups = [];
    if (currentEvents.length) {
      groups.push({ label: "Happening Now", events: currentEvents });
    }

    groupedEvents.forEach((monthEvents, label) => {
      groups.push({ label, events: monthEvents });
    });

    return groups;
  }

  const orderedEvents = [...events].sort(
    (left, right) => getTimestamp(right.startAt) - getTimestamp(left.startAt),
  );
  orderedEvents.forEach((event) => {
    const monthLabel = getMonthLabel(event.startAt);
    const existing = groupedEvents.get(monthLabel) || [];
    groupedEvents.set(monthLabel, [...existing, event]);
  });

  return Array.from(groupedEvents.entries()).map(([label, monthEvents]) => ({
    label,
    events: monthEvents,
  }));
}

function buildFilterHref(status, location) {
  const params = new URLSearchParams();

  if (status && status !== "upcoming") {
    params.set("status", status);
  }

  if (location && location !== "all") {
    params.set("location", location);
  }

  const query = params.toString();
  return query ? `/whats-on?${query}` : "/whats-on";
}

export default function WhatsOnExplorer({
  events,
  locations,
  initialStatus = "upcoming",
  initialLocation = "all",
}) {
  const locationOptions = useMemo(
    () => locations.map((location) => location.title),
    [locations],
  );
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);

  useEffect(() => {
    const nextUrl = buildFilterHref(selectedStatus, selectedLocation);
    window.history.replaceState(window.history.state, "", nextUrl);
  }, [selectedStatus, selectedLocation]);

  const hydratedEvents = useMemo(() => {
    return events
      .map((event) => {
        const resolvedLocations = Array.isArray(event.locations)
          ? event.locations
          : [];
        const preferredLocationTitle =
          selectedLocation !== "all" &&
          resolvedLocations.includes(selectedLocation)
            ? selectedLocation
            : resolvedLocations[0];
        const locationMatch = locations.find(
          (location) => location.title === preferredLocationTitle,
        );

        return {
          ...event,
          locationSlug: event.locationSlug || locationMatch?.slug || null,
          locationLabel: resolvedLocations.join(", "),
          imageSrc:
            event.imageSrc ||
            event.image?.src ||
            locationMatch?.heroImage?.asset?.url ||
            "/assets/images/locations/PXL_20260408_152408187.jpg",
          imageAlt:
            event.imageAlt ||
            event.image?.alt ||
            locationMatch?.heroImage?.alt ||
            event.title,
        };
      })
      .filter((event) =>
        selectedStatus === "upcoming"
          ? event.statusKey === "current" || event.statusKey === "upcoming"
          : event.statusKey === "past",
      )
      .filter((event) =>
        selectedLocation === "all"
          ? true
          : event.locations?.includes(selectedLocation),
      );
  }, [events, locations, selectedStatus, selectedLocation]);

  const groupedEvents = useMemo(
    () => buildEventGroups(hydratedEvents, selectedStatus),
    [hydratedEvents, selectedStatus],
  );

  return (
    <>
      <div className="flex flex-col gap-6 border-b border-[color:var(--color-border-soft)] pb-8">
        <div className="grid overflow-hidden rounded-[10px] border border-[color:var(--color-gold-soft)]/30 sm:grid-cols-2 max-sm:[&>*:not(:last-child)]:mb-[2px]">
          {statusOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSelectedStatus(option.key)}
              className={cn(
                "inline-flex min-h-11 items-center justify-center border-y-0 border-r px-4 py-2 text-center text-[0.84rem] font-extrabold tracking-[0.04em] transition-colors",
                option.key === statusOptions[0].key &&
                  "max-sm:rounded-t-[10px] sm:rounded-l-[10px] border-l-0",
                option.key === statusOptions[statusOptions.length - 1].key
                  ? "max-sm:rounded-b-[10px] sm:rounded-r-[10px] border-r-0"
                  : "border-[color:var(--color-gold-soft)]/30",
                selectedStatus === option.key
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-[color:var(--color-primary)]"
                  : "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-gold)] hover:border-[color:var(--color-primary)] hover:bg-[color:rgba(var(--color-primary-rgb),0.86)] hover:text-[color:var(--color-gold)]",
              )}
              style={{
                color:
                  selectedStatus === option.key
                    ? "var(--color-primary)"
                    : "var(--color-gold)",
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setSelectedLocation("all")}
            className={cn(
              "inline-flex min-h-10 items-center justify-center rounded-[1rem] border px-4 py-2 text-sm font-semibold transition-colors",
              selectedLocation === "all"
                ? "border-[color:var(--color-gold-soft)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-primary)]"
                : "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-gold)] hover:bg-[color:rgba(var(--color-primary-rgb),0.86)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-gold)]",
            )}
            style={{
              color:
                selectedLocation === "all"
                  ? "var(--color-primary)"
                  : "var(--color-gold)",
            }}
          >
            All Locations
          </button>
          {locationOptions.map((locationTitle) => (
            <button
              key={locationTitle}
              type="button"
              onClick={() => setSelectedLocation(locationTitle)}
              className={cn(
                "inline-flex min-h-10 items-center justify-center rounded-[1rem] border px-4 py-2 text-sm font-semibold transition-colors",
                selectedLocation === locationTitle
                  ? "border-[color:var(--color-gold-soft)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-primary)]"
                  : "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-gold)] hover:bg-[color:rgba(var(--color-primary-rgb),0.86)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-gold)]",
              )}
              style={{
                color:
                  selectedLocation === locationTitle
                    ? "var(--color-primary)"
                    : "var(--color-gold)",
              }}
            >
              {locationTitle}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-10">
        {hydratedEvents.length ? (
          <div className="space-y-16">
            {groupedEvents.map((group) => (
              <section key={group.label} className="space-y-6">
                <div>
                  <p className="eyebrow">Event Month</p>
                  <h2 className="mt-3 font-heading text-4xl text-[color:var(--color-primary)] md:text-5xl">
                    {group.label}
                  </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  {group.events.map((event) => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-soft)] px-6 py-10 text-lg leading-8 text-[color:var(--color-copy-soft)]">
            No events match the current filters yet.
          </div>
        )}
      </div>
    </>
  );
}
