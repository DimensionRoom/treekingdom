import type { Plugin, ResolvedConfig } from "vite";
import fs from "node:fs/promises";
import path from "node:path";
import {
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_PUBLISHABLE_KEY,
  STORAGE_BUCKET,
} from "../src/integrations/supabase-external/config";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, PRIVATE_ROUTES, absoluteUrl, metaDescription } from "../src/lib/site";

/**
 * Runs after `vite build` (via closeBundle, once dist/ has been written) to:
 *   1. write dist/sitemap.xml (plants, their varieties, products, static pages)
 *   2. write dist/robots.txt, pointing at that sitemap on SITE_URL
 *   3. prerender <head> for every public route into dist/<route>/index.html
 *
 * This deliberately does NOT snapshot the rendered <body> with a headless
 * browser: the app's page-entry animations (gsap.from(..., { opacity: 0 }))
 * set opacity:0 inline before animating in, so a DOM snapshot taken at the
 * wrong instant would ship invisible content to anyone without JS — worse
 * than not prerendering. Only <head> is rewritten; <body> still renders
 * client-side, which Googlebot executes fine and which react-helmet-async
 * (src/components/Seo.tsx) already keeps correct for JS-capable crawlers.
 * Non-JS crawlers (Facebook/LINE link previews) are the ones this file is for.
 */

type Row = {
  id: string;
  name: { th: string; en: string };
  description: { th: string; en: string };
  images: string[];
  updated_at?: string | null;
  created_at?: string | null;
  // plant_varieties only
  plant_id?: string;
  parent_variety_id?: string | null;
};

const publicImageUrl = (path: string) =>
  path.startsWith("http") ? path : `${EXTERNAL_SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`;

async function fetchRows(table: string, select: string): Promise<Row[]> {
  try {
    const res = await fetch(`${EXTERNAL_SUPABASE_URL}/rest/v1/${table}?select=${select}&order=sort_order`, {
      headers: {
        apikey: EXTERNAL_SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${EXTERNAL_SUPABASE_PUBLISHABLE_KEY}`,
      },
    });
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status}`);
    return (await res.json()) as Row[];
  } catch (err) {
    console.warn(`[seo] Could not fetch "${table}" — sitemap/prerender for it will be skipped.`, err);
    return [];
  }
}

interface HeadData {
  routePath: string; // e.g. "/plants/monstera"
  title: string;
  description: string;
  image?: string; // absolute or site-relative; falls back to the template's own og:image otherwise
  ogType?: "website" | "product" | "article";
  /** ISO timestamp for the sitemap's <lastmod>. */
  lastmod?: string | null;
}

/** Static, public, content-bearing routes. Keep in sync with each page's own <Seo> call. */
const STATIC_HEADS: HeadData[] = [
  { routePath: "/", title: SITE_TITLE.th, description: SITE_DESCRIPTION.th },
  {
    routePath: "/plants",
    title: "พรรณไม้ทั้งหมด | TreeKingdom",
    description: "เลือกชมพรรณไม้หลากหลายชนิด พร้อมข้อมูลการดูแลครบถ้วน",
  },
  {
    routePath: "/categories",
    title: "สินค้าและอุปกรณ์ทั้งหมด | TreeKingdom",
    description: "เลือกซื้อต้นไม้ ปุ๋ย กระถาง และอุปกรณ์จัดสวนครบครัน",
  },
  {
    routePath: "/lucky",
    title: "ไม้มงคล | TreeKingdom",
    description: "เลือกต้นไม้มงคลตามดวง เสริมพลังและความเป็นสิริมงคลให้กับชีวิต",
  },
  {
    routePath: "/personality",
    title: "ค้นหาบุคลิกภาพต้นไม้ของคุณ | TreeKingdom",
    description: "ทำแบบทดสอบเพื่อค้นหาต้นไม้ที่เหมาะกับไลฟ์สไตล์ของคุณ",
  },
];

/** Replace/insert the tags Seo.tsx renders client-side, leaving everything else untouched. */
function injectHead(template: string, head: HeadData): string {
  const canonical = absoluteUrl(head.routePath);
  const image = head.image ? absoluteUrl(head.image) : undefined;
  const description = metaDescription(head.description);
  let html = template;

  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(head.title)}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${canonical}" />`);
  html = html.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(head.title)}" />`);
  html = html.replace(
    /<meta property="og:description" content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = html.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${canonical}" />`);
  html = html.replace(/<meta property="og:type" content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${head.ogType ?? "website"}" />`);
  if (image) {
    html = html.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${image}" />`);
    html = html.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${image}" />`);
  }
  html = html.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(head.title)}" />`);
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );

  return html;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function writeRouteHtml(outDir: string, routePath: string, html: string) {
  const target = routePath === "/" ? path.join(outDir, "index.html") : path.join(outDir, routePath, "index.html");
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, "utf-8");
}

