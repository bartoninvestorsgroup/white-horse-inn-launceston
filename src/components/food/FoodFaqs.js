import FoodFaqAccordion from "@/components/food/FoodFaqAccordion";
import StructuredData from "@/components/seo/StructuredData";
import { faqPageSchema } from "@/lib/seo";

export default function FoodFaqs({ faqs = [] }) {
  if (!faqs.length) {
    return null;
  }

  return (
    <section className="pt-16 md:pt-20">
      <StructuredData data={faqPageSchema(faqs)} />
      <div className="text-center">
        <p className="eyebrow">Food FAQs</p>
        <h2 className="mt-3 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
          Helpful answers before you visit.
        </h2>
      </div>
      <FoodFaqAccordion faqs={faqs} />
    </section>
  );
}
