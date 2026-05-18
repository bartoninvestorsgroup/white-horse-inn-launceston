import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const isDryRun = process.argv.includes("--dry-run");
const csvPath =
  process.argv.slice(2).find((argument) => !argument.startsWith("--")) ||
  path.join(rootDir, "exports", "sanity-menus.csv");

const menuTypeAliases = new Map([
  ["ourmenu", "ourMenu"],
  ["our menu", "ourMenu"],
  ["lunchmenu", "lunchMenu"],
  ["lunch menu", "lunchMenu"],
  ["dinnermenu", "dinnerMenu"],
  ["dinner menu", "dinnerMenu"],
  ["kidsmenu", "kidsMenu"],
  ["kids menu", "kidsMenu"],
  ["sundaymenu", "sundayMenu"],
  ["sunday menu", "sundayMenu"],
  ["dessertsmenu", "dessertsMenu"],
  ["desserts menu", "dessertsMenu"],
  ["dessertmenu", "dessertsMenu"],
  ["dessert menu", "dessertsMenu"],
  ["drinksmenu", "drinksMenu"],
  ["drinks menu", "drinksMenu"],
  ["drinkmenu", "drinksMenu"],
  ["drink menu", "drinksMenu"],
  ["spring", "spring"],
  ["summer", "summer"],
  ["autumn", "autumn"],
  ["winter", "winter"],
  ["christmas", "christmas"],
  ["specials", "specials"],
  ["allyear", "allYear"],
  ["all year", "allYear"],
]);
const allowedDietaryValues = new Set(["yes", "option", "no"]);

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

function parseCsv(csv) {
  const rows = [];
  let field = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const nextChar = csv[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        field += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") {
        index += 1;
      }

      row.push(field);
      field = "";

      if (row.some((value) => value !== "")) {
        rows.push(row);
      }

      row = [];
    } else {
      field += char;
    }
  }

  row.push(field);

  if (row.some((value) => value !== "")) {
    rows.push(row);
  }

  const [headers, ...dataRows] = rows;

  return dataRows.map((dataRow) =>
    Object.fromEntries(headers.map((header, index) => [header, dataRow[index] || ""])),
  );
}

function stableKey(value) {
  return createHash("sha1").update(value).digest("hex").slice(0, 12);
}

function parseBoolean(value) {
  return !["false", "no", "0"].includes(value.trim().toLowerCase());
}

function normalizeText(value) {
  return String(value || "")
    .replaceAll("Â£", "£")
    .replaceAll("�", "£")
    .trim();
}

function normalizeDietary(value) {
  const normalized = value.trim().toLowerCase();
  return allowedDietaryValues.has(normalized) ? normalized : "no";
}

function normalizeMenuType(value) {
  const normalized = normalizeText(value).replace(/\s+/g, " ").toLowerCase();
  return menuTypeAliases.get(normalized) || "";
}

function rowNumber(rowIndex) {
  return rowIndex + 2;
}

function splitTitleAndDescription(value) {
  const lines = normalizeText(value)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: lines[0] || "",
    description: lines.slice(1).join("\n") || "",
  };
}

function buildChoice(row, slug, sectionTitle, itemOrder, choiceIndex) {
  const label = normalizeText(row.description);

  if (!label) {
    return null;
  }

  return {
    _type: "menuItemChoice",
    _key: stableKey(`${slug}:section:${sectionTitle}:item:${itemOrder}:choice:${choiceIndex}:${label}`),
    label,
    price: normalizeText(row.price) || undefined,
    show: parseBoolean(row.show || "TRUE"),
    vegetarian: normalizeDietary(row.vegetarian || "No"),
    vegan: normalizeDietary(row.vegan || "No"),
    glutenFree: normalizeDietary(row.glutenFree || "No"),
    order: choiceIndex + 1,
  };
}

