import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "pageHero",
  title: "Page Hero",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Admin Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "heroKey",
      title: "Hero Key",
      type: "string",
      description:
        "Use a stable key such as home, locations, gallery, or whats-on.",
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: "slides",
      title: "Slides",
      type: "array",
      of: [defineArrayMember({ type: "heroSlide" })],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "heroKey",
    },
  },
});
