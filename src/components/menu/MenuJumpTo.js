"use client";

import { useEffect, useRef } from "react";

const kidsSectionColors = {
  meals: "#FFAADB",
  snacks: "#F1C816",
  drinks: "#F08D2B",
};

function buildMenuSectionAnchorId(menuTitle, sectionTitle) {
  return `section-${slugifyFilenamePart(menuTitle)}-${slugifyFilenamePart(sectionTitle)}`;
}

function slugifyFilenamePart(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function PaintBlobLabel({
  children,
  color = "var(--color-primary)",
  className = "",
  textClassName = "",
}) {
  return (
    <span className={`relative inline-grid place-items-center px-8 py-4 ${className}`}>
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

function KidsSectionHeading({ title }) {
  const color =
    kidsSectionColors[String(title || "").trim().toLowerCase()] ||
    "var(--color-primary)";
  const textColor = color.startsWith("#") ? "#111111" : "var(--color-gold)";

  return (
    <PaintBlobLabel
      color={color}
      className="min-h-[4.8rem] min-w-[12rem] px-7 py-3"
      textClassName="kids-menu-font-heading text-4xl leading-none md:text-5xl"
    >
      <span style={{ color: textColor }}>{title}</span>
    </PaintBlobLabel>
  );
}

export default function MenuJumpTo({ menuTitle, sections, isKidsMenu = false }) {
  const detailsRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!detailsRef.current?.open) {
        return;
      }

      if (!detailsRef.current.contains(event.target)) {
        detailsRef.current.open = false;
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  if (!sections.length) {
    return null;
  }

  function handleJump(event, sectionTitle) {
    event.preventDefault();

    detailsRef.current.open = false;

    const section = document.getElementById(
      buildMenuSectionAnchorId(menuTitle, sectionTitle),
    );

    if (!section) {
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", `#${section.id}`);
  }

  return (
    <details
      ref={detailsRef}
      className={`mx-auto mt-6 max-w-md rounded-[0.9rem] border border-[color:var(--color-border-soft)] bg-[color:var(--muted)] text-left ${
        isKidsMenu ? "kids-menu-font-body" : ""
      }`}
    >
      <summary
        className={`flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-extrabold text-[color:var(--color-primary)] marker:hidden [&::-webkit-details-marker]:hidden ${
          isKidsMenu ? "text-lg" : "uppercase tracking-[0.12em]"
        }`}
      >
        <span>Jump To</span>
        <span aria-hidden="true" className="text-lg leading-none text-[color:var(--color-gold)]">
          +
        </span>
      </summary>
      <nav className="border-t border-[color:var(--color-border-soft)] px-4 py-3">
        <div className={`flex flex-wrap justify-center ${isKidsMenu ? "gap-1" : "gap-2"}`}>
          {sections.map((section) =>
            isKidsMenu ? (
              <a
                key={section._key}
                href={`#${buildMenuSectionAnchorId(menuTitle, section.title)}`}
                onClick={(event) => handleJump(event, section.title)}
                className="inline-flex transition-transform hover:-translate-y-0.5"
              >
                <KidsSectionHeading title={section.title} />
              </a>
            ) : (
              <a
                key={section._key}
                href={`#${buildMenuSectionAnchorId(menuTitle, section.title)}`}
                onClick={(event) => handleJump(event, section.title)}
                className="inline-flex min-h-9 items-center rounded-[0.75rem] border border-[color:var(--color-primary)] bg-[color:var(--color-primary)] px-3 py-1.5 text-sm font-bold text-[color:var(--color-gold)] transition-colors hover:bg-[color:rgba(var(--color-primary-rgb),0.86)]"
                style={{ color: "var(--color-gold)" }}
              >
                {section.title}
              </a>
            ),
          )}
        </div>
      </nav>
    </details>
  );
}
