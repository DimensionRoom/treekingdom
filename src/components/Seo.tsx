import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  /** Absolute or site-relative (e.g. a storage path already resolved to a URL). */
  image?: string;
  /** Kept out of search results and the sitemap — used for /admin, auth, 404. */
  noindex?: boolean;
  /** One or more JSON-LD objects, e.g. Product, Article, BreadcrumbList. */
  jsonLd?: object | object[];
}

/**
 * The one place that knows how to build a page's <head>. scripts/seoPlugin.ts
 * mirrors this shape when prerendering per-route <head> markup after build —
 * keep the two in sync if this changes.
 */
const Seo = ({ title, description, image, noindex, jsonLd }: SeoProps) => {
  const { lang } = useLanguage();
  const location = useLocation();
  const canonical = absoluteUrl(location.pathname);
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
      <meta property="og:type" content="website" />
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
