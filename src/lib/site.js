import footerSettings from "@/data/footer-settings.json";
import locations from "@/data/locations.json";
import siteSettings from "@/data/site-settings.json";

export function normalizeOrigin(value) {
  if (!value) {
    return "";
  }

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    return "";
  }
}

export const configuredSiteUrl = normalizeOrigin(
  process.env.NEXT_PUBLIC_APP_BASE_URL ||
    process.env.APP_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
);

function normalizeExternalUrl(value) {
  if (!value) {
    return "";
  }

  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

const primaryLocation = locations[0] || {};

export const footerSocialLinks = [
  {
    name: "Facebook",
    key: "facebook",
    href: normalizeExternalUrl(primaryLocation.socialLinks?.facebook),
  },
  {
    name: "Instagram",
    key: "instagram",
    href: normalizeExternalUrl(primaryLocation.socialLinks?.instagram),
  },
  {
    name: "Google Maps",
    key: "google",
    href: normalizeExternalUrl(primaryLocation.googleMapsUrl),
  },
  {
    name: "Tripadvisor",
    key: "tripadvisor",
    href: normalizeExternalUrl(
      primaryLocation.tripAdvisorUrl || primaryLocation.tripadvisorReviewsUrl,
    ),
  },
].filter((link) => link.href);

export const siteConfig = {
  name: siteSettings.businessName,
  shortName: siteSettings.shortName,
  description: siteSettings.description,
  siteUrl: configuredSiteUrl || "http://localhost:3000",
  ogImage: "/og-default.jpg",
  businessName: siteSettings.businessName,
  email: siteSettings.email,
  telephone: siteSettings.telephone,
  address: siteSettings.address,
  socialLinks: siteSettings.socialLinks,
  footerSocialLinks,
  navItems: siteSettings.navItems,
  footerLinks: footerSettings.footerLinks,
};

export const previewBanner = null;
