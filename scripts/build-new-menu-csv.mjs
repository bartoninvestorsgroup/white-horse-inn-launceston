import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputPath = path.join(rootDir, "exports", "sanity-menus-new.csv");

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

function item(title, description, price, notes = []) {
  return {
    title,
    description,
    price,
    ...dietaryFromNotes(notes),
  };
}

function choice(label, price = "", notes = []) {
  return {
    label,
    price,
    ...dietaryFromNotes(notes),
  };
}

const menuIntroductions = {
  lunch:
    "Enjoy a relaxed pub lunch at The White Horse Inn, Launceston, with a menu built around generous portions, proper flavour, and comforting British pub favourites. Our lunch menu includes hearty mains, fresh seafood dishes, open sourdough sandwiches, loaded fries, homemade sides, and indulgent desserts, ideal for everything from a quick bite to a long, leisurely lunch.\n\nAs part of an independent, family-run group of local pubs, we focus on welcoming service, freshly prepared food, and quality ingredients, including from Philip Warren & Son Butchers right here in Launceston. Lunch is served Monday to Saturday 12pm to 3pm.\n\nDining with little ones? View our [Kids Menu](/food/kids-menu) here.",
  dinner:
    "Settle in for dinner at The White Horse Inn, Launceston, where classic pub dining meets a little extra care and creativity. Our evening menu features starters and sharers, fresh fish, homemade pies, steak, burgers, vegetarian and vegan options, traditional sides, and proper desserts, all served in a warm, welcoming pub setting.\n\nWe are part of an independent, family-run group of local pubs, with a focus on freshly prepared dishes, generous hospitality, and quality ingredients, including from Philip Warren & Son Butchers right here in Launceston. Dinner is served Monday to Saturday from 5pm to 9pm.\n\nFamilies are very welcome, and younger guests can choose from our [Kids Menu](/food/kids-menu) here.",
  kids:
    "Our Kids Menu at The White Horse Inn, Launceston is designed for younger diners who still deserve proper pub food. From chicken dippers and fries to sausage and mash, fish and chips, desserts, soft drinks, and ice cream, there’s plenty for children to enjoy alongside the grown-up menu.\n\nAs part of an independent, family-run group of local pubs, we believe family dining should be relaxed, welcoming, and full of flavour. Our children’s dishes are prepared with the same care as the rest of our menu, using quality ingredients, including from Philip Warren & Son Butchers right here in Launceston. The Kids Menu is available at the same times as our [Dinner](/food/dinner-menu) and [Sunday](/food/sunday-menu) menus.",
  sunday:
    "Join us for a proper Sunday lunch at The White Horse Inn, Launceston, with generous roasts, comforting pub classics, and indulgent desserts. Our Sunday menu includes traditional roast options such as pork belly, sirloin beef, chicken, nut roast, and other vegetarian choices, alongside non-roast mains, starters, sides, and puddings.\n\nWe are part of an independent, family-run group of local pubs, with a focus on freshly prepared food, warm hospitality, and quality ingredients, including from Philip Warren & Son Butchers right here in Launceston. Sunday food is served from 12pm to 4pm and 6pm to 8:30pm.\n\nFamilies are very welcome, and younger guests can choose from our [Kids Menu](/food/kids-menu).",
};

