"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Users } from "lucide-react";
import locations from "@/data/locations.json";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/lib/site";
import {
  getBookingSessionsForDate,
  isSlotInAnySession,
  parseTimeToMinutes,
} from "@/lib/location-hours";
import { buildOpenTableBookingUrl } from "@/lib/opentable";
import { cn } from "@/lib/utils";

const PARTY_SIZES = Array.from({ length: 12 }, (_, index) => index + 1);
const LONDON_TIMEZONE = "Europe/London";
const defaultOpenTableId = process.env.NEXT_PUBLIC_OPENTABLE_RESTAURANT_ID || "";

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

export default function OpenTableBookingWidget({
  live = true,
  openTableId = defaultOpenTableId,
}) {
  const selectedLocation = locations.find(
    (location) => location.slug === "white-horse-inn-launceston",
  ) || locations[0];
  const resolvedOpenTableId = openTableId || selectedLocation?.openTableId || "";
  const dateOptions = useMemo(() => buildDateOptions(90), []);
  const allTimeOptions = useMemo(() => buildTimeOptions(), []);
  const todayDate = dateOptions[0]?.value || getTodayLondonDate();
  const [date, setDate] = useState(todayDate);
  const [time, setTime] = useState("19:00");
  const [partySize, setPartySize] = useState(2);
  const [dateNotice, setDateNotice] = useState("");

  const bookingSessions = useMemo(
    () => getBookingSessionsForDate(selectedLocation, date),
    [date, selectedLocation],
  );

  const availableTimeOptions = useMemo(() => {
    return allTimeOptions.filter((timeOption) => {
      const slotMinutes = parseTimeToMinutes(timeOption.value);
      if (slotMinutes === null || !isSlotInAnySession(slotMinutes, bookingSessions)) {
        return false;
      }

      if (!isToday(date)) {
        return true;
      }

      const { hour, minute } = getLondonNowParts();
      const nowMinutes = hour * 60 + minute;

      return slotMinutes > nowMinutes;
    });
  }, [allTimeOptions, bookingSessions, date]);

  const effectiveTime =
    availableTimeOptions.some((slot) => slot.value === time)
      ? time
      : availableTimeOptions[0]?.value || "";

  const bookingUrl =
    resolvedOpenTableId && effectiveTime
      ? buildOpenTableBookingUrl({
          openTableId: resolvedOpenTableId,
          partySize,
          date,
          time: effectiveTime,
        })
      : null;

  function handleDateSelect(nextDateValue) {
    if (isChristmasDay(nextDateValue)) {
      setDateNotice("Please contact us directly about Christmas Day bookings.");
      return;
    }

    setDate(nextDateValue);
    setDateNotice("");
  }

  if (!live) {
    return null;
  }

  return (
    <section className="pb-20 md:pb-24">
      <div className="site-container px-1">
        <div className="border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] p-5 shadow-[0_30px_90px_rgba(10,14,28,0.2)] sm:p-7 lg:p-8">
          <div className="mx-auto max-w-[66rem]">
            <div className="mb-6 grid gap-5 border-b border-white/12 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="eyebrow">Book a Table</p>
                <h2 className="mt-3 font-heading text-[2rem] leading-[1.05] text-[color:var(--color-gold)] md:text-[2.5rem]">
                  Reserve your table at the White Horse Inn
                </h2>
                <p className="mt-4 max-w-[48rem] text-base leading-7 text-white/88">
                  Pick your preferred date, time and party size, then continue
                  to OpenTable to complete the reservation.
                </p>
              </div>
              <div className="flex items-start gap-3 border border-white/14 bg-white/6 px-4 py-3 text-white/86">
                <MapPin className="mt-1 size-4 shrink-0 text-[color:var(--color-gold-soft)]" />
                <p className="text-sm leading-6">
                  {selectedLocation?.title || siteConfig.shortName}
                  <span className="block text-white/64">
                    {selectedLocation?.address?.split("\n").at(-2) || "Launceston"}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="grid gap-2 lg:max-w-md">
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
                  <SelectContent className="border-[color:var(--color-primary)]/18 bg-white text-[color:var(--color-primary)]">
                    {PARTY_SIZES.map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} {size === 1 ? "guest" : "guests"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

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
                    {partySize} {partySize === 1 ? "guest" : "guests"} |{" "}
                    {dateOptions.find((item) => item.value === date)?.dayMonth || date} |{" "}
                    {effectiveTime ? formatTimeLabel(effectiveTime) : "No slot selected"}
                  </span>
                </p>
              </div>
            </div>

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
                Book on OpenTable
              </a>
              <p className="text-sm leading-6 text-white/74">
                {bookingUrl
                  ? "Reservations are completed securely on OpenTable."
                  : "Add NEXT_PUBLIC_OPENTABLE_RESTAURANT_ID to enable this booking form."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
