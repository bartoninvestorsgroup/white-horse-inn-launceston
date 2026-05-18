"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function WhiteHorseSectionBackdrop({
  children,
  className = "",
  contentClassName = "",
  text = "The White Horse",
}) {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { amount: 0 });
  const [clipPath, setClipPath] = useState(
    "inset(100% 0px 0px 0px)",
  );

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    let animationFrameId;

    function updateClipPath() {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const top = Math.max(0, rect.top);
      const bottom = Math.max(0, viewportHeight - Math.min(viewportHeight, rect.bottom));

      setClipPath(`inset(${top}px 0px ${bottom}px 0px)`);
    }

    function requestUpdate() {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = window.requestAnimationFrame(updateClipPath);
    }

    updateClipPath();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }

      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`relative z-20 overflow-hidden bg-[color:var(--color-surface)] ${className}`}
    >
      <motion.div
        aria-hidden="true"
        style={{ clipPath, opacity: sectionInView ? 1 : 0 }}
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 flex h-[100dvh] items-end overflow-hidden pb-5 md:pb-8"
      >
        <span
          className="block select-none overflow-hidden whitespace-nowrap font-heading text-[9.25vw] leading-none text-[rgba(var(--color-primary-rgb),0.07)] uppercase md:text-[12.5svh]"
          style={{
            paddingLeft: "20px",
            WebkitTextStroke: "1px rgba(var(--color-primary-rgb),0.16)",
          }}
        >
          {text}
        </span>
      </motion.div>

      <div className={`relative z-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}
