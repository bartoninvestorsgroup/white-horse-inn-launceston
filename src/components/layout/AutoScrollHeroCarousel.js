"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const kidsCarouselColors = {
  meals: "#FFAADB",
  snacks: "#F1C816",
  drinks: "#F08D2B",
};

function normalizeKey(value) {
  return String(value || "").trim().toLowerCase();
}

function getKidsCarouselColor(slide) {
  return kidsCarouselColors[normalizeKey(slide?.sectionTitle || slide?.eyebrow)];
}

function PaintBlobLabel({
  children,
  color = "var(--color-primary)",
  className = "",
  textClassName = "",
}) {
  return (
    <span className={`relative inline-grid place-items-center px-7 py-3 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 240 96"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M22.6 53.7C11.4 39.4 22.7 17.5 47.8 13.8c15.9-2.3 26.6 2.9 40.7-1.8 18.2-6.1 39.6-11.2 58-1.2 15.5 8.4 17.9 20.9 39.4 20.1 22.5-.8 39 9.1 37.9 26.3-1 15.6-16.3 25.1-37.4 24.5-17.5-.5-26.3 8.7-47.7 9.8-17.3.9-27.5-5-43.6-3.6-24.8 2.1-42.6 4.6-57.2-7.2-8.5-6.9-7.9-16.4-15.3-27Z"
          fill={color}
        />
      </svg>
      <span className={`relative z-10 ${textClassName}`}>{children}</span>
    </span>
  );
}

function HeroArrow({ direction = "next", onClick }) {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <button
      type="button"
      aria-label={direction === "next" ? "Next slide" : "Previous slide"}
      onClick={onClick}
      className="group flex size-14 items-center justify-center rounded-full border border-white/14 bg-[color:var(--color-glass-dark)]/95 text-white backdrop-blur-[var(--blur-glass)] transition-colors hover:border-[color:var(--color-gold)]/40 hover:bg-[color:var(--color-glass-gold)]/90 hover:text-[color:var(--color-primary)]"
    >
      <Icon className="size-6 transition-transform duration-300 group-hover:scale-110" />
    </button>
  );
}

function HeroDots({ slides, activeIndex, onSelect }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {slides.map((slide, index) => {
        const active = index === activeIndex;

        return (
          <button
            key={slide.id || slide.src || index}
            type="button"
            aria-label={`Go to slide ${index + 1}`}
            aria-pressed={active}
            onClick={() => onSelect(index)}
            className={cn(
              "h-3 rounded-full border transition-all duration-300",
              active
                ? "w-10 border-[color:var(--color-gold)] bg-[color:var(--color-gold)]"
                : "w-3 border-white/35 bg-white/20 hover:border-white/60 hover:bg-white/35",
            )}
          />
        );
      })}
    </div>
  );
}

const contentVariants = {
  initial: {
    opacity: 0,
    y: 28,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(8px)",
    transition: {
      duration: 0.42,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  initial: {
    opacity: 0,
    y: 18,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.35,
      ease: [0.4, 0, 1, 1],
    },
  },
};

export default function AutoScrollHeroCarousel({
  slides,
  autoPlayMs = 6500,
  className = "",
}) {
  const sectionRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  const safeSlides = useMemo(
    () => (Array.isArray(slides) ? slides.filter(Boolean) : []),
    [slides],
  );
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 0]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    [1.04, shouldReduceMotion ? 1.04 : 1.18],
  );

  useEffect(() => {
    if (shouldReduceMotion || safeSlides.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeSlides.length);
    }, autoPlayMs);

    return () => window.clearInterval(interval);
  }, [autoPlayMs, safeSlides.length, shouldReduceMotion]);

  if (!safeSlides.length) {
    return null;
  }

  const activeSlide = safeSlides[activeIndex];
  const activeSlideIsKids = activeSlide?.menuType === "kidsMenu";
  const activeSlideKidsColor = activeSlideIsKids
    ? getKidsCarouselColor(activeSlide) || "var(--color-primary)"
    : null;
  const initialDelay = activeIndex === 0 ? 0.16 : 0;

  function goToIndex(nextIndex) {
    if (nextIndex === activeIndex) {
      return;
    }

    setActiveIndex(nextIndex);
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % safeSlides.length);
  }

  function goToPrevious() {
    setActiveIndex((current) =>
      current === 0 ? safeSlides.length - 1 : current - 1,
    );
  }

  const slideVariants = shouldReduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, scale: 1.035 },
        animate: { opacity: 1, scale: 1.01 },
        exit: { opacity: 0, scale: 1 },
      };

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-0 h-[100dvh] overflow-hidden bg-[color:var(--color-primary)]"
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.id || activeSlide.src || activeIndex}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: shouldReduceMotion ? 0.3 : 1.05,
              ease: [0.22, 1, 0.36, 1],
              delay: initialDelay,
            }}
            className="absolute inset-0"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={activeSlide.src}
                alt={activeSlide.alt}
                fill
                loading="eager"
                fetchPriority={activeIndex === 0 ? "high" : "auto"}
                sizes="100vw"
                className="object-cover object-center"
                style={{
                  objectPosition: activeSlide.imagePosition || "center",
                }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-image-vignette-rgb),0.72)_0%,rgba(var(--color-image-vignette-rgb),0.34)_24%,rgba(var(--color-image-vignette-rgb),0.22)_52%,rgba(var(--color-image-vignette-rgb),0.88)_100%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--color-surface-rgb),0.14),transparent_34%)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <section
        ref={sectionRef}
        className={cn(
          "relative z-10 flex min-h-[100dvh] items-end overflow-hidden",
          className,
        )}
      >
        <div className="site-container relative z-10 flex w-full flex-col justify-end px-2 pb-4 pt-24 sm:pb-6 sm:pt-28 md:pb-8 md:pt-32 lg:pb-10 lg:pt-36">
          <div className="relative min-h-[14.5rem] max-w-4xl sm:min-h-[16rem] md:min-h-[18rem] lg:min-h-[20rem]">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={`content-${activeSlide.id || activeSlide.src || activeIndex}`}
                variants={shouldReduceMotion ? undefined : contentVariants}
                initial={shouldReduceMotion ? { opacity: 0 } : "initial"}
                animate={shouldReduceMotion ? { opacity: 1 } : "animate"}
                exit={shouldReduceMotion ? { opacity: 0 } : "exit"}
                transition={
                  shouldReduceMotion
                    ? { duration: 0.25, delay: initialDelay }
                    : { delay: initialDelay }
                }
                className="absolute inset-x-0 bottom-0"
              >
                {activeSlide.eyebrow ? (
                  <motion.p
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className={activeSlideIsKids ? "" : "eyebrow text-white/88"}
                  >
                    {activeSlideIsKids ? (
                      <PaintBlobLabel
                        color={activeSlideKidsColor}
                        className="min-h-[3.8rem] min-w-[9rem] px-5 py-2"
                        textClassName="kids-menu-font-heading text-3xl leading-none text-[#111111]"
                      >
                        {activeSlide.eyebrow}
                      </PaintBlobLabel>
                    ) : (
                      activeSlide.eyebrow
                    )}
                  </motion.p>
                ) : null}
                {activeSlide.title ? (
                  <motion.h1
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className={
                      activeSlideIsKids
                        ? "kids-menu-font-heading kids-menu-outlined-text mt-1 max-w-4xl text-[clamp(2.8rem,8.4vw,5.6rem)] leading-[0.84]"
                        : "mt-2 max-w-4xl font-heading text-[clamp(2.05rem,7.1vw,3.55rem)] leading-[0.9] text-white md:text-[clamp(3rem,6vw,4.55rem)]"
                    }
                  >
                    {activeSlide.title}
                  </motion.h1>
                ) : null}
                {activeSlide.description ? (
                  <motion.p
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className={
                      activeSlideIsKids
                        ? "kids-menu-font-body mt-2 max-w-2xl text-xl leading-7 text-white md:mt-3 md:text-2xl md:leading-8"
                        : "mt-2 max-w-2xl text-[0.92rem] leading-6 text-white/76 sm:text-[0.96rem] sm:leading-6 md:mt-3 md:text-[0.98rem] md:leading-7"
                    }
                  >
                    {activeSlide.description}
                  </motion.p>
                ) : null}

                {activeSlide.primaryCta || activeSlide.secondaryCta ? (
                  <motion.div
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    className="mt-3 flex flex-col gap-2.5 sm:flex-row md:mt-4"
                  >
                    {activeSlide.primaryCta ? (
                      <Link
                        href={activeSlide.primaryCta.href}
                        className={
                          activeSlideIsKids
                            ? "kids-menu-font-heading inline-flex min-h-[64px] items-center justify-center rounded-[0.9rem] border border-transparent px-6 py-2.5 text-2xl leading-none shadow-[var(--shadow-card)] transition-all hover:-translate-y-px hover:shadow-[var(--shadow-lifted)] max-md:w-full"
                            : buttonVariants({
                                variant: "brandCta",
                                size: "hero",
                              })
                        }
                        style={
                          activeSlideIsKids
                            ? {
                                backgroundColor: activeSlideKidsColor,
                                color: "#111111",
                              }
                            : undefined
                        }
                      >
                        {activeSlide.primaryCta.label}
                      </Link>
                    ) : null}

                    {activeSlide.secondaryCta ? (
                      <Link
                        href={activeSlide.secondaryCta.href}
                        className="link-button link-button-on-dark min-h-[64px] px-6 py-2.5"
                      >
                        {activeSlide.secondaryCta.label}
                      </Link>
                    ) : null}
                  </motion.div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 md:mt-5">
            <div className="hidden items-center gap-3 sm:flex">
              <HeroArrow direction="previous" onClick={goToPrevious} />
              <HeroArrow direction="next" onClick={goToNext} />
            </div>

            <div className="ml-auto sm:ml-0">
              <HeroDots
                slides={safeSlides}
                activeIndex={activeIndex}
                onSelect={goToIndex}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
