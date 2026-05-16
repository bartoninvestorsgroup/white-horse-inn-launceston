import { defineField, defineType } from "sanity";

export default defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "object",
  fields: [
    defineField({
      name: "facebook",
      title: "Facebook URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "instagram",
      title: "Instagram URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "tiktok",
      title: "TikTok URL",
      type: "url",
      validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }),
    }),
  ],
});
