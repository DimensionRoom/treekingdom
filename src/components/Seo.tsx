import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl, metaDescription } from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  /** Absolute or site-relative (e.g. a storage path already resolved to a URL). */
  image?: string;
  /** Kept out of search results and the sitemap — used for /admin, auth, 404. */
  noindex?: boolean;
  /** One or more JSON-LD objects, e.g. Product, Article, BreadcrumbList. */
  jsonLd?: object | object[];
  /** Overrides the canonical path, which is otherwise the bare pathname —
   *  used when a query string names distinct content (?variety=). */
  canonicalPath?: string;
  /** og:type; "website" unless the page is one product or one article. */
  ogType?: "website" | "product" | "article";
}

/**
 * The one place that knows how to build a page's <head>. scripts/seoPlugin.ts
 * mirrors this shape when prerendering per-route <head> markup after build —
 * keep the two in sync if this changes.
 */
const Seo = ({ title, description: fullDescription, image, noindex, jsonLd, canonicalPath, ogType = "website" }: SeoProps) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const canonical = absoluteUrl(canonicalPath ?? location.pathname);
  const description = metaDescription(fullDescription);
  const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const jsonLdList = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet htmlAttributes={{ lang }}>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:locale" content={lang === "th" ? "th_TH" : "en_US"} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdList.map((obj, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
