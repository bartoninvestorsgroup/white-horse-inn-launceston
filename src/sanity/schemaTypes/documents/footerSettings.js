import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "footerSettings",
  title: "Footer Settings",
  type: "document",
  fields: [
    defineField({
      name: "footerLinks",
      title: "Footer Links",
      type: "array",
      of: [defineArrayMember({ type: "footerLink" })],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      name: "legalNotice",
      title: "Legal Notice",
      type: "string",
      description: "Example: © 2026 All rights reserved.",
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Footer Settings",
      };
    },
  },
});
