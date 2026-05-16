"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

const ROTATE_INTERVAL_MS = 4200;

function isBannerActive(banner, now = new Date()) {
  if (!banner?.title) {
    return false;
  }

  const start = banner.start ? new Date(banner.start) : null;
  const end = banner.end ? new Date(banner.end) : null;

  if (start && now < start) {
    return false;
  }

  if (end && now > end) {
    return false;
  }

  return true;
}

export default function SiteBanner({ banners, onVisibilityChange }) {
  const activeBanners = useMemo(() => {
    if (!Array.isArray(banners)) {
      return [];
    }

    const now = new Date();
    return banners.filter((banner) => isBannerActive(banner, now));
  }, [banners]);

  const activeSignature = useMemo(
    () =>
      activeBanners
        .map((banner) =>
          [banner._id, banner.title, banner.link, banner.start, banner.end].join(
            "|",
          ),
        )
        .join("::"),
    [activeBanners],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dismissedSignature, setDismissedSignature] = useState("");
  const isDismissedForActiveSet =
    isDismissed && activeSignature && dismissedSignature === activeSignature;
  const isVisible = activeBanners.length > 0 && !isDismissedForActiveSet;

  useEffect(() => {
    if (!isVisible || activeBanners.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % activeBanners.length);
    }, ROTATE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [activeBanners.length, isVisible]);

  useEffect(() => {
    if (typeof onVisibilityChange === "function") {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  if (!isVisible) {
    return null;
  }

  const banner = activeBanners[activeIndex % activeBanners.length];
  const slideKey = banner?._id || `${banner?.title}-${activeIndex}`;
  const linkClassName =
    "inline-flex items-center justify-center gap-1.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-gold-soft)]";

  return (
    <div className="fixed inset-x-0 top-0 z-[60] border-b border-[color:var(--color-primary)]/20 bg-[color:var(--color-gold-soft)] text-[color:var(--color-primary)]">
      <div className="site-container relative flex h-[34px] items-center justify-center px-2 text-center text-[0.68rem] font-extrabold tracking-[0.09em] sm:text-[0.76rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={slideKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full px-8"
          >
            {banner.link ? (
              <Link
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClassName}
              >
                <span>{banner.title}</span>
                <ArrowUpRight className="size-3 sm:size-3.5" aria-hidden="true" />
              </Link>
            ) : (
              <span>{banner.title}</span>
            )}
          </motion.div>
        </AnimatePresence>
        <button
          type="button"
          aria-label="Dismiss site banner"
          className="absolute right-1 inline-flex size-7 items-center justify-center rounded-[0.45rem] text-[color:var(--color-primary)] transition-colors hover:bg-[color:rgba(var(--color-primary-rgb),0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
          onClick={() => {
            setDismissedSignature(activeSignature);
            setIsDismissed(true);
          }}
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