function buildDocuments(rows) {
  const menuMap = new Map();

  rows.forEach((row, index) => {
    const menuTitle = normalizeText(row.menuTitle);
    const slug = normalizeText(row.slug);
    const menuType = normalizeMenuType(row.menuType);
    const sectionTitle = normalizeText(row.sectionTitle);
    const itemTitle = normalizeText(row.itemTitle);
    const errors = [];

    if (!menuTitle) errors.push("menuTitle is required");
    if (!slug) errors.push("slug is required");
    if (!menuType) {
      errors.push("menuType must be Our Menu, Lunch Menu, Dinner Menu, Kids Menu, Sunday Menu, Desserts Menu, Drinks Menu, Spring, Summer, Autumn, Winter, Christmas, Specials, or All Year");
    }
    if (!sectionTitle) errors.push("sectionTitle is required");
    if (sectionTitle === "Meals" && menuType !== "kidsMenu") {
      errors.push('sectionTitle "Meals" can only be used with menuType Kids Menu');
    }
    if (
      ["Sunday Lunch", "Non-Roast Mains"].includes(sectionTitle) &&
      menuType !== "sundayMenu"
    ) {
      errors.push(`sectionTitle "${sectionTitle}" can only be used with menuType Sunday Menu`);
    }

    if (errors.length) {
      throw new Error(`Row ${rowNumber(index)}: ${errors.join("; ")}`);
    }

    const menuKey = slug;
    const menu = menuMap.get(menuKey) || {
      _id: normalizeText(row._id) || `menu-${slug}`,
      _type: "menu",
      title: menuTitle,
      slug: {
        _type: "slug",
        current: slug,
      },
      menuType,
      showOnWebsite: parseBoolean(row.showOnWebsite || "TRUE"),
      listInSitemap: parseBoolean(row.listInSitemap || "TRUE"),
      introduction: normalizeText(row.menuIntroduction || row.introduction) || undefined,
      sections: [],
      sectionMap: new Map(),
    };

    const rowIntroduction = normalizeText(row.menuIntroduction || row.introduction);

    if (rowIntroduction && !menu.introduction) {
      menu.introduction = rowIntroduction;
    }

    const sectionKey = sectionTitle.toLowerCase();
    const section = menu.sectionMap.get(sectionKey) || {
      _type: "menuSection",
      _key: stableKey(`${slug}:section:${sectionTitle}`),
      title: sectionTitle,
      order: Number(row.sectionOrder) || menu.sections.length + 1,
      items: [],
    };

    const itemOrder = Number(row.itemOrder) || section.items.length + 1;
    const itemKey = String(itemOrder);
    const existingItem = section.itemMap?.get(itemKey);

    if (existingItem) {
      const choice = buildChoice(
        row,
        slug,
        sectionTitle,
        itemOrder,
        existingItem.choices?.length || 0,
      );

      if (choice) {
        existingItem.choices ||= [];
        existingItem.choices.push(choice);
      }
    } else if (itemTitle) {
      const duplicateItemRows = rows.filter(
        (candidate) =>
          normalizeText(candidate.slug) === slug &&
          normalizeText(candidate.sectionTitle).toLowerCase() === sectionKey &&
          String(Number(candidate.itemOrder) || "") === String(itemOrder),
      );
      const isChoiceGroup = duplicateItemRows.length > 1;
      const titleParts = isChoiceGroup
        ? splitTitleAndDescription(itemTitle)
        : { title: itemTitle, description: "" };
      const baseDescription = isChoiceGroup
        ? titleParts.description || undefined
        : normalizeText(row.description) || undefined;
      const menuItem = {
        _type: "menuItem",
        _key: stableKey(`${slug}:section:${sectionTitle}:item:${itemOrder}:${titleParts.title}`),
        title: titleParts.title,
        description: baseDescription,
        price: isChoiceGroup ? undefined : normalizeText(row.price) || undefined,
        show: parseBoolean(row.show || "TRUE"),
        vegetarian: normalizeDietary(row.vegetarian || "No"),
        vegan: normalizeDietary(row.vegan || "No"),
        glutenFree: normalizeDietary(row.glutenFree || "No"),
        order: itemOrder,
      };

      if (isChoiceGroup) {
        const choice = buildChoice(row, slug, sectionTitle, itemOrder, 0);

        if (choice) {
          menuItem.choices = [choice];
        }
      }

      section.items.push(menuItem);
      section.itemMap ||= new Map();
      section.itemMap.set(itemKey, menuItem);
    }

    menu.sectionMap.set(sectionKey, section);

    if (!menu.sections.includes(section)) {
      menu.sections.push(section);
    }

    menuMap.set(menuKey, menu);
  });

  return Array.from(menuMap.values()).map((menu) => {
    menu.sections.sort((left, right) => left.order - right.order);
    menu.sections.forEach((section) => {
      section.items.sort((left, right) => left.order - right.order);
      section.items.forEach((item) => {
        item.choices?.sort((left, right) => left.order - right.order);
        item.choices?.forEach((choice) => {
          delete choice.order;
        });
        delete item.order;
      });
      delete section.order;
      delete section.itemMap;
    });
    delete menu.sectionMap;

    return menu;
  });
}

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
}

if (!token && !isDryRun) {
  throw new Error(
    "Missing SANITY_API_WRITE_TOKEN. Create a Sanity API token with write access and add it to .env.local.",
  );
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const documents = buildDocuments(rows);

console.log(
  `${isDryRun ? "Validated" : "Importing"} ${documents.length} menu documents from ${csvPath}`,
);

if (isDryRun) {
  process.exit(0);
}

const url = new URL(
  `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`,
);

const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    mutations: documents.map((document) => ({ createOrReplace: document })),
  }),
});

if (!response.ok) {
  throw new Error(
    `Sanity mutation failed with ${response.status}: ${await response.text()}`,
  );
}

const payload = await response.json();
const transactionId = payload.transactionId || "unknown transaction";

console.log(`Imported ${documents.length} menu documents to Sanity (${transactionId}).`);
