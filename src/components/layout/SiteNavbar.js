"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";

function normalizePathname(pathname) {
  if (!pathname) {
    return "/";
  }

  const withoutQuery = pathname.split("?")[0].split("#")[0];
  const trimmed = withoutQuery.replace(/\/+$/, "");

  return trimmed || "/";
}

function isCurrentRoute(pathname, href) {
  const normalizedPathname = normalizePathname(pathname);

  if (href === "/") {
    return normalizedPathname === "/";
  }

  return normalizedPathname.startsWith(href);
}

function isLightStartRoute(pathname) {
  const normalizedPathname = normalizePathname(pathname);
  return (
    normalizedPathname === "/" || normalizedPathname.startsWith("/locations")
  );
}

function BurgerButton({ open, onClick, tone }) {
  const lightTone = tone === "light";

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      className={`flex h-14 w-14 items-center justify-center rounded-[1rem] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent min-[1080px]:hidden ${
        lightTone
          ? "border-white/15 bg-white/6 hover:bg-white/12"
          : "border-[color:rgba(var(--color-primary-rgb),0.16)] bg-[color:rgba(var(--color-surface-rgb),0.8)] hover:bg-[color:rgba(var(--color-surface-rgb),0.94)]"
      }`}
      onClick={onClick}
    >
      <span className="relative block h-6 w-7">
        <span
          className={`absolute left-0 top-1 block h-0.5 w-7 origin-center rounded-full transition-all duration-300 ${
            lightTone ? "bg-white" : "bg-[color:var(--color-primary)]"
          } ${open ? "translate-y-2 rotate-[35deg] w-3.5" : ""}`}
        />
        <span
          className={`absolute left-0 top-3 block h-0.5 w-7 origin-center rounded-full transition-all duration-300 ${
            lightTone ? "bg-white" : "bg-[color:var(--color-primary)]"
          } ${open ? "-rotate-[35deg] w-3.5" : ""}`}
        />
        <span
          className={`absolute right-0 top-5 block h-0.5 w-7 origin-center rounded-full transition-all duration-300 ${
            lightTone ? "bg-white" : "bg-[color:var(--color-primary)]"
          } ${open ? "-translate-y-2 -rotate-[35deg] w-3.5" : ""}`}
        />
      </span>
    </button>
  );
}

export default function SiteNavbar({ navItems, initialPathname = "/" }) {
  const rawPathname = usePathname();
  const resolvedPathname = normalizePathname(rawPathname || initialPathname);
  const headerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lightStart = isLightStartRoute(resolvedPathname);
  const activeTone = scrolled || open || lightStart ? "light" : "dark";
  const isLightTone = activeTone === "light";
  const standardNavItems = navItems.filter(
    (item) => item.href !== "/book-a-table",
  );

  useEffect(() => {
    const updateScrolledState = () => {
      setScrolled(window.scrollY > 8);
    };

    updateScrolledState();
    window.addEventListener("scroll", updateScrolledState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrolledState);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-[var(--site-banner-offset,0px)] z-50"
    >
      <motion.div
        animate={{ y: scrolled ? 0 : -1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <motion.div
          aria-hidden="true"
          animate={{
            opacity: scrolled || open ? 1 : 0,
            backdropFilter: scrolled || open ? "blur(18px)" : "blur(0px)",
            WebkitBackdropFilter: scrolled || open ? "blur(18px)" : "blur(0px)",
            boxShadow:
              scrolled || open
                ? "var(--shadow-lifted)"
                : "0 0 0 rgba(41,84,31,0)",
            borderColor:
              scrolled || open
                ? "rgba(255,249,249,0.1)"
                : "rgba(255,249,249,0)",
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 border-b bg-[color:var(--color-glass-dark)]"
        />

        <div className="site-container relative z-10 flex min-h-24 items-center justify-between gap-1.5 px-2 lg:gap-2">
          <Link
            href="/"
            className="min-w-0 max-w-[16rem] flex-1 text-left transition-colors hover:text-[color:var(--color-gold)] min-[575px]:max-w-none min-[575px]:whitespace-nowrap min-[1080px]:flex-none min-[1080px]:max-w-[10.5rem] min-[1080px]:whitespace-normal min-[1360px]:max-w-none min-[1360px]:whitespace-nowrap"
          >
            <motion.span
              animate={{
                color: isLightTone
                  ? "var(--color-surface)"
                  : "var(--color-primary)",
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="block w-fit font-heading text-[0.92rem] leading-[1.02] font-semibold tracking-[0.02em] min-[575px]:whitespace-nowrap min-[1080px]:whitespace-normal min-[1360px]:whitespace-nowrap"
            >
              Barton Investors Group
            </motion.span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center gap-3 min-[1080px]:flex xl:gap-4">
            <nav className="flex min-w-0 flex-1 items-center justify-center gap-3 px-2 xl:gap-4 xl:px-3">
              {standardNavItems.map((item) => {
                const current = isCurrentRoute(resolvedPathname, item.href);
                const isExternal = item.href.startsWith("http");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className={`nav-link ${current ? "nav-link-active" : ""} ${
                      isLightTone ? "nav-link-light" : "nav-link-dark"
                    } px-1 text-center text-[0.78rem] tracking-[0.03em]`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href="/book-a-table"
              className={buttonVariants({
                variant: "brandCta",
                size: "nav",
                className: "ml-auto shrink-0 text-center",
              })}
              onClick={() => setOpen(false)}
            >
              Book a Table
            </Link>
          </div>

          <BurgerButton
            open={open}
            tone={activeTone}
            onClick={() => setOpen((value) => !value)}
          />
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 overflow-hidden border-t border-white/10 min-[1080px]:hidden"
            >
              <nav className="site-container flex flex-col gap-2 px-2 py-4">
                {navItems.map((item) => {
                  const current = isCurrentRoute(resolvedPathname, item.href);
                  const isBookingLink = item.href === "/book-a-table";
                  const isExternal = item.href.startsWith("http");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className={`mobile-nav-link ${
                        current ? "mobile-nav-link-active" : ""
                      } ${isBookingLink ? "mobile-nav-link-cta" : ""}`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}
