/**
 * Single source of truth for anything that needs the site's public identity.
 * Both the React app and scripts/seoPlugin.ts read from here — never hardcode
 * the origin anywhere else, or canonical/og:url/sitemap will drift apart.
 */

// TODO: replace with the real domain once it exists. Everything else derives
// from this — canonical links, og:url, the sitemap, and robots.txt's Sitemap line.
export const SITE_URL = "https://treekingdom.example.com";

export const SITE_NAME = "TreeKingdom";

export const SITE_TITLE = {
  th: "TreeKingdom — อาณาจักรแห่งต้นไม้",
  en: "TreeKingdom — The Tree Kingdom",
} as const;

export const SITE_DESCRIPTION = {
  th: "ค้นพบพรรณไม้หลากหลายสายพันธุ์ พร้อมวิธีดูแลอย่างละเอียด ไม้มงคล และอุปกรณ์จัดสวนครบครัน",
  en: "Discover a wide range of plants with detailed care guides, lucky plants, and everything you need for your garden.",
} as const;

/** Served from public/, so it resolves against SITE_URL at build time. */
export const DEFAULT_OG_IMAGE = "/favicon.ico";

/** Routes that must never be indexed or listed in the sitemap. */
export const PRIVATE_ROUTES = ["/admin", "/tk-portal-9x7"] as const;

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
