import { defineArrayMember, defineField, defineType } from "sanity";
import MenuSectionTitleInput from "@/sanity/components/MenuSectionTitleInput";

const menuTypeOptions = [
  { title: "Our Menu", value: "ourMenu" },
  { title: "Lunch Menu", value: "lunchMenu" },
  { title: "Dinner Menu", value: "dinnerMenu" },
  { title: "Kids Menu", value: "kidsMenu" },
  { title: "Sunday Menu", value: "sundayMenu" },
  { title: "Desserts Menu", value: "dessertsMenu" },
  { title: "Drinks Menu", value: "drinksMenu" },
  { title: "Spring", value: "spring" },
  { title: "Summer", value: "summer" },
  { title: "Autumn", value: "autumn" },
  { title: "Winter", value: "winter" },
  { title: "Christmas", value: "christmas" },
  { title: "Specials", value: "specials" },
  { title: "All Year", value: "allYear" },
];

const dietaryOptions = [
  { title: "Yes", value: "yes" },
  { title: "Option", value: "option" },
  { title: "No", value: "no" },
];

const sectionTitleOptions = [
  { title: "Starters", value: "Starters" },
  { title: "Mains", value: "Mains" },
  { title: "Sandwiches", value: "Sandwiches" },
  { title: "Meals", value: "Meals" },
  { title: "Sunday Lunch", value: "Sunday Lunch" },
  { title: "Non-Roast Mains", value: "Non-Roast Mains" },
  { title: "Snacks", value: "Snacks" },
  { title: "Sides", value: "Sides" },
  { title: "Desserts", value: "Desserts" },
  { title: "Drinks", value: "Drinks" },
];

function optionTitle(options, value) {
  return options.find((option) => option.value === value)?.title || value;
}

export default defineType({
  name: "menu",
  title: "Menu",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Menu title",
      type: "string",
      description: "Examples: Summer Main Menu, Christmas Specials.",
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
      name: "menuType",
      title: "Menu type",
      type: "string",
      initialValue: "ourMenu",
      options: {
        list: menuTypeOptions,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showOnWebsite",
      title: "Show on website",
      type: "boolean",
      description:
        "When off, this menu will not appear in Food page buttons, tabs, or the hero carousel. Its route can still remain live.",
      initialValue: true,
    }),
    defineField({
      name: "listInSitemap",
      title: "List in sitemap",
      type: "boolean",
      description:
        "When on, this menu route is included in sitemap.xml even if it is not shown in the website navigation.",
      initialValue: true,
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 5,
      description:
        "Optional text shown above this menu. Supports line breaks and simple Markdown links, for example [kids menu](/food/kids-menu).",
    }),
    defineField({
      name: "sections",
      title: "Menu sections",
      type: "array",
      description:
        "Drag sections to change their order. Items inside each section can also be dragged into order.",
      of: [
        defineArrayMember({
          name: "menuSection",
          title: "Menu section",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Section type",
              type: "string",
              options: {
                list: sectionTitleOptions,
                layout: "radio",
              },
              components: {
                input: MenuSectionTitleInput,
              },
              validation: (Rule) =>
                Rule.required().max(80).custom((value, context) => {
                  if (value === "Meals" && context.document?.menuType !== "kidsMenu") {
                    return "Meals can only be used when the menu type is Kids Menu.";
                  }

                  if (
                    ["Sunday Lunch", "Non-Roast Mains"].includes(value) &&
                    context.document?.menuType !== "sundayMenu"
                  ) {
                    return `${value} can only be used when the menu type is Sunday Menu.`;
                  }

                  return true;
                }),
            }),
            defineField({
              name: "items",
              title: "Menu items",
              type: "array",
              of: [
                defineArrayMember({
                  name: "menuItem",
                  title: "Menu item",
                  type: "object",
                  fields: [
                    defineField({
                      name: "title",
                      title: "Title",
                      type: "string",
                      validation: (Rule) => Rule.required().max(120),
                    }),
                    defineField({
                      name: "description",
                      title: "Description",
                      type: "text",
                      rows: 3,
                    }),
                    defineField({
                      name: "price",
                      title: "Price",
                      type: "string",
                      description: "Examples: £8.95, £12, 2 for £15.",
                    }),
                    defineField({
                      name: "choices",
                      title: "Choices",
                      type: "array",
                      description:
                        "Use for related options under one item, such as ice cream scoop counts or sandwich fillings.",
                      of: [
                        defineArrayMember({
                          name: "menuItemChoice",
                          title: "Choice",
                          type: "object",
                          fields: [
                            defineField({
                              name: "label",
                              title: "Choice label",
                              type: "string",
                              validation: (Rule) => Rule.required().max(120),
                            }),
                            defineField({
                              name: "price",
                              title: "Price",
                              type: "string",
                              description: "Examples: £8.95, £12, 2 for £15.",
                            }),
                            defineField({
                              name: "show",
                              title: "Show on website",
                              type: "boolean",
                              initialValue: true,
                            }),
                            defineField({
                              name: "vegetarian",
                              title: "Vegetarian",
                              type: "string",
                              initialValue: "no",
                              options: {
                                list: dietaryOptions,
                                layout: "radio",
                              },
                              validation: (Rule) => Rule.required(),
                            }),
                            defineField({
                              name: "vegan",
                              title: "Vegan",
                              type: "string",
                              initialValue: "no",
                              options: {
                                list: dietaryOptions,
                                layout: "radio",
                              },
                              validation: (Rule) => Rule.required(),
                            }),
                            defineField({
                              name: "glutenFree",
                              title: "Gluten free",
                              type: "string",
                              initialValue: "no",
                              options: {
                                list: dietaryOptions,
                                layout: "radio",
                              },
                              validation: (Rule) => Rule.required(),
                            }),
                          ],
                          preview: {
                            select: {
                              title: "label",
                              price: "price",
                              show: "show",
                            },
                            prepare({ title, price, show }) {
                              return {
                                title,
                                subtitle: [price, show === false ? "Hidden" : null]
                                  .filter(Boolean)
                                  .join(" • "),
                              };
                            },
                          },
                        }),
                      ],
                    }),
                    defineField({
                      name: "show",
                      title: "Show on website",
                      type: "boolean",
                      initialValue: true,
                    }),
                    defineField({
                      name: "vegetarian",
                      title: "Vegetarian",
                      type: "string",
                      initialValue: "no",
                      options: {
                        list: dietaryOptions,
                        layout: "radio",
                      },
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "vegan",
                      title: "Vegan",
                      type: "string",
                      initialValue: "no",
                      options: {
                        list: dietaryOptions,
                        layout: "radio",
                      },
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: "glutenFree",
                      title: "Gluten free",
                      type: "string",
                      initialValue: "no",
                      options: {
                        list: dietaryOptions,
                        layout: "radio",
                      },
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "title",
                      price: "price",
                      show: "show",
                    },
                    prepare({ title, price, show }) {
                      return {
                        title,
                        subtitle: [price, show === false ? "Hidden" : null]
                          .filter(Boolean)
                          .join(" • "),
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              items: "items",
            },
            prepare({ title, items }) {
              const count = Array.isArray(items) ? items.length : 0;

              return {
                title,
                subtitle: `${count} item${count === 1 ? "" : "s"}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.min(1).required(),
    }),
  ],
  orderings: [
    {
      title: "Title",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
    {
      title: "Menu type",
      name: "menuTypeAsc",
      by: [
        { field: "menuType", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "title",
      menuType: "menuType",
    },
    prepare({ title, menuType }) {
      return {
        title,
        subtitle: optionTitle(menuTypeOptions, menuType),
      };
    },
  },
});
