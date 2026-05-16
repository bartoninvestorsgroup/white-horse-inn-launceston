import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports");
const outputPath = path.join(outputDir, "sanity-events.csv");

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

loadEnvFile(path.join(rootDir, ".env"));
loadEnvFile(path.join(rootDir, ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-04-12";
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID.");
}

const query = `*[_type == "event"] | order(startAt asc, title asc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  startAt,
  endAt,
  status,
  priceLabel,
  ctaLink,
  locations,
  featured,
  image {
    "url": asset->url,
    "assetRef": asset._ref,
    alt
  }
}`;

function blockToText(block) {
  if (!block || block._type !== "block" || !Array.isArray(block.children)) {
    return "";
  }

  return block.children
    .map((child) => (typeof child.text === "string" ? child.text : ""))
    .join("");
}

function portableTextToPlainText(value) {
  if (!Array.isArray(value)) {
    return "";
  }

  return value.map(blockToText).filter(Boolean).join("\n\n");
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

const columns = [
  "_id",
  "title",
  "slug",
  "summary",
  "body_text",
  "startAt",
  "endAt",
  "status",
  "priceLabel",
  "ctaLink",
  "locations",
  "imageUrl",
  "imageAssetRef",
  "imageAlt",
  "featured",
];

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
const events = Array.isArray(payload.result) ? payload.result : [];

const rows = events.map((event) => ({
  _id: event._id,
  title: event.title,
  slug: event.slug,
  summary: event.summary,
  body_text: portableTextToPlainText(event.body),
  startAt: event.startAt,
  endAt: event.endAt,
  status: event.status,
  priceLabel: event.priceLabel,
  ctaLink: event.ctaLink,
  locations: Array.isArray(event.locations) ? event.locations.join(" | ") : "",
  imageUrl: event.image?.url,
  imageAssetRef: event.image?.assetRef,
  imageAlt: event.image?.alt,
  featured: event.featured === true ? "TRUE" : "FALSE",
}));

mkdirSync(outputDir, { recursive: true });
writeFileSync(
  outputPath,
  [columns.join(","), ...rows.map((row) => columns.map((column) => csvEscape(row[column])).join(","))].join("\n"),
  "utf8",
);

console.log(`Exported ${rows.length} events to ${outputPath}`);
