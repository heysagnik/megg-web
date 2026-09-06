/**
 * Merge class names — filters falsy values and joins with a space.
 * Lightweight alternative to clsx/tailwind-merge with no dependencies.
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a price string or number into Indian Rupee notation.
 * e.g. "1299" → "Rs. 1,299"
 */
export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "Rs. —";
  return `Rs. ${num.toLocaleString("en-IN")}`;
}

/**
 * Capitalise the first letter of every word.
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Human-readable category display names.
 */
export const CATEGORY_DISPLAY: Record<string, string> = {
  Shirt: "Shirts",
  Tshirt: "T-Shirts",
  Jeans: "Jeans",
  Shoes: "Shoes",
  Jacket: "Jackets",
  "Mens Accessories": "Accessories",
  Hoodies: "Hoodies",
  Innerwear: "Innerwear",
  Sweater: "Sweaters",
  Sweatshirt: "Sweatshirts",
  Trackpants: "Track Pants",
  Traditional: "Traditional",
  Perfume: "Perfume",
  "Body Care": "Body Care",
  "Daily Essentials": "Daily Essentials",
};

export function getCategoryDisplay(slug: string): string {
  return CATEGORY_DISPLAY[slug] ?? toTitleCase(slug);
}

/**
 * Colour swatch map — used for filter chips and any "show me the colour" UI.
 * One map, one getter, one fallback. No parallel definitions.
 */
export const COLOR_SWATCH_MAP: Record<string, string> = {
  beige: "#e8dcc4",
  black: "#000000",
  blue: "#7096b8",
  brown: "#734d32",
  burgundy: "#730019",
  green: "#5e8c61",
  grey: "#c0c0c0",
  gray: "#c0c0c0",
  white: "#ffffff",
  red: "#cc1100",
  yellow: "#ffd700",
  pink: "#ffc0cb",
  navy: "#000080",
  olive: "#808000",
  cream: "#fffdd0",
  tan: "#d2b48c",
  purple: "#800080",
  orange: "#ffa500",
};

const COLOR_FALLBACK = "#d4d4d4";

export function getColorHex(color: string): string {
  if (!color) return COLOR_FALLBACK;
  return COLOR_SWATCH_MAP[color.toLowerCase().trim()] ?? COLOR_FALLBACK;
}

/**
 * Truncate a string to a maximum length, appending "…" if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
