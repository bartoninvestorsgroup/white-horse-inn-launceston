import {
  configuredSiteUrl,
  normalizeExternalUrl,
  normalizeOrigin,
  primaryLocation,
  siteConfig,
} from "@/lib/site";

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
    addressRegion: address.addressRegion,
    postalCode: address.postalCode,
    addressCountry: address.addressCountry,
  };
}

function buildOpeningHoursSpecification(openingTimes = []) {
  return openingTimes
    .filter((slot) => !slot?.isClosed && slot?.openTime && slot?.closeTime)
    .map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${slot.day}`,
      opens: slot.openTime,
      closes: slot.closeTime,
    }));
}

function buildSameAs() {
  return [
    ...Object.values(siteConfig.socialLinks || {}),
    primaryLocation.website,
    primaryLocation.googleMapsUrl,
    primaryLocation.googleReviewsUrl,
    primaryLocation.tripAdvisorUrl,
    primaryLocation.tripadvisorReviewsUrl,
    primaryLocation.socialLinks?.facebook,
    primaryLocation.socialLinks?.instagram,
    primaryLocation.socialLinks?.tiktok,
  ]
    .map(normalizeExternalUrl)
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index);
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = siteConfig.ogImage,
  imageAlt,
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
  const resolvedImageAlt = imageAlt || fullTitle;

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
          alt: resolvedImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [
        {
          url: imageUrl,
          alt: resolvedImageAlt,
        },
      ],
    },
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.businessName,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.telephone,
    address: buildPostalAddress(siteConfig.address),
    logo: absoluteUrl(siteConfig.ogImage),
    image: absoluteUrl(siteConfig.ogImage),
    hasMap: normalizeExternalUrl(primaryLocation.googleMapsUrl) || undefined,
    menu: absoluteUrl("/food"),
    acceptsReservations: true,
    servesCuisine: ["British", "Pub Food"],
    priceRange: "££",
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.6423696,
      longitude: -4.3657584,
    },
    openingHoursSpecification: buildOpeningHoursSpecification(
      primaryLocation.openingTimes,
    ),
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
    sameAs: buildSameAs(),
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
