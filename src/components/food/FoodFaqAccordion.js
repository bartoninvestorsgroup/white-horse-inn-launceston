"use client";

import Link from "next/link";
import { useState } from "react";

const dietaryBadges = {
  V: "Vegetarian",
  VO: "Vegetarian option",
  VE: "Vegan",
  VEO: "Vegan option",
  GF: "Gluten free",
  GFO: "Gluten free option",
};

function InlineDietaryBadge({ label }) {
  return (
    <span
      title={dietaryBadges[label]}
      className="mx-1 inline-flex min-h-5 min-w-5 translate-y-[-0.08em] items-center justify-center rounded-full border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] px-1.5 text-[0.55rem] font-extrabold leading-none text-[color:var(--color-gold)]"
    >
      {label}
    </span>
  );
}

function isSafeHref(href) {
  return (
    href.startsWith("/") ||
    href.startsWith("#") ||
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function renderInlineAnswer(text) {
  const parts = String(text || "").split(
    /(\[[^\]]+\]\([^)]+\)|\((?:VEO|GFO|VO|VE|GF|V)\))/g,
  );

  return parts.map((part, index) => {
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

    if (linkMatch) {
      const [, label, rawHref] = linkMatch;
      const href = rawHref.trim();

      if (!isSafeHref(href)) {
        return label;
      }

      const external = href.startsWith("http://") || href.startsWith("https://");
      const className =
        "font-bold text-[color:var(--color-primary)] underline decoration-[color:var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--color-gold)]";

      if (href.startsWith("/")) {
        return (
          <Link key={`${href}-${index}`} href={href} className={className}>
            {label}
          </Link>
        );
      }

      return (
        <a
          key={`${href}-${index}`}
          href={href}
          className={className}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {label}
        </a>
      );
    }

    const token = part.match(/^\((VEO|GFO|VO|VE|GF|V)\)$/)?.[1];

    if (token) {
      return <InlineDietaryBadge key={`${token}-${index}`} label={token} />;
    }

    return part;
  });
}

export default function FoodFaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="mx-auto mt-8 max-w-4xl divide-y divide-[color:var(--color-border-soft)] border-y border-[color:var(--color-border-soft)]">
      {faqs.map((faq, index) => {
        const open = openIndex === index;

        return (
          <div key={faq.question}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`food-faq-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-heading text-2xl leading-tight text-[color:var(--color-primary)]">
                {faq.question}
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-2xl font-extrabold text-[color:var(--color-gold)]"
              >
                {open ? "-" : "+"}
              </span>
            </button>
            <div
              id={`food-faq-${index}`}
              hidden={!open}
              className="pb-5 text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg"
            >
              {renderInlineAnswer(faq.answer)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
