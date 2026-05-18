import Link from "next/link";
import SectionReveal from "@/components/layout/SectionReveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <section className="relative z-20 min-h-[70svh] bg-[color:var(--color-surface)]">
      <SectionReveal className="site-container flex min-h-[70svh] flex-col items-center justify-center px-2 py-20 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl">
          This page can&apos;t be found.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--color-copy-soft)]">
          The link may be outdated or the page may have moved. Use one of the
          routes below to continue.
        </p>

        <div className="mt-10 flex w-full max-w-3xl flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className={buttonVariants({ variant: "brandCta", size: "hero" })}
          >
            Back to Home
          </Link>
          <Link
            href="/food/menu"
            className={cn(buttonVariants({ variant: "outline", size: "hero" }), "link-button")}
          >
            View Menus
          </Link>
          <Link
            href="/find-us"
            className={cn(buttonVariants({ variant: "outline", size: "hero" }), "link-button")}
          >
            Find Us
          </Link>
        </div>
      </SectionReveal>
    </section>
  );
}
