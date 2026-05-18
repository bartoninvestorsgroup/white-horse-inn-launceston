"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function isSafeHref(href) {
  return href.startsWith("/") || href.startsWith("#");
}

function renderTextWithLinks(text, keyPrefix) {
  const parts = String(text || "").split(/(\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (!match) {
      return part;
    }

    const [, label, rawHref] = match;
    const href = rawHref.trim();

    if (!isSafeHref(href)) {
      return label;
    }

    return (
      <Link
        key={`${keyPrefix}-${href}-${index}`}
        href={href}
        className="font-bold text-[color:var(--color-gold)] underline decoration-[color:var(--color-gold)]/65 decoration-2 underline-offset-4 transition-colors hover:text-white"
      >
        {label}
      </Link>
    );
  });
}

function CardBody({ body }) {
  const paragraphs = String(body || "").split(/\n{2,}/).filter(Boolean);

  return (
    <div className="mt-4 space-y-4 text-base leading-8 text-white/86 md:mt-5 md:text-lg">
      {paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`about-card-paragraph-${paragraphIndex}`}>
          {paragraph.split(/\n/).map((line, lineIndex) => (
            <span key={`about-card-line-${paragraphIndex}-${lineIndex}`}>
              {lineIndex > 0 ? <br /> : null}
              {renderTextWithLinks(
                line,
                `about-card-${paragraphIndex}-${lineIndex}`,
              )}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export default function HomeAboutStory({
  cards,
  eyebrow = "About The White Horse Inn",
  title = "A family-run passion for local hospitality, honest food, and quality ingredients.",
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full">
      <section className="pt-28 md:pt-34">
        <motion.div
          initial={false}
          whileInView={shouldReduceMotion ? {} : "show"}
          viewport={{ once: true, amount: 0.3 }}
          variants={cardVariants}
          className="max-w-3xl"
        >
          <motion.p
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="eyebrow text-[color:var(--color-gold-soft)]"
          >
            {eyebrow}
          </motion.p>
          <motion.h2
            variants={shouldReduceMotion ? undefined : itemVariants}
            className="mt-4 font-heading text-4xl leading-tight text-white md:text-6xl"
          >
            {title}
          </motion.h2>
        </motion.div>
      </section>

      <div className="mt-12 space-y-6 pb-8 md:mt-16 md:space-y-10">
        {cards.map((card, index) => (
          <div key={card.title}>
            <motion.article
              initial={false}
              whileInView={shouldReduceMotion ? {} : "show"}
              viewport={{ once: true, amount: 0.28 }}
              variants={cardVariants}
              transition={
                shouldReduceMotion ? undefined : { delay: index * 0.08 }
              }
              className={[
                "border border-[color:var(--color-gold)]/40 bg-[color:var(--color-primary)]/82 p-6 shadow-[var(--shadow-panel)] backdrop-blur-md md:w-[75%] md:p-10",
                card.alignment === "right"
                  ? "ml-auto"
                  : "mr-auto",
              ].join(" ")}
            >
              <motion.h3
                variants={shouldReduceMotion ? undefined : itemVariants}
                className="font-heading text-2xl leading-tight text-[color:var(--color-gold)] md:text-4xl"
              >
                {card.title}
              </motion.h3>
              <motion.div
                variants={shouldReduceMotion ? undefined : itemVariants}
              >
                <CardBody body={card.body} />
              </motion.div>
            </motion.article>
          </div>
        ))}
      </div>
    </div>
  );
}
