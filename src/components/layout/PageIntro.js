import SectionReveal from "@/components/layout/SectionReveal";

export default function PageIntro({ eyebrow, title, description }) {
  return (
    <section className="relative z-20 border-b border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] py-28 md:py-32">
      <SectionReveal className="site-container px-2">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl font-heading text-5xl leading-[1.02] text-[color:var(--color-primary)] md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--color-copy-soft)]">
          {description}
        </p>
      </SectionReveal>
    </section>
  );
}
