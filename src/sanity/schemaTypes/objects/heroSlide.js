import { defineField, defineType } from "sanity";

export default defineType({
  name: "heroSlide",
  title: "Hero Slide",
  type: "object",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(180),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.max(320),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "primaryCtaLabel",
      title: "Primary CTA Label",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "primaryCtaUrl",
      title: "Primary CTA URL",
      type: "string",
      validation: (Rule) => Rule.max(300),
    }),
    defineField({
      name: "secondaryCtaLabel",
      title: "Secondary CTA Label",
      type: "string",
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: "secondaryCtaUrl",
      title: "Secondary CTA URL",
      type: "string",
      validation: (Rule) => Rule.max(300),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
      media: "image",
    },
  },
});
