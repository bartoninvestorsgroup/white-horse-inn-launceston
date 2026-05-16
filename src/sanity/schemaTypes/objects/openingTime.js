import { defineField, defineType } from "sanity";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default defineType({
  name: "openingTime",
  title: "Opening Time",
  type: "object",
  fields: [
    defineField({
      name: "day",
      title: "Day",
      type: "string",
      options: {
        list: days.map((day) => ({
          title: day,
          value: day,
        })),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isClosed",
      title: "Closed",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "openTime",
      title: "Open Time",
      type: "string",
      hidden: ({ parent }) => parent?.isClosed,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.isClosed) {
            return true;
          }

          return value ? true : "Open time is required unless closed.";
        }),
    }),
    defineField({
      name: "closeTime",
      title: "Close Time",
      type: "string",
      hidden: ({ parent }) => parent?.isClosed,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.isClosed) {
            return true;
          }

          return value ? true : "Close time is required unless closed.";
        }),
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "string",
      description: "Optional note such as Last orders 9:30pm.",
    }),
  ],
  preview: {
    select: {
      day: "day",
      isClosed: "isClosed",
      openTime: "openTime",
      closeTime: "closeTime",
    },
    prepare({ day, isClosed, openTime, closeTime }) {
      return {
        title: day,
        subtitle: isClosed ? "Closed" : `${openTime} - ${closeTime}`,
      };
    },
  },
});
