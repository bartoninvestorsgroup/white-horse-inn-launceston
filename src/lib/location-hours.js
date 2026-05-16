function parseMinutes(timeValue) {
  const [hoursRaw, minutesRaw] = String(timeValue || "").split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function normalizeSession(session) {
  if (!session || session.isClosed) {
    return null;
  }

  const openTime = session.openTime;
  const closeTime = session.closeTime;
  const openMinutes = parseMinutes(openTime);
  const closeMinutes = parseMinutes(closeTime);

  if (openMinutes === null || closeMinutes === null) {
    return null;
  }

  return {
    openTime,
    closeTime,
    openMinutes,
    closeMinutes,
  };
}

function normalizeEntrySessions(entry) {
  if (!entry || entry.isClosed) {
    return [];
  }

  if (Array.isArray(entry.sittings) && entry.sittings.length) {
    return entry.sittings.map(normalizeSession).filter(Boolean);
  }

  const normalizedSingle = normalizeSession(entry);
  return normalizedSingle ? [normalizedSingle] : [];
}

function findDayEntry(list, isoDate) {
  if (!Array.isArray(list) || !list.length) {
    return null;
  }

  const weekdayName = new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "long",
  });

  return (
    list.find((entry) => String(entry.day).toLowerCase() === weekdayName.toLowerCase()) || null
  );
}

export function getBookingSessionsForDate(location, isoDate) {
  if (!location || !isoDate) {
    return [];
  }

  const foodEntry = findDayEntry(location.foodTimes, isoDate);
  const foodSessions = normalizeEntrySessions(foodEntry);
  if (foodSessions.length) {
    return foodSessions;
  }

  const openingEntry = findDayEntry(location.openingTimes, isoDate);
  return normalizeEntrySessions(openingEntry);
}

export function isSlotInAnySession(slotMinutes, sessions) {
  if (!Number.isFinite(slotMinutes) || !Array.isArray(sessions) || !sessions.length) {
    return false;
  }

  return sessions.some((session) => {
    if (session.closeMinutes > session.openMinutes) {
      return slotMinutes >= session.openMinutes && slotMinutes <= session.closeMinutes;
    }

    return slotMinutes >= session.openMinutes || slotMinutes <= session.closeMinutes;
  });
}

export function parseTimeToMinutes(timeValue) {
  return parseMinutes(timeValue);
}

