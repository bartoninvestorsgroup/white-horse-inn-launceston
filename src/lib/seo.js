import { configuredSiteUrl, normalizeOrigin, siteConfig } from "@/lib/site";

export function originFromHeaders(headersList) {
  if (!headersList) {
    return "";
  }

  const forwardedHost = headersList.get("x-forwarded-host");
  const host = forwardedHost || headersList.get("host");

  if (!host) {
    return "";
  }

  const forwardedProto = headersList.get("x-forwarded-proto") || "https";

  return normalizeOrigin(`${forwardedProto}://${host}`);
}

export function absoluteUrl(path = "/", headersList) {
  const baseUrl =
    configuredSiteUrl ||
    originFromHeaders(headersList) ||
    normalizeOrigin(siteConfig.siteUrl) ||
    "http://localhost:3000";

  return new URL(path, baseUrl).toString();
}

function buildPostalAddress(address = {}) {
  if (!address) {
    return undefined;
  }

  return {
    "@type": "PostalAddress",
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    postalCode: address.postalCode,
    addressCountry: address.addressCountry,
  };
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.ogImage,
  appendSiteName = true,
} = {}) {
  const fullTitle = title
    ? appendSiteName
      ? `${title} | ${siteConfig.name}`
      : title
    : siteConfig.name;
  const resolvedDescription = description || siteConfig.description;
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: fullTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: "en_GB",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.businessName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    address: buildPostalAddress(siteConfig.address),
    logo: absoluteUrl(siteConfig.ogImage),
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.telephone,
        email: siteConfig.email,
        contactType: "customer service",
        areaServed: "GB",
        availableLanguage: "en-GB",
      },
    ],
    sameAs: Object.values(siteConfig.socialLinks).filter(
      (value) => value && value !== "#",
    ),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: "en-GB",
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  };
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageSchema(faqs = []) {
  const mainEntity = faqs
    .filter((faq) => faq?.question && faq?.answer)
    .map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    }));

  if (!mainEntity.length) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}
