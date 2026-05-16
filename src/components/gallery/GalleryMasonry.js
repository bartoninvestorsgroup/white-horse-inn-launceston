"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import FoodImageCard from "@/components/ui/FoodImageCard";

function LightboxButton({ direction, onClick }) {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-14 items-center justify-center rounded-full border border-white/14 bg-[color:var(--color-glass-dark)]/95 text-white backdrop-blur-[var(--blur-glass)] transition-colors hover:border-[color:var(--color-gold)]/40 hover:bg-[color:var(--color-glass-gold)]/90 hover:text-[color:var(--color-primary)]"
    >
      <Icon className="size-7" />
    </button>
  );
}

function distributeItemsIntoColumns(items, columnCount) {
  const columns = Array.from({ length: columnCount }, () => []);

  items.forEach((item, index) => {
    columns[index % columnCount].push(item);
  });

  return columns;
}

function ColumnScrollButton({ direction, onClick }) {
  const Icon = direction === "down" ? ChevronDown : ChevronUp;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex size-12 items-center justify-center rounded-full border border-white/14 bg-[color:var(--color-glass-dark)]/95 text-white backdrop-blur-[var(--blur-glass)] transition-colors hover:border-[color:var(--color-gold)]/40 hover:bg-[color:var(--color-glass-gold)]/90 hover:text-[color:var(--color-primary)]"
      aria-label={direction === "down" ? "Show more gallery images below" : "Show previous gallery images above"}
    >
      <Icon className="size-6" />
    </button>
  );
}

