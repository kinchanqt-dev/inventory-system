const HEX_PATTERN = /^#([0-9a-fA-F]{6})$/;

export function isHexColor(value: string | null | undefined): boolean {
  if (typeof value !== "string") return false;
  return HEX_PATTERN.test(value.trim());
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.trim().replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function channelToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

/** Page backgrounds should stay light so dark text remains readable. */
export function isLightBackground(hex: string, minimum = 0.55): boolean {
  if (!isHexColor(hex)) return false;
  return relativeLuminance(hex) >= minimum;
}

export function contrastRatio(foregroundHex: string, backgroundHex: string): number {
  const lighter = Math.max(
    relativeLuminance(foregroundHex),
    relativeLuminance(backgroundHex),
  );
  const darker = Math.min(
    relativeLuminance(foregroundHex),
    relativeLuminance(backgroundHex),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Pick black or white text for a brand color.
 * Prefers white when it stays usable on buttons (≈3:1), so mid-tone brand
 * colors like caramel don’t get muddy black labels.
 */
export function foregroundForBackground(backgroundHex: string): string {
  const safeBackground = isHexColor(backgroundHex)
    ? backgroundHex.trim()
    : "#f7f4ef";
  const whiteContrast = contrastRatio("#ffffff", safeBackground);
  const blackContrast = contrastRatio("#000000", safeBackground);

  if (whiteContrast >= 3) return "#ffffff";
  if (blackContrast >= 3) return "#000000";
  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

export function meetsAaContrast(
  foregroundHex: string,
  backgroundHex: string,
  minimum = 4.5,
): boolean {
  return contrastRatio(foregroundHex, backgroundHex) >= minimum;
}
