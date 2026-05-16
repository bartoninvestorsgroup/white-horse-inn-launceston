import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const isDryRun = process.argv.includes("--dry-run");
const csvPath =
  process.argv.slice(2).find((argument) => !argument.startsWith("--")) ||
  path.join(rootDir, "exports", "sanity-events.csv");
const allowedStatuses = new Set(["current", "upcoming", "archived"]);

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

function portableTextFromPlainText(value, slug) {
  const paragraphs = value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.map((paragraph, index) => ({
    _type: "block",
    _key: stableKey(`${slug}:block:${index}:${paragraph}`),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: stableKey(`${slug}:span:${index}:${paragraph}`),
        text: paragraph,
        marks: [],
      },
    ],
  }));
}

function parseBoolean(value) {
  return ["true", "yes", "1"].includes(value.trim().toLowerCase());
}

function parseLocations(value) {
  return value
    .split("|")
    .map((location) => location.trim())
    .filter(Boolean);
}

function validateDate(value) {
  return value && !Number.isNaN(new Date(value).getTime());
}

function buildDocument(row, rowNumber) {
  const title = row.title.trim();
  const slug = row.slug.trim();
  const bodyText = row.body_text.trim();
  const status = row.status.trim() || "upcoming";
  const locations = parseLocations(row.locations);
  const id = row._id.trim() || `event-${slug}`;
  const errors = [];

  if (!title) errors.push("title is required");
  if (!slug) errors.push("slug is required");
  if (!bodyText) errors.push("body_text is required");
  if (!validateDate(row.startAt.trim())) errors.push("startAt must be a valid date");
  if (row.endAt.trim() && !validateDate(row.endAt.trim())) {
    errors.push("endAt must be a valid date");
  }
  if (row.endAt.trim() && new Date(row.endAt) < new Date(row.startAt)) {
    errors.push("endAt must be after startAt");
  }
  if (!allowedStatuses.has(status)) {
    errors.push("status must be current, upcoming, or archived");
  }
  if (locations.length === 0) errors.push("locations is required");

  if (errors.length) {
    throw new Error(`Row ${rowNumber}: ${errors.join("; ")}`);
  }

  const document = {
    _id: id,
    _type: "event",
    title,
    slug: {
      _type: "slug",
      current: slug,
    },
    summary: row.summary.trim() || undefined,
    body: portableTextFromPlainText(bodyText, slug),
    startAt: row.startAt.trim(),
    endAt: row.endAt.trim() || undefined,
    status,
    priceLabel: row.priceLabel.trim() || undefined,
    ctaLink: row.ctaLink.trim() || undefined,
    locations,
    featured: parseBoolean(row.featured),
  };

  const imageAssetRef = row.imageAssetRef.trim();
  const imageAlt = row.imageAlt.trim();

  if (imageAssetRef) {
    document.image = {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: imageAssetRef,
      },
      alt: imageAlt || title,
    };
  }

  return document;
}

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";
const token = process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
}

if (!token && !isDryRun) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN.");
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const documents = rows.map((row, index) => buildDocument(row, index + 2));
const existingCount = documents.filter((document) => !document._id.startsWith("event-")).length;
const newCount = documents.length - existingCount;

console.log(
  `${isDryRun ? "Validated" : "Importing"} ${documents.length} events ` +
    `(${existingCount} existing, ${newCount} new) from ${csvPath}`,
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

console.log(`Imported ${documents.length} events to Sanity (${transactionId}).`);