const lunchDinnerSections = [
  {
    title: "To Start",
    items: [
      item("Tapas Board", "Olives, Hummus, Chutney, Balsamic Vinegar, Toasted Ciabatta", "8", ["VE", "GFO"]),
      item("Roast Ham & Cornish Cheddar Croquettes", "Plum Chutney", "8"),
      item("Beer Battered Prawns", "Sweet Chilli Mayo, Crispy Onions", "8"),
      item("Soup Of The Day", "Toasted Ciabatta, Salted Butter", "7"),
      item("Honey & Rosemary Camembert Sharer", "Toasted Ciabatta, Chutney, Fig Jam", "13", ["V"]),
    ],
  },
  {
    title: "Mains",
    items: [
      item("Chickpea & Sweet Potato Curry", "Mango Chutney, Poppadom, Rice\nAdd Chicken £3", "15", ["VE", "GFO"]),
      item("Herb Parmesan Crusted Cod Loin", "Crushed Roasted New Potatoes, Tender Stem, Romesco Sauce", "18"),
      item("Beer Battered Catch Of The Day", "Chips, Tartare Sauce, Garden Peas", "18", ["GFO"]),
      item("Small Catch Of The Day", "Chips, Tartare Sauce, Garden Peas", "10", ["GFO"]),
      item("Pie Of The Day", "Mash, Gravy, Seasonal Vegetables", "18"),
      item("8oz Sirloin Steak", "Chips, Peas, Mushroom, Tomato", "27"),
      item("8oz Rump Steak", "Chips, Peas, Mushroom, Tomato", "24"),
      item("Add Sauce", "Peppercorn, Blue Cheese, Port", "2.50"),
      item("Beef Lasagna", "Garlic Bread, Salad", "16"),
      item("Grilled Halloumi", "Dressed Rocket Salad, Sweet Chilli", "16", ["V"]),
    ],
  },
  {
    title: "Burgers",
    description:
      "All Burgers Come With Spiced Ketchup, Lettuce, Tomato, Red Onion, Brioche Bun with Chips.",
    items: [
      item("Southern Fried Chicken Burger", "", "17"),
      item("Aged Beef With Monterey Jack Cheese Burger", "", "17"),
      item("Vegan Bean Burger", "", "17", ["VE", "GFO"]),
    ],
  },
  {
    title: "Sides",
    items: [
      item("Tender Stem Broccoli", "", "3"),
      item("Cheesy Garlic Ciabatta", "", "6"),
      item("Sweet Potato Fries", "", "4"),
      item("Chips", "", "5"),
      item("Fries", "", "4"),
      item("Cheesy Chips", "", "6"),
      item("Onion Rings", "", "5"),
    ],
  },
  {
    title: "Desserts",
    description:
      "Inform your server of any allergies or intolerance. Not all ingredients are listed on the menu and we cannot guarantee the total absence of allergens. Detailed info on the Fourteen allergens are available upon request.",
    items: [
      item("Chocolate Sundae", "", "8", ["VE", "GF"]),
      item("Honeycomb Sundae", "", "8", ["V", "GF"]),
      item("Homemade Sticky Toffee Pudding", "", "8"),
      item("Spiced Apple & Mixed Berry Crumble", "With Choice Of Ice Cream, Clotted Cream, Custard", "8"),
      item("Chocolate Brownie", "", "9", ["VE", "GF"]),
      item("Cheesecake Of The Day", "Clotted Cream", "8"),
      {
        title:
          "The Dartmoor Ice Cream Company Selection\nHoneycomb (GF)\nMadagascan Vanilla (GF)\nSalted Caramel (GF)\nVegan Chocolate (VE)(GF)",
        choices: [
          choice("1 scoop", "2.50"),
          choice("2 scoops", "4.50"),
          choice("3 scoops", "6"),
        ],
      },
    ],
  },
];

