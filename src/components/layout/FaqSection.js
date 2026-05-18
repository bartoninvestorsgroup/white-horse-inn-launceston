import FoodFaqAccordion from "@/components/food/FoodFaqAccordion";
import StructuredData from "@/components/seo/StructuredData";
import { faqPageSchema } from "@/lib/seo";

export default function FaqSection({
  faqs = [],
  eyebrow = "FAQs",
  title = "Helpful answers before you visit.",
}) {
  if (!faqs.length) {
    return null;
  }

  return (
    <section className="relative z-20 bg-[color:var(--color-surface)] pb-16 md:pb-24">
      <StructuredData data={faqPageSchema(faqs)} />
      <div className="site-container px-2">
        <div className="text-center">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
            {title}
          </h2>
        </div>
        <FoodFaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}
