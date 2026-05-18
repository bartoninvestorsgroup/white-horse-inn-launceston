import { defineField, defineType } from "sanity";

function validateBannerLink(value) {
  if (!value) {
    return true;
  }

  if (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:") ||
    value.startsWith("tel:")
  ) {
    return true;
  }

  return "Use an internal path or a full URL.";
}

export default defineType({
  name: "siteBanner",
  title: "Site Banner",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
      description:
        "Optional. Use an internal path such as /food/menu or a full URL.",
      validation: (Rule) => Rule.custom(validateBannerLink),
    }),
    defineField({
      name: "startAt",
      title: "Start",
      type: "datetime",
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
  ],
  preview: {
    select: {
      title: "title",
      startAt: "startAt",
      endAt: "endAt",
    },
    prepare({ title, startAt, endAt }) {
      const parts = [];

      if (startAt) {
        parts.push(`Starts ${new Date(startAt).toLocaleDateString("en-GB")}`);
      }

      if (endAt) {
        parts.push(`Ends ${new Date(endAt).toLocaleDateString("en-GB")}`);
      }

      return {
        title,
        subtitle: parts.join(" • "),
      };
    },
  },
});
