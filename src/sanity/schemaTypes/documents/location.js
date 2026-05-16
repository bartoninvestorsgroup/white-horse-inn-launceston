import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "location",
  title: "Location",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Location Name",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(220),
    }),
    defineField({
      name: "featurePills",
      title: "Feature Pills",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Short highlights such as Wood-fired grill, Dog friendly, Sunday lunch.",
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "openTableId",
      title: "OpenTable ID",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "telephone",
      title: "Telephone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "website",
      title: "Website URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "googleMapsUrl",
      title: "Google Maps URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "googleReviewsUrl",
      title: "Google Reviews URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "googleRating",
      title: "Google Average Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "googleReviewCount",
      title: "Google Review Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "tripadvisorReviewsUrl",
      title: "Tripadvisor Reviews URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tripadvisorRating",
      title: "Tripadvisor Average Rating",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "tripadvisorReviewCount",
      title: "Tripadvisor Review Count",
      type: "number",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      name: "openingTimes",
      title: "Opening Times",
      type: "array",
      of: [defineArrayMember({ type: "openingTime" })],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
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
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      initialValue: 100,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "address",
      media: "heroImage",
    },
  },
});
