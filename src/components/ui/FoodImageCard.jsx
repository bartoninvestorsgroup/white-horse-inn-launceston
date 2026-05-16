"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
};

const innerBorderToneClasses = {
  gold: "border-[color:var(--color-gold)]",
  soft: "border-[color:var(--color-gold-soft)]",
};

const imageSizes = {
  portrait: "(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw",
  landscape: "(max-width: 767px) 100vw, (max-width: 1279px) 100vw, 50vw",
};

const contentVariants = {
  rest: { opacity: 0, y: 20 },
  hover: { opacity: 1, y: 0 },
};

export default function FoodImageCard({
  src,
  alt,
  title,
  description,
  eyebrow,
  size = "portrait",
  fluidHeight = false,
  blurFrame = false,
  innerBorderTone = "gold",
  frameInset = 20,
  href,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ariaLabel,
  className,
  priority = false,
}) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.62 });
  const [canHover, setCanHover] = useState(false);
  const [delayedInView, setDelayedInView] = useState(false);
  const resolvedSizeClass = sizeClasses[size] || sizeClasses.portrait;
  const resolvedInnerBorderToneClass =
    innerBorderToneClasses[innerBorderTone] || innerBorderToneClasses.soft;
  const resolvedImageSizes = imageSizes[size] || imageSizes.portrait;
  const actualInset = blurFrame ? frameInset : 0;
  const insetStyle = { inset: `${actualInset}px` };
  const frameBandStyle = { "--frame-inset": `${frameInset}px` };
  const mobileReveal = !canHover && delayedInView;

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
      }, 220);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [canHover, isInView]);
  const content = (
    <>
      {fluidHeight ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="block w-full h-auto opacity-0 pointer-events-none select-none"
        />
      ) : null}

      <div className="absolute inset-0">
        <motion.div
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          variants={{
            rest: { scale: 1, x: 0, y: 0 },
            hover: { scale: 1.1, x: -10, y: -5 },
          }}
          className="absolute inset-0 overflow-hidden"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={resolvedImageSizes}
            className="object-cover object-center"
          />
        </motion.div>
      </div>

      {blurFrame ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={frameBandStyle}
        >
          <div
            className="absolute inset-0 bg-white/[0.03] backdrop-blur-md"
            style={{
              clipPath:
                "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, var(--frame-inset) var(--frame-inset), var(--frame-inset) calc(100% - var(--frame-inset)), calc(100% - var(--frame-inset)) calc(100% - var(--frame-inset)), calc(100% - var(--frame-inset)) var(--frame-inset), var(--frame-inset) var(--frame-inset))",
            }}
          />
        </div>
      ) : null}

      {/* Rim Light - Subtle inner highlight */}
      {blurFrame && (
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{ padding: `${frameInset}px` }}
        >
          <div className="h-full w-full border border-white/20" />
        </div>
      )}

      <motion.div
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        variants={{
          rest: { opacity: 0.58 },
          hover: { opacity: 1 },
        }}
        className={cn(
          "pointer-events-none absolute border",
          resolvedInnerBorderToneClass,
        )}
        style={insetStyle}
      />

      <motion.div
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        variants={{
          rest: { opacity: 1 },
          hover: { opacity: 1 },
        }}
        className="absolute inset-0"
      >
        <motion.div
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          variants={{
            rest: { opacity: 0.32 },
            hover: { opacity: 1 },
          }}
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0)_0%,rgba(var(--color-primary-rgb),0.18)_32%,rgba(var(--color-primary-rgb),0.58)_72%,rgba(var(--color-primary-rgb),0.92)_100%)]"
        />
      </motion.div>

      <motion.div
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        variants={{
          rest: { opacity: 0 },
          hover: { opacity: 0.14 },
        }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(var(--color-surface-rgb),0.24)_0%,rgba(var(--color-surface-rgb),0)_34%,rgba(var(--color-surface-rgb),0)_100%)]"
      />

      <div className="relative z-10 flex h-full items-end p-8">
        <div className="w-full max-w-[26rem] space-y-3">
          {title ? (
            <motion.h3
              variants={contentVariants}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.05,
              }}
              className="font-heading text-[2rem] leading-[1.04] text-[color:var(--color-gold)]"
            >
              {title}
            </motion.h3>
          ) : null}

          {description ? (
            <motion.p
              variants={contentVariants}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.11,
              }}
              className="max-w-[22rem] text-base leading-7 text-white"
            >
              {description}
            </motion.p>
          ) : null}

          {eyebrow ? (
            <motion.p
              variants={contentVariants}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
                delay: 0.17,
              }}
              className="font-sans text-xs font-bold tracking-[0.16em] uppercase text-[color:var(--color-gold-soft)]"
            >
              {eyebrow}
            </motion.p>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <motion.div
      ref={cardRef}
      initial="rest"
      whileHover={canHover ? "hover" : undefined}
      animate={canHover ? "rest" : mobileReveal ? "hover" : "rest"}
      onClick={onClick}
      onKeyDown={onKeyDown}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      className={cn(
        "group relative w-full overflow-hidden border border-[color:var(--color-primary)] bg-[color:var(--color-primary)]",
        onClick ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-primary)]" : "",
        fluidHeight ? "" : resolvedSizeClass,
        className,
      )}
    >
      {href ? (
        <Link
          href={href}
          className="absolute inset-0 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-primary)]"
        >
          <span className="sr-only">{title}</span>
        </Link>
      ) : null}
      {content}
    </motion.div>
  );
}
