export function resolveEventStatus(event, now = new Date()) {
  const start = event.startAt ? new Date(event.startAt) : null;
  const end = event.endAt ? new Date(event.endAt) : null;

  if (start && start > now) {
    return "upcoming";
  }

  if (start && end && start <= now && end >= now) {
    return "current";
  }

  return "past";
}

export function extractPortableTextText(body) {
  if (!Array.isArray(body)) {
    return "";
  }

  return body
    .filter((block) => block?._type === "block" && Array.isArray(block.children))
    .map((block) =>
      block.children
        .filter((child) => child?._type === "span" && child.text)
        .map((child) => child.text)
        .join("")
        .trim(),
    )
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function buildDetailsExcerpt(body, maxLength = 220) {
  const text = extractPortableTextText(body);

  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trimEnd()}...`;
}

export function formatEventStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
