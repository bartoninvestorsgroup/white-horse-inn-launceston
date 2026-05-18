"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function normalizePath(pathname) {
  const normalized = pathname?.replace(/\/+$/, "");
  return normalized || "/";
}

export default function FoodTabs({ links = [] }) {
  const pathname = normalizePath(usePathname());

  if (!links.length) {
    return null;
  }

  return (
    <div className="border-b border-[color:var(--color-border-soft)] pb-8 text-center">
      <p className="font-heading text-3xl leading-tight text-[color:var(--color-primary)] md:text-4xl">
        Which menu would you like to see?
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {links.map((link) => {
          const current = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`inline-flex min-h-11 items-center rounded-[0.9rem] border px-4 py-2 text-sm font-bold transition-colors ${
                current
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold)] text-[color:var(--color-primary)]"
                  : "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-[color:var(--color-gold)] hover:bg-[color:rgba(var(--color-primary-rgb),0.86)]"
              }`}
              style={{
                color: current ? "var(--color-primary)" : "var(--color-gold)",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
