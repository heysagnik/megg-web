/**
 * Merge class names — filters falsy values and joins with a space.
 * Lightweight alternative to clsx/tailwind-merge with no dependencies.
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a price string or number into Indian Rupee notation.
 * e.g. "1299" → "₹1,299"
 */
export function formatPrice(price: string | number): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  if (isNaN(num)) return "₹—";
  return `₹${num.toLocaleString("en-IN")}`;
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
 * CSS colour map used in product cards and detail pages.
 */
export const COLOR_MAP: Record<string, string> = {
  white: "#F5F5F5",
  black: "#1A1A1A",
  blue: "#4A7FA5",
  navy: "#1B2A4A",
  grey: "#9E9E9E",
  gray: "#9E9E9E",
  beige: "#C9B89A",
  brown: "#7D5A3C",
  green: "#4A7C59",
  orange: "#D4703A",
  red: "#B74444",
  pink: "#E8A0A0",
  yellow: "#D4C03A",
  purple: "#7B5EA7",
  olive: "#6B6B45",
  maroon: "#7A2D2D",
};

export function getColorHex(color: string): string {
  return COLOR_MAP[color.toLowerCase()] ?? "#CCCCCC";
}

/**
 * Returns true if the product colour is a valid, displayable value.
 */
export function isValidColor(color: string | undefined | null): boolean {
  if (!color) return false;
  const c = color.trim().toLowerCase();
  return c !== "" && c !== "na" && c !== "n/a" && c !== "none";
}

/**
 * Truncate a string to a maximum length, appending "…" if needed.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}
