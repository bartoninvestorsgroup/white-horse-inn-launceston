import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import FaqSection from "@/components/layout/FaqSection";
import FoodImageCard from "@/components/ui/FoodImageCard";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { breadcrumbSchema } from "@/lib/seo";
import { getPageSchema } from "@/lib/seo-config";

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
        className="font-extrabold text-[color:var(--color-primary)] underline decoration-[color:var(--color-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--color-gold-soft)]"
      >
        {label}
      </Link>
    );
  });
}

function EditorialSection({ section, index }) {
  return (
    <article className="grid gap-5 border-t border-[color:var(--color-border-soft)] pt-7 md:grid-cols-[6rem_1fr] md:gap-8">
      <p className="font-heading text-4xl leading-none text-[color:var(--color-gold-soft)] md:text-5xl">
        {String(index + 1).padStart(2, "0")}
      </p>
      <div>
        <h2 className="font-heading text-3xl leading-tight text-[color:var(--color-primary)] md:text-4xl">
          {section.title}
        </h2>
        <p className="mt-4 text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg">
          {renderTextWithLinks(section.body, `placeholder-section-${index}`)}
        </p>
      </div>
    </article>
  );
}

function ServicePanel({ page, className = "" }) {
  return (
    <aside className={`lg:sticky lg:top-28 lg:self-start ${className}`}>
      <div className="space-y-6">
        <div className="border border-[color:var(--color-gold)]/45 bg-[color:var(--color-primary)] p-6 text-white shadow-[var(--shadow-panel)] md:p-8">
          <p className="eyebrow text-[color:var(--color-gold)]">At a Glance</p>
          <div className="mt-6 space-y-4">
            {page.highlights.map((highlight) => (
              <div key={highlight} className="flex gap-3">
                <span className="mt-1 flex size-5 shrink-0 items-center justify-center border border-[color:var(--color-gold)] text-[color:var(--color-gold)]">
                  <Check className="size-3.5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-6 text-white/86 md:text-base">
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            <Link
              href={page.primaryCta.href}
              className="cta-button min-h-14 w-full gap-2 px-5"
            >
              <span>{page.primaryCta.label}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={page.secondaryCta.href}
              className="link-button link-button-on-dark min-h-14 w-full"
            >
              {page.secondaryCta.label}
            </Link>
          </div>

          <p className="mt-6 border-t border-white/16 pt-5 text-xs leading-6 text-white/58">
            {page.note}
          </p>
        </div>

        <FoodImageCard
          {...page.imageCard}
          size="landscape"
          innerBorderTone="gold"
          blurFrame
          className="min-h-[300px]"
        />
      </div>
    </aside>
  );
}

export default function PremiumPlaceholderPage({ page }) {
  const pageSchema = getPageSchema(page.seoKey);
  const schema = [
    pageSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: page.title, path: pageSchema.url },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <PageIntro
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
      />

      <section className="no-snap-zone relative z-20 overflow-hidden bg-[color:var(--color-surface)] py-16 md:py-24">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(var(--color-primary-rgb),0.07),rgba(var(--color-primary-rgb),0))]" />
        <SectionReveal className="site-container px-2">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_27rem]">
            <div className="space-y-10">
              <div className="max-w-4xl">
                <p className="eyebrow">The White Horse Inn</p>
                <h2 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-6xl">
                  {page.detailHeading}
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-[color:var(--color-copy-soft)] md:text-xl md:leading-9">
                  {page.intro}
                </p>
              </div>

              <ServicePanel page={page} className="lg:hidden" />

              <div className="space-y-9">
                {page.sections.map((section, index) => (
                  <EditorialSection
                    key={section.title}
                    section={section}
                    index={index}
                  />
                ))}
              </div>
            </div>

            <ServicePanel page={page} className="hidden lg:block" />
          </div>
        </SectionReveal>
      </section>

      <FaqSection
        faqs={page.faqs}
        eyebrow={`${page.eyebrow} FAQs`}
        title={`${page.eyebrow} questions answered.`}
      />
    </>
  );
}