type SitemapEntry = { path: string; lastmod?: string | null };

function sitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const lastmod = e.lastmod ? `<lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : "";
      return `  <url><loc>${escapeHtml(absoluteUrl(e.path))}</loc>${lastmod}</url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** Generated rather than kept in public/, so its Sitemap line can't drift from SITE_URL. */
function robotsTxt(): string {
  const disallow = PRIVATE_ROUTES.map((r) => `Disallow: ${r}`).join("\n");
  return `User-agent: *\nAllow: /\n${disallow}\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

export function seoPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "treekingdom-seo",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      const outDir = path.isAbsolute(config.build.outDir)
        ? config.build.outDir
        : path.resolve(config.root, config.build.outDir);

      const templatePath = path.join(outDir, "index.html");
      let template: string;
      try {
        template = await fs.readFile(templatePath, "utf-8");
      } catch {
        console.warn(`[seo] ${templatePath} not found — skipping sitemap/prerender.`);
        return;
      }

      const [plants, supplies, varieties] = await Promise.all([
        // "*" rather than naming is_published: before visibility-external.sql
        // is run that column doesn't exist, and asking for it would fail the
        // whole request and silently empty the sitemap.
        fetchRows("plants", "*"),
        fetchRows("supplies", "*"),
        fetchRows("plant_varieties", "*"),
      ]).then((tables) =>
        // Hidden in the admin means gone from the sitemap and the prerendered
        // pages too; undefined (column not added yet) counts as visible.
        tables.map((rows) => rows.filter((r) => (r as { is_published?: boolean }).is_published !== false)),
      );

      const plantHeads: HeadData[] = plants.map((p) => ({
        routePath: `/plants/${p.id}`,
        title: `${p.name.th} — วิธีดูแล | ${SITE_NAME}`,
        description: p.description.th,
        image: p.images?.[0] ? publicImageUrl(p.images[0]) : undefined,
        ogType: "article",
        lastmod: p.updated_at ?? p.created_at,
      }));

      const supplyHeads: HeadData[] = supplies.map((s) => ({
        routePath: `/categories/${s.id}`,
        title: `${s.name.th} | ${SITE_NAME}`,
        description: s.description.th,
        image: s.images?.[0] ? publicImageUrl(s.images[0]) : undefined,
        ogType: "product",
        lastmod: s.updated_at ?? s.created_at,
      }));

      // A variety is its plant's page with ?variety= (PlantDetailPage gives it
      // its own title and canonical). Only top-level varieties open a sheet,
      // and only those of a visible plant are reachable. Sitemap-only: a query
      // string can't have its own prerendered file.
      const visiblePlantIds = new Set(plants.map((p) => p.id));
      const varietyEntries: SitemapEntry[] = varieties
        .filter((v) => !v.parent_variety_id && v.plant_id && visiblePlantIds.has(v.plant_id))
        .map((v) => ({
          path: `/plants/${v.plant_id}?variety=${encodeURIComponent(v.id)}`,
          lastmod: v.updated_at ?? v.created_at,
        }));

      const allHeads = [...STATIC_HEADS, ...plantHeads, ...supplyHeads];

      await Promise.all(allHeads.map((head) => writeRouteHtml(outDir, head.routePath, injectHead(template, head))));

      const entries: SitemapEntry[] = [
        ...allHeads.map((h) => ({ path: h.routePath, lastmod: h.lastmod })),
        ...varietyEntries,
      ].filter((e) => !PRIVATE_ROUTES.some((priv) => e.path === priv || e.path.startsWith(`${priv}/`)));
      await fs.writeFile(path.join(outDir, "sitemap.xml"), sitemapXml(entries), "utf-8");
      await fs.writeFile(path.join(outDir, "robots.txt"), robotsTxt(), "utf-8");

      console.log(
        `[seo] Wrote sitemap.xml (${entries.length} urls), robots.txt, and prerendered <head> for ${allHeads.length} routes.`,
      );
    },
  };
}
