import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports");
const outputPath = path.join(outputDir, "sanity-menus.csv");

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) {
    return;
  }

  const lines = readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ||= value;
  }
}

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

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
}

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
  "itemOrder",
  "itemTitle",
  "description",
  "price",
  "show",
  "vegetarian",
  "vegan",
  "glutenFree",
];

const query = `*[_type == "menu"] | order(menuType asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  menuType,
  "showOnWebsite": coalesce(showOnWebsite, true),
  "listInSitemap": coalesce(listInSitemap, true),
  introduction,
  sections[]{
    title,
    items[]{
      title,
      description,
      price,
      choices[]{
        label,
        price,
        "show": coalesce(show, true),
        vegetarian,
        vegan,
        glutenFree
      },
      "show": coalesce(show, true),
      vegetarian,
      vegan,
      glutenFree
    }
  }
}`;

const url = new URL(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`,
);
url.searchParams.set("query", query);

const response = await fetch(url, {
  headers: token ? { Authorization: `Bearer ${token}` } : {},
});

if (!response.ok) {
  throw new Error(
    `Sanity query failed with ${response.status}: ${await response.text()}`,
  );
}

const payload = await response.json();
const menus = Array.isArray(payload.result) ? payload.result : [];
const rows = [];

for (const menu of menus) {
  const sections = Array.isArray(menu.sections) ? menu.sections : [];

  if (!sections.length) {
    rows.push({
      _id: menu._id,
      menuTitle: menu.title,
      slug: menu.slug,
      menuType: menu.menuType,
      showOnWebsite: menu.showOnWebsite === false ? "FALSE" : "TRUE",
      listInSitemap: menu.listInSitemap === false ? "FALSE" : "TRUE",
      menuIntroduction: menu.introduction || "",
      sectionOrder: "",
      sectionTitle: "",
      itemOrder: "",
      itemTitle: "",
      description: "",
      price: "",
      show: "TRUE",
      vegetarian: "No",
      vegan: "No",
      glutenFree: "No",
    });
    continue;
  }

  sections.forEach((section, sectionIndex) => {
    const items = Array.isArray(section.items) ? section.items : [];

    if (!items.length) {
      rows.push({
        _id: menu._id,
        menuTitle: menu.title,
        slug: menu.slug,
        menuType: menu.menuType,
        showOnWebsite: menu.showOnWebsite === false ? "FALSE" : "TRUE",
        listInSitemap: menu.listInSitemap === false ? "FALSE" : "TRUE",
        menuIntroduction: menu.introduction || "",
        sectionOrder: sectionIndex + 1,
        sectionTitle: section.title,
        itemOrder: "",
        itemTitle: "",
        description: "",
        price: "",
        show: "TRUE",
        vegetarian: "No",
        vegan: "No",
        glutenFree: "No",
      });
      return;
    }

    items.forEach((item, itemIndex) => {
      const choices = Array.isArray(item.choices)
        ? item.choices.filter((choice) => choice?.label)
        : [];
      const itemTitle = [item.title, item.description].filter(Boolean).join("\n");

      if (choices.length) {
        choices.forEach((choice, choiceIndex) => {
          rows.push({
            _id: choiceIndex === 0 ? menu._id : "",
            menuTitle: menu.title,
            slug: menu.slug,
            menuType: menu.menuType,
            showOnWebsite: choiceIndex === 0
              ? menu.showOnWebsite === false
                ? "FALSE"
                : "TRUE"
              : "",
            listInSitemap: choiceIndex === 0
              ? menu.listInSitemap === false
                ? "FALSE"
                : "TRUE"
              : "",
            menuIntroduction: choiceIndex === 0 ? menu.introduction || "" : "",
            sectionOrder: sectionIndex + 1,
            sectionTitle: section.title,
            itemOrder: itemIndex + 1,
            itemTitle: choiceIndex === 0 ? itemTitle : "",
            description: choice.label,
            price: choice.price,
            show: choice.show === false ? "FALSE" : "TRUE",
            vegetarian: choice.vegetarian || "No",
            vegan: choice.vegan || "No",
            glutenFree: choice.glutenFree || "No",
          });
        });
        return;
      }

      rows.push({
        _id: menu._id,
        menuTitle: menu.title,
        slug: menu.slug,
        menuType: menu.menuType,
        showOnWebsite: menu.showOnWebsite === false ? "FALSE" : "TRUE",
        listInSitemap: menu.listInSitemap === false ? "FALSE" : "TRUE",
        menuIntroduction: menu.introduction || "",
        sectionOrder: sectionIndex + 1,
        sectionTitle: section.title,
        itemOrder: itemIndex + 1,
        itemTitle: item.title,
        description: item.description,
        price: item.price,
        show: item.show === false ? "FALSE" : "TRUE",
        vegetarian: item.vegetarian || "No",
        vegan: item.vegan || "No",
        glutenFree: item.glutenFree || "No",
      });
    });
  });
}

mkdirSync(outputDir, { recursive: true });
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

console.log(`Exported ${rows.length} menu rows to ${outputPath}`);