const menus = [
  {
    _id: "menu-lunch-menu",
    title: "Lunch",
    slug: "lunch-menu",
    menuType: "lunchMenu",
    introduction: menuIntroductions.lunch,
    sections: [
      ...lunchDinnerSections.slice(0, 2),
      {
        title: "Ciabattas",
        description:
          "All served with Chips.\n\nInform your server of any allergies or intolerance. Not all ingredients are listed on the menu and we cannot guarantee the total absence of allergens. Detailed info on the Fourteen allergens are available upon request.",
        items: [
          item("Ploughman's", "Vintage Cheddar, Branston Pickle, Mixed Salad", "12", ["V"]),
          item("BLT", "Smoked Streaky Bacon, Gem Lettuce, Beef Tomato, Mayo", "12"),
          item("Fish Finger", "Battered Catch Of The Day, House Tartare Sauce, Gem Lettuce", "13"),
          item("Southern Fried Chicken", "Southern Fried Chicken, Gem Lettuce, Mayo, Tomato", "13"),
        ],
      },
      ...lunchDinnerSections.slice(2),
    ],
  },
  {
    _id: "menu-dinner-menu",
    title: "Dinner",
    slug: "dinner-menu",
    menuType: "dinnerMenu",
    introduction: menuIntroductions.dinner,
    sections: lunchDinnerSections,
  },
  {
    _id: "menu-kids-menu",
    title: "Kids Menu",
    slug: "kids-menu",
    menuType: "kidsMenu",
    introduction: menuIntroductions.kids,
    sections: [
      {
        title: "Meals",
        description:
          "Choose one main, one dessert, and one drink for £10.\nAll mains come with choice of beans or garden peas.",
        items: [
          item("Chicken Dippers & Fries", "", ""),
          item("Sausage & Mash", "Vegetarian option available", "", ["VO"]),
          item("Fish & Chips", "", ""),
        ],
      },
      {
        title: "Desserts",
        description: "Choose one dessert as part of the £10 kids menu.",
        items: [
          item("Chocolate Brownie", "", ""),
          {
            title: "Ice Cream Scoop",
            choices: [
              choice("Vanilla"),
              choice("Honeycomb"),
              choice("Salted Caramel"),
              choice("Chocolate"),
              choice("Rockyroad"),
            ],
          },
        ],
      },
      {
        title: "Drinks",
        description: "Choose one drink as part of the £10 kids menu.",
        items: [
          item("Orange Juice", "", ""),
          item("Apple Juice", "", ""),
          item("Fruit Shoot", "", ""),
        ],
      },
    ],
  },
  {
    _id: "menu-sunday",
    title: "Sunday",
    slug: "sunday-menu",
    menuType: "sundayMenu",
    introduction: menuIntroductions.sunday,
    sections: [
      {
        title: "To Start",
        items: [
          item("Beer Battered Prawns", "Sweet Chilli Mayo, Crispy Onions", "8"),
          item("Soup Of The Day", "Toasted Ciabatta, Salted Butter", "7"),
          item("Honey & Rosemary Camembert Sharer", "Toasted Ciabatta, Chutney, Fig Jam", "13", ["V"]),
        ],
      },
      {
        title: "Roasts",
        description:
          "All our Sunday Dishes are Served with Herb Ruffled Roast Potatoes, Honey Parsnips, Braised Red Cabbage, Roast Carrots, Homemade Yorkshire Pudding, Seasonal Greens, Gravy and Cauliflower Cheese.",
        items: [
          item("Slow Roasted Pork Belly With Apple & Apricot Stuffing", "", "15", ["GF"]),
          item("Slow Roasted Sirloin Beef", "", "16"),
          item("Bone-in Chicken Breast", "", "15"),
          item("The Stable Roast - All Three Meats", "", "23"),
          item("Nut Roast", "", "15", ["VE"]),
          item("Roast Mushroom, Garlic & Cashew Crumb", "", "15", ["VE", "GF"]),
          item("Small Roast", "", "12"),
        ],
      },
      {
        title: "Extras",
        items: [
          item("Pigs In Blankets", "", "5"),
          item("Cauliflower Cheese", "", "4", ["V"]),
        ],
      },
      {
        title: "Other Mains",
        description:
          "All Burgers Come With Spiced Ketchup, Lettuce, Tomato, Red Onion, Brioche Bun with Chips.",
        items: [
          item("Beer Battered Catch Of The Day", "Chips, Tartare Sauce, Garden Peas", "18"),
          item("Sweet Chilli Chicken Burger", "", "17"),
          item("Aged Beef With Monterey Jack Cheese Burger", "", "17"),
          item("Vegan Burger", "", "17", ["VE", "GFO"]),
        ],
      },
    ],
  },
];

const rows = [];

for (const menu of menus) {
  menu.sections.forEach((section, sectionIndex) => {
    section.items.forEach((menuItem, itemIndex) => {
      const choices = menuItem.choices || [];
      const base = {
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
        description: menuItem.description || "",
        price: menuItem.price || "",
        show: "TRUE",
        vegetarian: menuItem.vegetarian || "no",
        vegan: menuItem.vegan || "no",
        glutenFree: menuItem.glutenFree || "no",
      };

      if (!choices.length) {
        rows.push(base);
        return;
      }

      choices.forEach((menuChoice, choiceIndex) => {
        rows.push({
          ...base,
          _id: choiceIndex === 0 ? base._id : "",
          showOnWebsite: choiceIndex === 0 ? base.showOnWebsite : "",
          listInSitemap: choiceIndex === 0 ? base.listInSitemap : "",
          menuIntroduction: choiceIndex === 0 ? base.menuIntroduction : "",
          sectionDescription: choiceIndex === 0 ? base.sectionDescription : "",
          itemTitle: choiceIndex === 0 ? [menuItem.title, menuItem.description].filter(Boolean).join("\n") : "",
          description: menuChoice.label,
          price: menuChoice.price,
          vegetarian: menuChoice.vegetarian || "no",
          vegan: menuChoice.vegan || "no",
          glutenFree: menuChoice.glutenFree || "no",
        });
      });
    });
  });
}

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
