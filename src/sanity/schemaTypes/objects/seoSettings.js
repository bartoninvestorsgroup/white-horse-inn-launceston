import { defineField, defineType } from "sanity";

export default defineType({
  name: "seoSettings",
  title: "SEO Settings",
  type: "object",
  fields: [
    defineField({
      name: "defaultTitle",
      title: "Default Title",
      type: "string",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "defaultDescription",
      title: "Default Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default Open Graph Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
    }),
  ],
});
