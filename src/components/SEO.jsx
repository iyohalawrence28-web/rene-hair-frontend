import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ms.Fabulux Hairs";
const SITE_URL = "https://msfabulux.com";
const DEFAULT_IMAGE = "https://msfabulux.com/logo.png";
const PHONE = "+359879219665";

export default function SEO({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = "website",
  product = null,
  lang = "en",
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Premium Lace Wigs in Sofia, Bulgaria`;

  const fullCanonical = canonical
    ? `${SITE_URL}${canonical}`
    : SITE_URL;

  const fullDescription = description ||
    "Shop premium human hair lace wigs at Ms.Fabulux Hairs. Luxury body wave, straight, curly and deep wave lace wigs delivered across Bulgaria. AI Try-On available.";

  // Product JSON-LD
  const productSchema = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || fullDescription,
    "image": product.images?.[0]?.startsWith("http")
      ? product.images[0]
      : `${SITE_URL}${product.images?.[0] || ""}`,
    "brand": { "@type": "Brand", "name": SITE_NAME },
    "sku": product._id,
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/product/${product.slug || product._id}`,
      "priceCurrency": "USD",
      "price": product.price,
      "availability": product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": { "@type": "Organization", "name": SITE_NAME }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "50"
    }
  } : null;

  // Breadcrumb JSON-LD
  const breadcrumbSchema = product ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": SITE_URL },
      { "@type": "ListItem", "position": 2, "name": "Shop", "item": `${SITE_URL}/#shop` },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": `${SITE_URL}/product/${product.slug || product._id}` }
    ]
  } : null;

  return (
    <Helmet>
      {/* Basic */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={fullCanonical} />

      {/* hreflang */}
      <link rel="alternate" hreflang="en" href={fullCanonical} />
      <link rel="alternate" hreflang="bg" href={fullCanonical} />
      <link rel="alternate" hreflang="x-default" href={SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={lang === "bg" ? "bg_BG" : "en_GB"} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={image} />

      {/* Product JSON-LD */}
      {productSchema && (
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
      )}

      {/* Breadcrumb JSON-LD */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  );
}