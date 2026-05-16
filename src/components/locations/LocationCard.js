"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const defaultTabOptions = [
  { key: "details", label: "Details" },
  { key: "reviews", label: "Reviews" },
  { key: "hours", label: "Hours" },
];

const layoutClasses = {
  half: "lg:grid-cols-[1fr_1fr]",
  feature: "lg:grid-cols-[0.95fr_2.05fr]",
};

function buildTabUrl(tabKey, slug, currentParams) {
  const existingParams = new URLSearchParams();

  Object.entries(currentParams || {}).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => existingParams.append(key, item));
      return;
    }

    if (value !== undefined && value !== null && value !== "") {
      existingParams.set(key, String(value));
    }
  });

  existingParams.set(`tab-${slug}`, tabKey);

  return `/locations?${existingParams.toString()}`;
}

function buildBookNowHref(locationSlug) {
  const searchParams = new URLSearchParams();
  searchParams.set("location", locationSlug || "");

  return `/book-a-table?${searchParams.toString()}`;
}

function buildContactHref(slug) {
  const searchParams = new URLSearchParams();
  searchParams.set("location", slug || "");

  return `/contact?${searchParams.toString()}`;
}

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M21 12.23c0-.69-.06-1.2-.19-1.73H12v3.22h5.18c-.1.8-.62 2-1.78 2.81l-.02.11 2.58 1.96.18.02c1.66-1.5 2.86-3.72 2.86-6.39Z" fill="#4285F4" />
      <path d="M12 21c2.53 0 4.65-.81 6.2-2.21l-2.96-2.27c-.79.54-1.86.92-3.24.92-2.48 0-4.58-1.6-5.33-3.82l-.11.01-2.68 2.03-.04.1C5.38 18.8 8.41 21 12 21Z" fill="#34A853" />
      <path d="M6.67 13.62A5.62 5.62 0 0 1 6.36 12c0-.56.11-1.1.29-1.62l-.01-.11-2.71-2.06-.09.04A8.73 8.73 0 0 0 3 12c0 1.38.33 2.68.91 3.75l2.76-2.13Z" fill="#FBBC05" />
      <path d="M12 6.56c1.74 0 2.91.74 3.58 1.35l2.61-2.49C16.64 4 14.53 3 12 3 8.41 3 5.38 5.2 3.84 8.25l2.81 2.13c.76-2.22 2.86-3.82 5.35-3.82Z" fill="#EA4335" />
    </svg>
  );
}

function TripadvisorIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <circle cx="7.5" cy="11.5" r="3.2" stroke="#000000" strokeWidth="1.7" />
      <circle cx="16.5" cy="11.5" r="3.2" stroke="#000000" strokeWidth="1.7" />
      <circle cx="7.5" cy="11.5" r="1.1" fill="#34E0A1" />
      <circle cx="16.5" cy="11.5" r="1.1" fill="#34E0A1" />
      <path d="M10.5 11.5h3" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M4 8.2h16" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 16.8c1.2.9 2.7 1.4 4.2 1.4 1.2 0 2.1-.26 2.8-.8.7.54 1.65.8 2.8.8 1.6 0 3.1-.5 4.2-1.4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon(props) {
  return <FontAwesomeIcon icon={faFacebook} {...props} />;
}

function InstagramIcon(props) {
  return <FontAwesomeIcon icon={faInstagram} {...props} />;
}

function TikTokIcon(props) {
  return <FontAwesomeIcon icon={faTiktok} {...props} />;
}

function ContactRow({ icon: Icon, eyebrow, children }) {
  return (
    <div className="flex items-start gap-4 py-2">
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center text-[color:var(--color-gold-soft)]">
        <Icon className="size-8" />
      </span>
      <div className="min-w-0">
        <p className="mb-1 text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gold-soft)]">
          {eyebrow}
        </p>
        <div className="text-base leading-7 text-white/92">{children}</div>
      </div>
    </div>
  );
}

function SocialIconLink({ href, label, icon: Icon }) {
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="relative z-20 text-[color:var(--color-gold-soft)] transition-colors hover:text-[color:var(--color-gold)]"
      style={{ color: "var(--color-gold-soft)" }}
    >
      <Icon className="text-[2.6rem] sm:text-[3rem]" />
    </Link>
  );
}

