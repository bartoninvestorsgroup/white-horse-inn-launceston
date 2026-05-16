export function buildOpenTableBookingUrl({
  openTableId,
  partySize,
  date,
  time,
}) {
  if (!openTableId) {
    return null;
  }

  const resolvedPartySize = Number.isFinite(Number(partySize))
    ? Math.max(1, Number(partySize))
    : 2;
  const resolvedDate = date || new Date().toISOString().slice(0, 10);
  const resolvedTime = time || "19:00";
  const resolvedDateTime = `${resolvedDate}T${resolvedTime}`;

  const searchParams = new URLSearchParams();
  searchParams.set("rid", String(openTableId));
  searchParams.set("restref", String(openTableId));
  searchParams.set("lang", "en-GB");
  searchParams.set("color", "5");
  searchParams.set("dark", "false");
  searchParams.set("partysize", String(resolvedPartySize));
  searchParams.set("datetime", resolvedDateTime);
  searchParams.set("ot_source", "Restaurant website");

  return `https://www.opentable.co.uk/booking/restref/availability?${searchParams.toString()}`;
}

