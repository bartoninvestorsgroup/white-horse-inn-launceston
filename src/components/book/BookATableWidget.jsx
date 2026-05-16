"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Clock3, Users } from "lucide-react";
import locations from "@/data/locations.json";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  getBookingSessionsForDate,
  isSlotInAnySession,
  parseTimeToMinutes,
} from "@/lib/location-hours";
import { buildOpenTableBookingUrl } from "@/lib/opentable";

const PARTY_SIZES = Array.from({ length: 12 }, (_, index) => index + 1);
const LONDON_TIMEZONE = "Europe/London";

function getLondonNowParts() {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = formatter.formatToParts(new Date());
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(byType.year),
    month: Number(byType.month),
    day: Number(byType.day),
    hour: Number(byType.hour),
    minute: Number(byType.minute),
  };
}

function getTodayLondonDate() {
  const { year, month, day } = getLondonNowParts();
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDateChip(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const weekday = date.toLocaleDateString("en-GB", {
    timeZone: LONDON_TIMEZONE,
    weekday: "short",
  });
  const dayMonth = date.toLocaleDateString("en-GB", {
    timeZone: LONDON_TIMEZONE,
    day: "numeric",
    month: "short",
  });

  return { weekday, dayMonth };
}

function formatTimeLabel(value) {
  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);
  const date = new Date(Date.UTC(2000, 0, 1, hours, minutes, 0, 0));

  return date.toLocaleTimeString("en-GB", {
    timeZone: LONDON_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
  });
}

function buildDateOptions(count = 90) {
  const today = getTodayLondonDate();
  const [year, month, day] = today.split("-").map(Number);
  const anchorDate = new Date(Date.UTC(year, month - 1, day));

  return Array.from({ length: count }, (_, index) => {
    const nextDate = new Date(anchorDate);
    nextDate.setUTCDate(anchorDate.getUTCDate() + index);
    const iso = nextDate.toISOString().slice(0, 10);
    const label = formatDateChip(iso);

    return { value: iso, ...label };
  });
}

function buildTimeOptions() {
  const options = [];

  for (let hour = 11; hour <= 22; hour += 1) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute > 0) {
        continue;
      }

      const value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
      options.push({
        value,
        label: formatTimeLabel(value),
      });
    }
  }

  return options;
}

function isToday(isoDate) {
  return isoDate === getTodayLondonDate();
}

function isChristmasDay(isoDate) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.getUTCMonth() === 11 && date.getUTCDate() === 25;
}

