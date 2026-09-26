/**
 * Single source of truth for anything that needs the site's public identity.
 * Both the React app and scripts/seoPlugin.ts read from here — never hardcode
 * the origin anywhere else, or canonical/og:url/sitemap will drift apart.
 */

// The live Vercel domain until a custom one exists — then change it here.
// Everything else derives from this: canonical links, og:url, the sitemap and
// robots.txt's Sitemap line (both written by scripts/seoPlugin.ts).
export const SITE_URL = "https://treekingdom-nine.vercel.app";

export const SITE_NAME = "TreeKingdom";

/** The shop's LINE Official Account, used by the footer and the order buttons. */
export const LINE_OA_ID = "@treekingdom";
/** The account's own short link (from LINE Official Account Manager). */
export const LINE_OA_URL = "https://lin.ee/OPCelCa";

export const SITE_TITLE = {
  th: "TreeKingdom — อาณาจักรแห่งต้นไม้",
  en: "TreeKingdom — The Tree Kingdom",
} as const;

export const SITE_DESCRIPTION = {
  th: "ค้นพบพรรณไม้หลากหลายสายพันธุ์ พร้อมวิธีดูแลอย่างละเอียด ไม้มงคล และอุปกรณ์จัดสวนครบครัน",
  en: "Discover a wide range of plants with detailed care guides, lucky plants, and everything you need for your garden.",
} as const;

/** Served from public/, so it resolves against SITE_URL at build time. The
 *  homepage illustration: link previews (LINE, Facebook) need a real picture —
 *  the favicon they used to get rendered as a blurry 16px square. */
export const DEFAULT_OG_IMAGE = "/images/home-hero-supplied.png";

/** Public profiles, for the Organization structured data on the homepage. */
export const SOCIAL_PROFILES = ["https://lin.ee/OPCelCa", "https://www.tiktok.com/@tree_kingdom"] as const;

/**
 * Trims text to a search-snippet-sized meta description. Google cuts snippets
 * at roughly 155 characters; Thai has no spaces between words, so the cut
 * falls back to the last space (Thai phrase break) before the limit, and to a
 * hard cut only when there is none.
 */
export const metaDescription = (text: string | null | undefined, max = 155): string => {
  const clean = (text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trim()}…`;
};

/** Routes that must never be indexed or listed in the sitemap. */
export const PRIVATE_ROUTES = ["/admin", "/tk-portal-9x7"] as const;

export const absoluteUrl = (path: string) =>
  path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