function ReviewStatCard({
  brand,
  cardHref,
  reviewHref,
  rating,
  reviewCount,
  icon: Icon,
  ctaLabel,
}) {
  return (
    <div className="relative z-20 flex h-full flex-col justify-between border border-[color:var(--color-primary)]/14 bg-[color:var(--color-surface)] p-5 text-[color:var(--color-primary)]">
      {cardHref ? (
        <Link
          href={cardHref}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${brand} for this venue`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">Open {brand}</span>
        </Link>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-copy-soft)]">
            {brand}
          </p>
          <div className="mt-3 flex items-end gap-3">
            <span className="font-heading text-5xl leading-none text-[color:var(--color-gold)]">
              {rating ?? "-"}
            </span>
            <span className="pb-1 text-sm leading-5 text-[color:var(--color-copy-soft)]">
              out of 5
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--color-copy-soft)]">
            {typeof reviewCount === "number"
              ? `${reviewCount.toLocaleString("en-GB")} reviews`
              : "Review count to be added"}
          </p>
        </div>
        <Icon className="size-16 shrink-0" />
      </div>

      {reviewHref ? (
        <Link
          href={reviewHref}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 mt-6 inline-flex items-center gap-3 text-base font-semibold text-[color:var(--color-primary)] transition-colors hover:text-[color:var(--color-gold)]"
        >
          <span>{ctaLabel}</span>
          <ArrowUpRight className="size-5" />
        </Link>
      ) : null}
    </div>
  );
}

function renderDetailsTab(location) {
  return (
    <div className="grid gap-2">
      <ContactRow icon={MapPin} eyebrow="Get Directions">
        <Link
          href={location.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="relative z-20 transition-colors hover:text-[color:var(--color-gold)]"
        >
          {location.address}
        </Link>
      </ContactRow>

      <ContactRow icon={Phone} eyebrow="Telephone">
        <Link
          href={`tel:${location.telephone}`}
          className="relative z-20 transition-colors hover:text-[color:var(--color-gold)]"
        >
          {location.telephone}
        </Link>
      </ContactRow>

      {Array.isArray(location.featurePills) && location.featurePills.length ? (
        <div className="pt-2">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 auto-rows-fr">
            {location.featurePills.map((pill) => (
              <span
                key={pill}
                className="inline-flex min-h-[3.05rem] w-full items-center justify-center border border-[color:var(--color-gold-soft)]/45 px-3 py-2 text-center text-[0.76rem] leading-tight font-semibold tracking-[0.03em] text-[color:var(--color-gold-soft)] whitespace-normal transition-colors hover:bg-[color:var(--color-gold-soft)] hover:text-[color:var(--color-primary)]"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function renderReviewsTab(location) {
  const fallbackCardHref = location.website || null;
  const googleCardHref =
    location.googleUrl || location.googleReviewsUrl || fallbackCardHref;
  const tripadvisorCardHref =
    location.tripAdvisorUrl ||
    location.tripadvisorReviewsUrl ||
    fallbackCardHref;
  const hasAnyReviewSource =
    googleCardHref || tripadvisorCardHref;

  return hasAnyReviewSource ? (
    <div className="grid gap-4 lg:grid-cols-2">
      <ReviewStatCard
        cardHref={googleCardHref}
        // reviewHref={googleReviewHref}
        reviewHref={null}
        brand="Google"
        rating={location.googleRating}
        reviewCount={location.googleReviewCount}
        icon={GoogleIcon}
        ctaLabel="Leave a review on Google"
      />
      <ReviewStatCard
        cardHref={tripadvisorCardHref}
        // reviewHref={tripadvisorReviewHref}
        reviewHref={null}
        brand="Tripadvisor"
        rating={location.tripadvisorRating}
        reviewCount={location.tripadvisorReviewCount}
        icon={TripadvisorIcon}
        ctaLabel="Leave a review on Trip Advisor"
      />
    </div>
  ) : (
    <p className="py-4 text-base leading-7 text-white/72">
      Review links and ratings can be added in Sanity when they are ready.
    </p>
  );
}

function renderHoursTab(location) {
  const openingTimes = Array.isArray(location.openingTimes)
    ? location.openingTimes
    : [];

  return openingTimes.length ? (
    <div className="flex items-start gap-4 py-1">
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center text-[color:var(--color-gold-soft)]">
        <Clock3 className="size-8" />
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        {openingTimes.map((entry) => (
          <div
            key={entry.day}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-white/92"
          >
            <span className="min-w-[7.25rem] text-[0.78rem] font-extrabold uppercase tracking-[0.12em] text-[color:var(--color-gold-soft)]">
              {entry.day}
            </span>
            <span className="text-base leading-6">
              {entry.isClosed ? "Closed" : `${entry.openTime} - ${entry.closeTime}`}
            </span>
            {entry.notes ? (
              <span className="text-sm leading-6 text-white/64">{entry.notes}</span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <p className="py-4 text-base leading-7 text-white/72">
      Opening times can be added in Sanity when they are ready.
    </p>
  );
}

function renderTabPanel(activeTab, location) {
  switch (activeTab) {
    case "reviews":
      return renderReviewsTab(location);
    case "hours":
      return renderHoursTab(location);
    case "details":
    default:
      return renderDetailsTab(location);
  }
}

export default function LocationCard({
  location,
  activeTab = "details",
  currentParams = {},
  layout = "feature",
}) {
  const canBookOnline = location.canBookOnline !== false;
  const showReviews = location.showReviews !== false;
  const imageUrl = location.heroImage?.asset?.url;
  const imageAlt = location.heroImage?.alt || location.title;
  const slug = location.slug || location._id;
  const tabOptions = showReviews
    ? defaultTabOptions
    : defaultTabOptions.filter((tab) => tab.key !== "reviews");
  const resolvedActiveTab = tabOptions.some((tab) => tab.key === activeTab)
    ? activeTab
    : "details";
  const articleRef = useRef(null);
  const [selectedTabState, setSelectedTabState] = useState({
    source: resolvedActiveTab,
    value: resolvedActiveTab,
  });
  const [canHover, setCanHover] = useState(false);
  const [delayedInView, setDelayedInView] = useState(false);
  const resolvedLayoutClass = layoutClasses[layout] || layoutClasses.feature;
  const isInView = useInView(articleRef, { amount: 0.15 });
  const mobileReveal = !canHover && delayedInView;
  const burgersOrderHref = location.orderUrl || null;
  const isBurgersInGeneral = slug === "burgers-in-general-wells";
  const hasDirectBookingUrl = Boolean(location.bookingUrl);
  const showBookAction =
    isBurgersInGeneral ||
    (canBookOnline && (hasDirectBookingUrl || Boolean(location.openTableId)));

  const selectedTab =
    selectedTabState.source === resolvedActiveTab
      ? selectedTabState.value
      : resolvedActiveTab;

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

  function handleTabChange(tabKey) {
    setSelectedTabState({
      source: resolvedActiveTab,
      value: tabKey,
    });

    if (typeof window !== "undefined") {
      const nextUrl = buildTabUrl(tabKey, slug, currentParams);
      window.history.replaceState(window.history.state, "", nextUrl);
    }
  }

  return (
    <motion.article
      ref={articleRef}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="group relative scroll-mt-32 border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] shadow-[var(--shadow-overlay)] md:scroll-mt-36 lg:[zoom:0.9]"
      id={slug}
    >
      {location.website ? (
        <Link
          href={location.website}
          target="_blank"
          rel="noreferrer"
          aria-label={`Visit ${location.title} website`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">Visit {location.title} website</span>
        </Link>
      ) : null}

      <div className={cn("grid", resolvedLayoutClass)}>
        <div className="relative min-h-[22rem] overflow-hidden border-b border-[color:var(--color-gold)] lg:min-h-[100%] lg:border-b-0 lg:border-r">
          {imageUrl ? (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
                    canHover
                      ? "group-hover:scale-[1.08]"
                      : mobileReveal
                        ? "scale-[1.08]"
                        : "",
                  )}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                />
              </div>
              <div
                className={cn(
                  "absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0)_0%,rgba(var(--color-primary-rgb),0.18)_32%,rgba(var(--color-primary-rgb),0.62)_72%,rgba(var(--color-primary-rgb),1)_100%)] transition-opacity duration-500",
                  canHover
                    ? "opacity-80 group-hover:opacity-100"
                    : mobileReveal
                      ? "opacity-100"
                      : "opacity-80",
                )}
              />
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--color-surface-rgb),0.2)_0%,rgba(var(--color-surface-rgb),0)_34%,rgba(var(--color-surface-rgb),0)_100%)] transition-opacity duration-700",
                  canHover
                    ? "opacity-0 group-hover:opacity-15"
                    : mobileReveal
                      ? "opacity-15"
                      : "opacity-0",
                )}
              />
            </>
          ) : (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-surface-rgb),0.02)_0%,rgba(var(--color-primary-rgb),0.35)_100%)]" />
          )}

          <div className="pointer-events-none relative flex h-full items-end p-6">
            <div
              className={cn(
                "max-w-[24rem] space-y-3 transition-all duration-500",
                canHover
                  ? "translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  : mobileReveal
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0",
              )}
            >
              {location.summary ? (
                <>
                  <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.18em] text-[color:var(--color-gold-soft)]">
                    Overview
                  </p>
                  <p className="text-base leading-7 text-white">
                    {location.summary}
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="relative flex flex-col p-5 sm:p-6 lg:p-6 xl:p-8">
          <div
            className={cn(
              "relative z-20 grid overflow-hidden rounded-[10px] border border-[color:var(--color-gold-soft)]/30",
              tabOptions.length === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {tabOptions.map((tab) => {
              const isActive = selectedTab === tab.key;
              const isFirst = tab.key === tabOptions[0].key;
              const isLast = tab.key === tabOptions[tabOptions.length - 1].key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    "inline-flex min-h-10 cursor-pointer items-center justify-center border-y-0 border-r px-3 py-2 text-center text-[0.8rem] font-extrabold tracking-[0.03em] no-underline transition-colors",
                    isFirst && "rounded-l-[10px] border-l-0",
                    isLast
                      ? "rounded-r-[10px] border-r-0"
                      : "border-[color:var(--color-gold-soft)]/30",
                    isActive
                      ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-[color:var(--color-primary)] hover:text-[color:var(--color-primary)]"
                      : "border-[color:var(--color-gold-soft)]/35 bg-[rgba(var(--color-surface-rgb),0.05)] text-white/92 hover:border-[color:var(--color-gold-soft)] hover:bg-[rgba(var(--color-surface-rgb),0.09)] hover:text-white",
                  )}
                  style={{
                    color: isActive
                      ? "var(--color-primary)"
                      : "rgba(var(--color-surface-rgb),0.92)",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-1 flex-col pt-5 lg:pt-4 xl:pt-5">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                <div className="max-w-2xl">
                  <h2 className="font-heading text-[2rem] leading-[1.04] text-[color:var(--color-gold)] md:text-[2.45rem] xl:text-5xl">
                    {location.title}
                  </h2>
                </div>

                <div className="relative z-20 flex flex-wrap items-center gap-4 sm:shrink-0 sm:justify-end">
                  <SocialIconLink
                    href={location.socialLinks?.facebook}
                    label="Facebook"
                    icon={FacebookIcon}
                  />
                  <SocialIconLink
                    href={location.socialLinks?.instagram}
                    label="Instagram"
                    icon={InstagramIcon}
                  />
                  <SocialIconLink
                    href={location.socialLinks?.tiktok}
                    label="TikTok"
                    icon={TikTokIcon}
                  />
                </div>
              </div>
            </div>

            <div className="grid flex-1 py-5">
              {tabOptions.map((tab) => {
                const isActive = selectedTab === tab.key;

                return (
                  <div
                    key={tab.key}
                    className={cn(
                      "col-start-1 row-start-1 transition-opacity duration-200",
                      isActive
                        ? "pointer-events-auto visible opacity-100"
                        : "pointer-events-none invisible opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    {renderTabPanel(tab.key, location)}
                  </div>
                );
              })}
            </div>

            <div className="relative z-20 border-t border-white/10 pt-5">
              <div
                className={cn(
                  "grid w-full gap-3",
                  showBookAction ? "grid-cols-2" : "grid-cols-1",
                )}
              >
                <Link
                  href={buildContactHref(location.slug)}
                  className={cn(
                    "link-button link-button-on-dark w-full",
                    !showBookAction && "justify-self-center sm:max-w-[260px]",
                  )}
                >
                  Contact
                </Link>
                {showBookAction ? (
                  <Link
                    href={
                      isBurgersInGeneral
                        ? burgersOrderHref || location.website || "#"
                        : hasDirectBookingUrl
                          ? location.bookingUrl
                          : buildBookNowHref(location.slug)
                    }
                    target={
                      isBurgersInGeneral || hasDirectBookingUrl
                        ? "_blank"
                        : undefined
                    }
                    rel={
                      isBurgersInGeneral || hasDirectBookingUrl
                        ? "noreferrer"
                        : undefined
                    }
                    className={cn(
                      buttonVariants({ variant: "brandCta", size: "nav" }),
                      "w-full",
                    )}
                  >
                    {isBurgersInGeneral ? "Order Now" : "Book Now"}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
