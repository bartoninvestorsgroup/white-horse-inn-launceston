import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "exports", "sanity-christmas-menu.csv");

const columns = [
  "_id",
  "menuTitle",
  "slug",
  "menuType",
  "showOnWebsite",
  "listInSitemap",
  "menuIntroduction",
  "sectionOrder",
  "sectionTitle",
  "sectionDescription",
  "itemOrder",
  "itemTitle",
  "description",
  "price",
  "show",
  "vegetarian",
  "vegan",
  "glutenFree",
];

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function dietaryFromNotes(notes = []) {
  const values = {
    vegetarian: "no",
    vegan: "no",
    glutenFree: "no",
  };

  for (const note of notes) {
    if (note === "V") values.vegetarian = "yes";
    if (note === "VO") values.vegetarian = "option";
    if (note === "VE") values.vegan = "yes";
    if (note === "VEO") values.vegan = "option";
    if (note === "GF") values.glutenFree = "yes";
    if (note === "GFO") values.glutenFree = "option";
  }

  return values;
}

function item(title, description = "", notes = []) {
  return {
    title,
    description,
    price: "",
    ...dietaryFromNotes(notes),
  };
}

const menu = {
  _id: "menu-christmas-menu",
  title: "Festive Menu",
  slug: "christmas-menu",
  menuType: "christmas",
  introduction:
    "2 Courses £25\n3 Courses £30\n\nPre-orders are required 1 week before the booked date. A deposit of £10 per head may be required at the White Horse's discretion for larger parties.\n\nFor bookings, contact 01566 788281 or email contact@whitehorseinnlaunceston.co.uk. We are also available to book through our website with OpenTable.\n\nInform your server of any allergies or intolerance. Not all ingredients are listed on the menu and we cannot guarantee the total absence of allergens. Detailed information on the fourteen legal allergens is available on request.",
  sections: [
    {
      title: "Starters",
      items: [
        item("Roasted Tomato & Basil Soup", "Bread Roll", ["VE"]),
        item("Mushroom & Tarragon Pate", "Served with Garlic & Herb Bruschetta", ["V"]),
        item("Ham Hock Terrine", "Spiced Apple Chutney, Toasted Sourdough"),
        item("Classic Prawn Cocktail"),
      ],
    },
    {
      title: "Mains",
      description:
        "All served with roast potatoes, pigs in blankets, Yorkshire pudding, seasonal vegetables and gravy.",
      items: [
        item("Seasoned Roast Turkey"),
        item("Crispy Stuffed Roast Belly of Pork"),
        item(
          "Pan Fried Sea Bass",
          "Crushed New Potatoes, Chargrilled Tender Stem, Romesco Sauce",
        ),
        item("Mushroom, Cranberry, Chestnut and Celeriac Vegetable Wellington Roast", "", ["V"]),
      ],
    },
    {
      title: "Desserts",
      items: [
        item("Traditional Brandy Christmas Pudding", "Clotted Cream"),
        item("Chocolate Torte", "Raspberry Coulis, with clotted cream or ice cream", ["VE"]),
        item("Spiced Apple and Cranberry Crumble", "Custard"),
        item("2 Scoops of a Selection of Ice Cream"),
      ],
    },
  ],
};

const rows = [];

menu.sections.forEach((section, sectionIndex) => {
  section.items.forEach((menuItem, itemIndex) => {
    rows.push({
      _id: menu._id,
      menuTitle: menu.title,
      slug: menu.slug,
      menuType: menu.menuType,
      showOnWebsite: "TRUE",
      listInSitemap: "TRUE",
      menuIntroduction: menu.introduction,
      sectionOrder: sectionIndex + 1,
      sectionTitle: section.title,
      sectionDescription: section.description || "",
      itemOrder: itemIndex + 1,
      itemTitle: menuItem.title,
      description: menuItem.description,
      price: menuItem.price,
      show: "TRUE",
      vegetarian: menuItem.vegetarian,
      vegan: menuItem.vegan,
      glutenFree: menuItem.glutenFree,
    });
  });
});

mkdirSync(path.dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  [
    columns.join(","),
    ...rows.map((row) =>
      columns.map((column) => csvEscape(row[column])).join(","),
    ),
  ].join("\n"),
  "utf8",
);

console.log(`Wrote ${rows.length} rows to ${outputPath}`);
