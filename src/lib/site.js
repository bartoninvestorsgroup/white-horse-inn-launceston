import footerSettings from "@/data/footer-settings.json";
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
  navItems: siteSettings.navItems,
  footerLinks: footerSettings.footerLinks,
};

export const previewBanner = null;
