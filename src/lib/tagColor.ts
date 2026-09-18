import type { CSSProperties } from "react";

/** The color-relevant fields shared by a tags-table row, a TagRecord, and the
 *  admin form's in-progress edits — whichever shape a caller happens to have. */
export interface TagColorish {
  color?: string | null;
  bgColor?: string | null;
  textColor?: string | null;
}

/**
 * Resolves how a tag should be painted: a custom bg/text color pair (freely
 * chosen in the admin) takes over via inline style when both are set;
 * otherwise falls back to the tag's `color` preset class exactly as before
 * this feature existed, so untouched tags render identically.
 */
export function tagBadgeStyle(
  t: TagColorish,
  fallbackClass = "badge-humid",
): { className: string; style?: CSSProperties } {
  if (t.bgColor && t.textColor) {
    return { className: "badge-category", style: { backgroundColor: t.bgColor, color: t.textColor } };
  }
  return { className: t.color || fallbackClass };
}

/**
 * Black or white, whichever reads clearly on the given hex background —
 * simple perceived-brightness heuristic (ITU-R BT.601 luma), not full WCAG
 * contrast. Used to auto-fill a tag's *other* custom color field the moment
 * an admin sets just one, so the live preview reacts after a single pick
 * instead of silently waiting for both fields (tagBadgeStyle requires the
 * pair) to be filled in before anything visibly changes.
 */
export function contrastText(hexBg: string): "#111111" | "#ffffff" {
  const m = /^#([0-9a-f]{6})$/i.exec(hexBg);
  if (!m) return "#111111";
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return luma > 150 ? "#111111" : "#ffffff";
}
