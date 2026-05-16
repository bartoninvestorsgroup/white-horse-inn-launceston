"use client";

import Image from "next/image";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

function FixedRevealMedia({
  src,
  alt,
  zoomRange = [1.02, 1.1],
  targetRef,
  opacity,
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [zoomRange[0], shouldReduceMotion ? zoomRange[0] : zoomRange[1]],
  );

  return (
    <motion.div
      style={{ scale, opacity }}
      className="absolute inset-0 will-change-transform"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover object-center"
      />
    </motion.div>
  );
}

export default function FixedRevealSection({
  src,
  alt,
  children,
  overlayClassName = "bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0.58)_0%,rgba(var(--color-primary-rgb),0.4)_16%,rgba(var(--color-primary-rgb),0.28)_34%,rgba(var(--color-primary-rgb),0.4)_100%)]",
  contentClassName = "",
  zoomRange,
}) {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { amount: 0 });

  return (
    <section ref={sectionRef} className="relative z-10">
      <motion.div
        style={{ opacity: sectionInView ? 1 : 0 }}
        className="pointer-events-none fixed inset-0 h-[100dvh] overflow-hidden"
      >
        <div className="absolute inset-0">
          <FixedRevealMedia
            src={src}
            alt={alt}
            zoomRange={zoomRange}
            targetRef={sectionRef}
            opacity={sectionInView ? 1 : 0}
          />
          <div className={`absolute inset-0 ${overlayClassName}`} />
        </div>
      </motion.div>

      <div className={`relative z-10 flex min-h-[100dvh] items-end ${contentClassName}`}>
        {children}
      </div>
    </section>
  );
}
