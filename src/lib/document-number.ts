export function buildTimedDocumentNumber(prefix: string, date = new Date()) {
  const stamp = date
    .toISOString()
    .replace(/[-:TZ.]/g, "")
    .slice(0, 14);
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${prefix}${stamp}${suffix}`;
}
