import foodFaqs from "@/data/food-faqs.json";

export function getFoodFaqs(slug) {
  const sharedFaqs = Array.isArray(foodFaqs.shared) ? foodFaqs.shared : [];
  const menuFaqs = slug && Array.isArray(foodFaqs.menus?.[slug])
    ? foodFaqs.menus[slug]
    : [];

  return [...sharedFaqs, ...menuFaqs].filter(
    (faq) => faq?.question && faq?.answer,
  );
}