export default function BookATableWidget() {
  const searchParams = useSearchParams();
  const dateOptions = useMemo(() => buildDateOptions(90), []);
  const allTimeOptions = useMemo(() => buildTimeOptions(), []);
  const todayDate = dateOptions[0]?.value || getTodayLondonDate();

  const bookableLocations = useMemo(
    () =>
      locations.filter(
        (location) =>
          location.canBookOnline !== false &&
          ((typeof location.openTableId === "string" && location.openTableId.trim()) ||
            (typeof location.bookingUrl === "string" && location.bookingUrl.trim())),
      ),
    [],
  );

  const [locationSlug, setLocationSlug] = useState("");
  const [date, setDate] = useState(todayDate);
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [dateNotice, setDateNotice] = useState("");

  const locationParam = searchParams.get("location");
  const ridParam = searchParams.get("rid");

  const defaultLocation = useMemo(() => {
    if (!bookableLocations.length) {
      return null;
    }

    const byLocationParam = locationParam
      ? bookableLocations.find((location) => location.slug === locationParam)
      : null;
    const byRidParam = ridParam
      ? bookableLocations.find((location) => location.openTableId === ridParam)
      : null;

    return byLocationParam || byRidParam || bookableLocations[0];
  }, [bookableLocations, locationParam, ridParam]);

  const effectiveLocationSlug = locationSlug || defaultLocation?.slug || "";

  const selectedLocation = useMemo(
    () =>
      bookableLocations.find((location) => location.slug === effectiveLocationSlug) || null,
    [bookableLocations, effectiveLocationSlug],
  );
  const isHospresLocation =
    Boolean(selectedLocation?.bookingUrl) && !Boolean(selectedLocation?.openTableId);
  const isOpenTableLocation = Boolean(selectedLocation?.openTableId);

  const bookingSessions = useMemo(
    () => getBookingSessionsForDate(selectedLocation, date),
    [selectedLocation, date],
  );

  const availableTimeOptions = useMemo(() => {
    if (!bookingSessions.length) {
      return [];
    }

    return allTimeOptions.filter((timeOption) => {
      const slotMinutes = parseTimeToMinutes(timeOption.value);
      if (slotMinutes === null) {
        return false;
      }

      const inOpeningWindow = isSlotInAnySession(slotMinutes, bookingSessions);

      if (!inOpeningWindow) {
        return false;
      }

      if (isToday(date)) {
        const { hour, minute } = getLondonNowParts();
        const nowMinutes = hour * 60 + minute;
        return slotMinutes > nowMinutes;
      }

      return true;
    });
  }, [allTimeOptions, date, bookingSessions]);

  const effectiveTime =
    availableTimeOptions.some((slot) => slot.value === time)
      ? time
      : availableTimeOptions[0]?.value || "";

  const bookingUrl = isOpenTableLocation && Boolean(effectiveTime)
    ? buildOpenTableBookingUrl({
        openTableId: selectedLocation.openTableId,
        partySize,
        date,
        time: effectiveTime,
      })
    : selectedLocation?.bookingUrl || null;

  function handleDateSelect(nextDateValue) {
    if (isChristmasDay(nextDateValue)) {
      setDateNotice("Please contact us directly about Christmas Day bookings.");
      return;
    }

    setDate(nextDateValue);
    setDateNotice("");
  }

  return (
    <section className="pb-20 md:pb-24">
      <div className="site-container px-1">
        <div className="border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] p-5 sm:p-7 lg:p-8">
          <div className="mx-auto max-w-[66rem]">
            <div className="mb-6 border-b border-white/12 pb-5">
              <p className="eyebrow">Book a Table</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-[1.05] text-[color:var(--color-gold)] md:text-[2.5rem]">
                Reserve directly with your selected venue
              </h2>
              <p className="mt-4 max-w-[58rem] text-base leading-7 text-white/88">
                Choose your location and continue to the correct booking destination for that
                venue.
              </p>
            </div>

            {bookableLocations.length ? (
              <div className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="eyebrow text-[0.66rem]">Location</span>
                    <Select value={effectiveLocationSlug} onValueChange={setLocationSlug}>
                      <SelectTrigger
                        className="min-h-14 w-full border border-white/20 bg-white/8 px-4 text-base text-white transition-colors focus-visible:border-[color:var(--color-gold)] focus-visible:ring-[color:var(--color-gold)]/35 [&_svg]:text-[color:var(--color-gold-soft)]"
                        aria-label="Choose a location"
                      >
                        <SelectValue placeholder="Choose a location">
                          {selectedLocation?.title || "Choose a location"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="border-[color:var(--color-primary)]/18 bg-[color:var(--color-surface)] text-[color:var(--color-primary)]">
                        {bookableLocations.map((location) => (
                          <SelectItem key={location.slug} value={location.slug}>
                            {location.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>

                  {isOpenTableLocation ? (
                    <label className="grid gap-2">
                      <span className="eyebrow text-[0.66rem]">Party Size</span>
                      <Select
                        value={String(partySize)}
                        onValueChange={(value) => setPartySize(Number(value))}
                      >
                        <SelectTrigger
                          className="min-h-14 w-full border border-white/20 bg-white/8 px-4 text-base text-white transition-colors focus-visible:border-[color:var(--color-gold)] focus-visible:ring-[color:var(--color-gold)]/35 [&_svg]:text-[color:var(--color-gold-soft)]"
                          aria-label="Choose party size"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Users className="size-4 text-[color:var(--color-gold-soft)]" />
                            <SelectValue placeholder="Party size" />
                          </span>
                        </SelectTrigger>
                        <SelectContent className="border-[color:var(--color-primary)]/18 bg-[color:var(--color-surface)] text-[color:var(--color-primary)]">
                          {PARTY_SIZES.map((size) => (
                            <SelectItem key={size} value={String(size)}>
                              {size} {size === 1 ? "guest" : "guests"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>
                  ) : null}
                </div>

                {isOpenTableLocation ? (
                  <>
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="border border-white/14 bg-white/6 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <CalendarDays className="size-4 text-[color:var(--color-gold-soft)]" />
                          <p className="eyebrow text-[0.64rem]">Select Date</p>
                        </div>

                        <div className="grid max-h-[13.5rem] grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5">
                          {dateOptions.map((dateOption) => {
                            const selected = date === dateOption.value;
                            const christmasDay = isChristmasDay(dateOption.value);

                            return (
                              <button
                                key={dateOption.value}
                                type="button"
                                onClick={() => handleDateSelect(dateOption.value)}
                                className={cn(
                                  "border px-2 py-2 text-center transition-colors sm:px-3",
                                  selected
                                    ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-[color:var(--color-primary)]"
                                    : christmasDay
                                      ? "border-[color:var(--color-gold-soft)]/55 bg-white/10 text-[color:var(--color-gold-soft)] hover:border-[color:var(--color-gold)]/70 hover:bg-white/14"
                                      : "border-white/20 bg-white/8 text-white hover:border-[color:var(--color-gold-soft)]/65 hover:bg-white/12",
                                )}
                              >
                                <span className="block text-[0.65rem] font-extrabold uppercase tracking-[0.12em]">
                                  {dateOption.weekday}
                                </span>
                                <span className="mt-1 block text-sm font-semibold">
                                  {dateOption.dayMonth}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        {dateNotice ? (
                          <p className="mt-3 text-sm leading-6 text-[color:var(--color-gold-soft)]">
                            {dateNotice}
                          </p>
                        ) : null}
                      </div>

                      <div className="border border-white/14 bg-white/6 p-4 sm:p-5">
                        <div className="mb-3 flex items-center gap-2">
                          <Clock3 className="size-4 text-[color:var(--color-gold-soft)]" />
                          <p className="eyebrow text-[0.64rem]">Select Time</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {availableTimeOptions.map((timeOption) => {
                            const selected = effectiveTime === timeOption.value;

                            return (
                              <button
                                key={timeOption.value}
                                type="button"
                                onClick={() => setTime(timeOption.value)}
                                className={cn(
                                  "border px-3 py-2 text-sm font-semibold transition-colors",
                                  selected
                                    ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-[color:var(--color-primary)]"
                                    : "border-white/20 bg-white/8 text-white hover:border-[color:var(--color-gold-soft)]/65 hover:bg-white/12",
                                )}
                              >
                                {timeOption.label}
                              </button>
                            );
                          })}
                        </div>

                        {!availableTimeOptions.length ? (
                          <p className="mt-3 text-sm leading-6 text-white/78">
                            No booking slots available for this date.
                          </p>
                        ) : null}
                        {bookingSessions.length ? (
                          <p className="mt-3 text-xs leading-5 text-white/66">
                            Service windows:{" "}
                            {bookingSessions
                              .map((session) => `${session.openTime} - ${session.closeTime}`)
                              .join(" | ")}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="border border-white/12 bg-white/[0.03] p-4 sm:p-5">
                      <p className="text-sm leading-6 text-white/82">
                        Reservation summary:
                        <span className="ml-2 font-semibold text-[color:var(--color-gold-soft)]">
                          {selectedLocation?.title || "Select location"} | {partySize}{" "}
                          {partySize === 1 ? "guest" : "guests"} |{" "}
                          {dateOptions.find((item) => item.value === date)?.dayMonth || date} |{" "}
                          {effectiveTime
                            ? formatTimeLabel(effectiveTime)
                            : "No slot selected"}
                        </span>
                      </p>
                    </div>
                  </>
                ) : null}
              </div>
            ) : (
              <p className="rounded-sm border border-white/16 bg-white/5 px-4 py-4 text-base leading-7 text-white/85">
                No bookable locations are available yet.
              </p>
            )}

            <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <a
                href={bookingUrl || "#"}
                target={bookingUrl ? "_blank" : undefined}
                rel={bookingUrl ? "noreferrer" : undefined}
                className={cn(
                  buttonVariants({ variant: "brandCta", size: "hero" }),
                  "w-full sm:w-auto",
                  !bookingUrl && "pointer-events-none opacity-60",
                )}
              >
                {isHospresLocation ? "Book Now" : "Book on OpenTable"}
              </a>
              <p className="text-sm leading-6 text-white/74">
                We don’t process bookings on this website. Reservations are completed securely on
                {isHospresLocation ? " Hospres." : " OpenTable."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
