import faqs from "@/data/faqs.json";

const christmasMenuFaq = {
  question: "Do you do a Christmas menu?",
  answer:
    "Yes. The White Horse Inn has a dedicated [Festive Menu](/food/christmas-menu), with 2 courses for £25 or 3 courses for £30.",
};

export function getFoodFaqs(slug) {
  const foodFaqs = faqs.food || {};
  const sharedFaqs = Array.isArray(foodFaqs.shared) ? foodFaqs.shared : [];
  const menuFaqs = slug && Array.isArray(foodFaqs.menu?.[slug])
    ? foodFaqs.menu[slug]
    : [];
  const christmasPage = slug === "christmas-menu";

  if (christmasPage) {
    return [...menuFaqs, ...sharedFaqs].filter(
      (faq) => faq?.question && faq?.answer,
    );
  }

  return [...sharedFaqs, christmasMenuFaq, ...menuFaqs].filter(
    (faq) => faq?.question && faq?.answer,
  );
}