export default function GalleryMasonry({ items }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [columnCount, setColumnCount] = useState(1);
  const [columnScrollState, setColumnScrollState] = useState([]);
  const columnRefs = useRef([]);
  const selectedItem =
    selectedIndex === null ? null : items[selectedIndex] || null;

  const columns = useMemo(
    () => distributeItemsIntoColumns(items, columnCount),
    [items, columnCount],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const syncViewport = () => setIsMobileViewport(mediaQuery.matches);

    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncViewport);
    };
  }, []);

  useEffect(() => {
    const fourColumnQuery = window.matchMedia("(min-width: 1100px)");
    const widescreenQuery = window.matchMedia("(min-width: 900px)");
    const tabletQuery = window.matchMedia("(min-width: 768px)");

    const syncColumns = () => {
      if (fourColumnQuery.matches) {
        setColumnCount(4);
        return;
      }

      if (widescreenQuery.matches) {
        setColumnCount(3);
        return;
      }

      if (tabletQuery.matches) {
        setColumnCount(2);
        return;
      }

      setColumnCount(1);
    };

    syncColumns();
    fourColumnQuery.addEventListener("change", syncColumns);
    widescreenQuery.addEventListener("change", syncColumns);
    tabletQuery.addEventListener("change", syncColumns);

    return () => {
      fourColumnQuery.removeEventListener("change", syncColumns);
      widescreenQuery.removeEventListener("change", syncColumns);
      tabletQuery.removeEventListener("change", syncColumns);
    };
  }, []);

  useEffect(() => {
    if (columnCount <= 1) {
      return undefined;
    }

    const syncColumnState = (index) => {
      const column = columnRefs.current[index];

      if (!column) {
        return;
      }

      const nextState = {
        canScrollUp: column.scrollTop > 24,
        canScrollDown:
          column.scrollTop + column.clientHeight < column.scrollHeight - 24,
      };

      setColumnScrollState((current) => {
        const previous = current[index];

        if (
          previous &&
          previous.canScrollUp === nextState.canScrollUp &&
          previous.canScrollDown === nextState.canScrollDown
        ) {
          return current;
        }

        const updated = [...current];
        updated[index] = nextState;
        return updated;
      });
    };

    const cleanups = columnRefs.current.map((column, index) => {
      if (!column) {
        return () => {};
      }

      const handleScroll = () => syncColumnState(index);
      window.requestAnimationFrame(() => syncColumnState(index));
      column.addEventListener("scroll", handleScroll, { passive: true });

      return () => {
        column.removeEventListener("scroll", handleScroll);
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [columnCount, columns]);

  function scrollColumnToAdjacentItem(columnIndex, direction) {
    const column = columnRefs.current[columnIndex];

    if (!column) {
      return;
    }

    const currentTop = column.scrollTop;
    const itemsInColumn = Array.from(
      column.querySelectorAll("[data-gallery-snap-item='true']"),
    );

    if (!itemsInColumn.length) {
      return;
    }

    const target =
      direction === "down"
        ? itemsInColumn.find((item) => item.offsetTop > currentTop + 12)
        : [...itemsInColumn]
            .reverse()
            .find((item) => item.offsetTop < currentTop - 12);

    if (!target) {
      return;
    }

    column.scrollTo({
      top: target.offsetTop,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    if (selectedIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? 0 : (current + 1) % items.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? 0 : current === 0 ? items.length - 1 : current - 1,
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [items.length, selectedIndex]);

  if (!items.length) {
      return (
      <div className="border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface-soft)] px-6 py-10 text-lg leading-8 text-[color:var(--color-copy-soft)]">
        Add your first gallery item in Sanity Studio to populate this page.
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid gap-6 ${columnCount === 1 ? "grid-cols-1" : ""} ${
          columnCount === 2 ? "md:grid-cols-2" : ""
        } ${columnCount === 3 ? "min-[900px]:grid-cols-3" : ""} ${
          columnCount === 4 ? "min-[1100px]:grid-cols-4" : ""
        }`}
      >
        {columns.map((column, columnIndex) => (
          <div key={`gallery-column-${columnIndex}`} className="relative">
            <div
              ref={(node) => {
                columnRefs.current[columnIndex] = node;
              }}
              className={`flex flex-col gap-6 ${
                columnCount > 1
                  ? "md:relative md:max-h-[calc(100svh-9rem)] md:overflow-y-auto md:overscroll-contain md:scroll-smooth md:snap-y md:snap-mandatory md:pr-1"
                  : ""
              }`}
            >
              {column.map((item, itemIndex) => {
                const globalIndex = items.findIndex(
                  (entry) => entry._id === item._id,
                );

                return (
                  <motion.div
                    key={item._id}
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 42 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.18 }}
                    transition={{
                      duration: 0.8,
                      ease: [0.22, 1, 0.36, 1],
                      delay: shouldReduceMotion
                        ? 0
                        : columnIndex * 0.08 + itemIndex * 0.05,
                    }}
                    className={columnCount > 1 ? "md:snap-start" : ""}
                    data-gallery-snap-item="true"
                  >
                    <FoodImageCard
                      src={item.src}
                      alt={item.alt || item.title || "Gallery image"}
                      title={item.title}
                      description={item.caption}
                      eyebrow={item.eyebrow || item.location?.title}
                      size={item.displaySize === "landscape" ? "landscape" : "portrait"}
                      fluidHeight
                      blurFrame
                      innerBorderTone={item.featured ? "gold" : "soft"}
                      onClick={() => setSelectedIndex(globalIndex)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedIndex(globalIndex);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      ariaLabel={`Open gallery image: ${item.title || "Gallery image"}`}
                      className="w-full"
                    />
                  </motion.div>
                );
              })}
            </div>

            {columnCount > 1 && columnScrollState[columnIndex]?.canScrollUp === true ? (
              <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center">
                <div className="pointer-events-auto">
                  <ColumnScrollButton
                    direction="up"
                    onClick={() =>
                      scrollColumnToAdjacentItem(columnIndex, "up")
                    }
                  />
                </div>
              </div>
            ) : null}

            {columnCount > 1 && columnScrollState[columnIndex]?.canScrollDown === true ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center">
                <div className="pointer-events-auto">
                  <ColumnScrollButton
                    direction="down"
                    onClick={() =>
                      scrollColumnToAdjacentItem(columnIndex, "down")
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[90] bg-[color:rgba(var(--color-primary-rgb),0.92)] backdrop-blur-md"
            onClick={() => setSelectedIndex(null)}
          >
            <div className="absolute right-3 top-3 z-10 sm:right-6 sm:top-6">
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="flex size-14 items-center justify-center rounded-full border border-white/14 bg-[color:var(--color-glass-dark)]/95 text-white backdrop-blur-[var(--blur-glass)] transition-colors hover:border-[color:var(--color-gold)]/40 hover:bg-[color:var(--color-glass-gold)]/90 hover:text-[color:var(--color-primary)]"
                aria-label="Close image viewer"
              >
                <X className="size-7" />
              </button>
            </div>

            <div className="absolute inset-y-0 left-3 z-10 hidden items-center sm:flex">
              <LightboxButton
                direction="previous"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedIndex((current) =>
                    current === null ? 0 : current === 0 ? items.length - 1 : current - 1,
                  );
                }}
              />
            </div>

            <div className="absolute inset-y-0 right-3 z-10 hidden items-center sm:flex">
              <LightboxButton
                direction="next"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedIndex((current) =>
                    current === null ? 0 : (current + 1) % items.length,
                  );
                }}
              />
            </div>

            <div className="flex min-h-full items-center justify-center px-2 py-20 sm:px-8">
              <motion.div
                key={selectedItem._id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-[min(92vw,1400px)]"
                onContextMenu={(event) => event.stopPropagation()}
              >
                <div className="relative aspect-[4/5] max-h-[82vh] overflow-hidden border border-white/14 bg-[color:rgba(var(--color-surface-rgb),0.04)] sm:aspect-[16/10]">
                  <Image
                    src={
                      isMobileViewport
                        ? selectedItem.mobileLightboxSrc || selectedItem.desktopLightboxSrc || selectedItem.src
                        : selectedItem.desktopLightboxSrc || selectedItem.mobileLightboxSrc || selectedItem.src
                    }
                    alt={selectedItem.alt || selectedItem.title || "Gallery image"}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>

                {(selectedItem.title ||
                  selectedItem.caption ||
                  selectedItem.eyebrow ||
                  selectedItem.location?.title) && (
                  <div className="mx-auto mt-5 max-w-4xl text-center">
                    {selectedItem.eyebrow || selectedItem.location?.title ? (
                      <p className="eyebrow text-white/78">
                        {selectedItem.eyebrow || selectedItem.location?.title}
                      </p>
                    ) : null}
                    {selectedItem.title ? (
                      <h2 className="mt-3 font-heading text-3xl text-white sm:text-4xl">
                        {selectedItem.title}
                      </h2>
                    ) : null}
                    {selectedItem.caption ? (
                      <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
                        {selectedItem.caption}
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-center gap-4 sm:hidden">
                  <LightboxButton
                    direction="previous"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex((current) =>
                        current === null ? 0 : current === 0 ? items.length - 1 : current - 1,
                      );
                    }}
                  />
                  <LightboxButton
                    direction="next"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedIndex((current) =>
                        current === null ? 0 : (current + 1) % items.length,
                      );
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
