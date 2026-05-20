import faqs from "@/data/faqs.json";

export function getFoodFaqs(slug) {
  const foodFaqs = faqs.food || {};
  const sharedFaqs = Array.isArray(foodFaqs.shared) ? foodFaqs.shared : [];
  const menuFaqs = slug && Array.isArray(foodFaqs.menu?.[slug])
    ? foodFaqs.menu[slug]
    : [];

  return [...sharedFaqs, ...menuFaqs].filter(
    (faq) => faq?.question && faq?.answer,
  );
}
