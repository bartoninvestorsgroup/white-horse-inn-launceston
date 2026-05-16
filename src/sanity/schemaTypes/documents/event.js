import { defineField, defineType } from "sanity";
import locations from "@/data/locations.json";

const locationOptions = locations.map((location) => ({
  title: location.title,
  value: location.title,
}));

function validateEventLink(value) {
  if (!value) {
    return true;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return true;
  }

  return "Use an internal path or a full URL.";
}

export default defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: "body",
      title: "Details",
      type: "portableText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startAt",
      title: "Start",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endAt",
      title: "End",
      type: "datetime",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const startAt = context.document?.startAt;

          if (!value || !startAt) {
            return true;
          }

          return new Date(value) >= new Date(startAt)
            ? true
            : "End must be after the start date.";
        }),
    }),
    defineField({
      name: "status",
      title: "Editorial Status",
      type: "string",
      initialValue: "upcoming",
      options: {
        list: [
          { title: "Current", value: "current" },
          { title: "Upcoming", value: "upcoming" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceLabel",
      title: "Price",
      type: "string",
      description: "Examples: Free, £12.50, Tickets from £25.",
    }),
    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "string",
      description: "Use an internal path or a full URL.",
      validation: (Rule) => Rule.custom(validateEventLink),
    }),
    defineField({
      name: "locations",
      title: "Locations",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: locationOptions,
        layout: "grid",
      },
      validation: (Rule) => Rule.min(1).required(),
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
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      startAt: "startAt",
      media: "image",
      locationTitles: "locations",
      legacyLocationTitle: "location",
    },
    prepare({ title, startAt, media, locationTitles, legacyLocationTitle }) {
      const date = startAt
        ? new Date(startAt).toLocaleDateString("en-GB")
        : "No date";
      const resolvedLocationTitle = Array.isArray(locationTitles)
        ? locationTitles.join(", ")
        : legacyLocationTitle;

      return {
        title,
        subtitle: resolvedLocationTitle
          ? `${date} • ${resolvedLocationTitle}`
          : date,
        media,
      };
    },
  },
});
