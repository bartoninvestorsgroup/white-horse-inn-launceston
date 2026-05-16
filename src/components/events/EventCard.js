"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  MapPin,
  Share2,
  Ticket,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { normalizeOrigin, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const eventDateTimeOptions = {
  timeZone: "Europe/London",
};

function formatDateLabel(startAt, endAt) {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  const sameDay =
    end &&
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (sameDay) {
    return start.toLocaleDateString("en-GB", {
      ...eventDateTimeOptions,
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  if (end) {
    return `${start.toLocaleDateString("en-GB", {
      ...eventDateTimeOptions,
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("en-GB", {
      ...eventDateTimeOptions,
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  }

  return start.toLocaleDateString("en-GB", {
    ...eventDateTimeOptions,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTimeLabel(startAt, endAt) {
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  const startTime = start.toLocaleTimeString("en-GB", {
    ...eventDateTimeOptions,
    hour: "numeric",
    minute: "2-digit",
  });

  if (!end) {
    return startTime;
  }

  const endTime = end.toLocaleTimeString("en-GB", {
    ...eventDateTimeOptions,
    hour: "numeric",
    minute: "2-digit",
  });

  return `${startTime} - ${endTime}`;
}

function EventMetaRow({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-3 text-sm leading-6 text-white/82">
      <Icon className="size-4 text-[color:var(--color-gold-soft)]" />
      <span>{children}</span>
    </div>
  );
}

export default function EventCard({ event }) {
  const router = useRouter();
  const cardRef = useRef(null);
  const imageSrc = event.imageSrc;
  const imageAlt = event.imageAlt || event.title;
  const cardHref =
    event.ctaLink || (event.locationSlug ? `/locations#${event.locationSlug}` : null);
  const showSummary = Boolean(event.summary);
  const showDetails = Boolean(event.detailsExcerpt);
  const [shareFeedback, setShareFeedback] = useState("");
  const [canHover, setCanHover] = useState(false);
  const [delayedInView, setDelayedInView] = useState(false);
  const isInView = useInView(cardRef, { amount: 0.62 });
  const mobileReveal = !canHover && delayedInView;
  const configuredShareOrigin = normalizeOrigin(siteConfig.siteUrl);
  const shareOrigin =
    configuredShareOrigin && !configuredShareOrigin.includes("localhost")
      ? configuredShareOrigin
      : typeof window !== "undefined"
        ? window.location.origin
        : siteConfig.siteUrl;
  const shareUrl = `${shareOrigin.replace(/\/$/, "")}/whats-on/${event.slug || event._id}`;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const syncHoverCapability = () => setCanHover(mediaQuery.matches);
    syncHoverCapability();
    mediaQuery.addEventListener("change", syncHoverCapability);

    return () => mediaQuery.removeEventListener("change", syncHoverCapability);
  }, []);

  useEffect(() => {
    let timeoutId;

    if (canHover || !isInView) {
      timeoutId = window.setTimeout(() => {
        setDelayedInView(false);
      }, 0);
    } else {
      timeoutId = window.setTimeout(() => {
        setDelayedInView(true);
      }, 240);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [canHover, isInView]);

  function handleCardActivate() {
    if (!cardHref) {
      return;
    }

    if (cardHref.startsWith("http://") || cardHref.startsWith("https://")) {
      window.open(cardHref, "_blank", "noopener,noreferrer");
      return;
    }

    router.push(cardHref);
  }

  async function handleShare(eventObject) {
    eventObject.preventDefault();
    eventObject.stopPropagation();

    const payload = {
      title: event.title,
      text: event.summary || event.detailsExcerpt || event.title,
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        setShareFeedback("");
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      setShareFeedback("Link copied");
      window.setTimeout(() => setShareFeedback(""), 1800);
    } catch {
      setShareFeedback("");
    }
  }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      onClick={handleCardActivate}
      onKeyDown={(keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          handleCardActivate();
        }
      }}
      role={cardHref ? "link" : "article"}
      tabIndex={cardHref ? 0 : undefined}
      className={cn(
        "group relative overflow-hidden border border-[color:var(--color-primary)] bg-[color:var(--color-primary)]",
        cardHref
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-primary)]"
          : "",
      )}
      id={event.slug || event._id}
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 100vw, 50vw"
            className={cn(
              "object-cover object-center transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
              canHover
                ? "group-hover:scale-[1.08] group-hover:-translate-y-1 group-hover:-translate-x-1"
                : mobileReveal
                  ? "scale-[1.08] -translate-y-1 -translate-x-1"
                  : "",
            )}
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0)_0%,rgba(var(--color-primary-rgb),0.18)_32%,rgba(var(--color-primary-rgb),0.58)_72%,rgba(var(--color-primary-rgb),0.94)_100%)] transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
            canHover ? "group-hover:opacity-0" : mobileReveal ? "opacity-0" : "opacity-100",
          )}
        />
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0.3)_0%,rgba(var(--color-primary-rgb),0.46)_30%,rgba(var(--color-primary-rgb),0.74)_64%,rgba(var(--color-primary-rgb),1)_100%)]",
            canHover ? "opacity-0 group-hover:opacity-100" : mobileReveal ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--color-surface-rgb),0.18)_0%,rgba(var(--color-surface-rgb),0)_34%,rgba(var(--color-surface-rgb),0)_100%)] transition-opacity duration-700",
          canHover ? "opacity-0 group-hover:opacity-15" : mobileReveal ? "opacity-15" : "opacity-0",
        )}
      />
      <div className="pointer-events-none absolute inset-[20px] border border-[color:var(--color-gold-soft)] opacity-70" />
      <div
        className="pointer-events-none absolute inset-0 bg-white/[0.03] backdrop-blur-md"
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 20px 20px, 20px calc(100% - 20px), calc(100% - 20px) calc(100% - 20px), calc(100% - 20px) 20px, 20px 20px)",
        }}
      />

      <div className="relative z-20 flex min-h-[31rem] flex-col justify-end overflow-hidden p-6 sm:p-7">
        <div className="max-w-[28rem] pl-1 pb-1">
          <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--color-gold-soft)]">
            {event.statusLabel}
          </p>
          <h2 className="mt-4 font-heading text-[2.2rem] leading-[1.02] text-[color:var(--color-gold)] sm:text-[2.5rem]">
            {event.title}
          </h2>

          <div
            className={cn(
              "overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
              canHover
                ? "max-h-0 translate-y-8 opacity-0 group-hover:max-h-[24rem] group-hover:translate-y-0 group-hover:pt-5 group-hover:opacity-100"
                : mobileReveal
                  ? "max-h-[24rem] translate-y-0 pt-5 opacity-100"
                  : "max-h-0 translate-y-8 opacity-0",
            )}
          >
            {showSummary ? (
              <p className="text-base leading-7 text-white">
                {event.summary}
              </p>
            ) : null}

            {showDetails ? (
              <p className={cn(
                "text-base leading-7 text-white/82",
                showSummary ? "mt-4" : "",
              )}>
                {event.detailsExcerpt}
              </p>
            ) : null}

            <div className="mt-5 grid gap-2">
              <EventMetaRow icon={CalendarDays}>
                {formatDateLabel(event.startAt, event.endAt)}
              </EventMetaRow>
              <EventMetaRow icon={Clock3}>
                {formatTimeLabel(event.startAt, event.endAt)}
              </EventMetaRow>
              {event.locationLabel ? (
                <EventMetaRow icon={MapPin}>{event.locationLabel}</EventMetaRow>
              ) : null}
              {event.priceLabel ? (
                <EventMetaRow icon={Ticket}>{event.priceLabel}</EventMetaRow>
              ) : null}
            </div>

            {cardHref ? (
              <div className="mt-7 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/92">
                <span>{event.ctaLink ? "View Event" : "View Venue"}</span>
                <ArrowUpRight className="size-4" />
              </div>
            ) : null}
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-20 sm:bottom-7 sm:right-7">
          <button
            type="button"
            onClick={handleShare}
            className="flex size-12 items-center justify-center rounded-full border border-white/14 bg-[color:var(--color-glass-dark)]/95 text-white backdrop-blur-[var(--blur-glass)] transition-colors hover:border-[color:var(--color-gold)]/40 hover:bg-[color:var(--color-glass-gold)]/90 hover:text-[color:var(--color-primary)]"
            aria-label={`Share ${event.title}`}
          >
            <Share2 className="size-5" />
          </button>
          {shareFeedback ? (
            <p className="pointer-events-none absolute right-0 mt-2 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.12em] text-white/82">
              {shareFeedback}
            </p>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
