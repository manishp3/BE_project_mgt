export function extractHours(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;

  timeStr = timeStr.trim().toLowerCase();

  if (timeStr.endsWith("h")) {
    const hours = parseFloat(timeStr.replace("h", ""));
    return isNaN(hours) ? 0 : hours;
  }
  if (timeStr.endsWith("w")) {
    const week = parseFloat(timeStr.replace("w", ""));
    return isNaN(hours) ? 0 : week*7;
  }

  if (timeStr.endsWith("m")) {
    const minutes = parseFloat(timeStr.replace("m", ""));
    return isNaN(minutes) ? 0 : minutes / 60;
  }

  // If no unit provided, assume hours
  const fallback = parseFloat(timeStr);
  return isNaN(fallback) ? 0 : fallback;
}
