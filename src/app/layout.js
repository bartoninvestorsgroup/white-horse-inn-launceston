import { headers } from "next/headers";
import {
  Caladea,
  Luckiest_Guy,
  Love_Ya_Like_A_Sister,
  Montserrat,
} from "next/font/google";
import "./globals.css";
import SiteFrame from "@/components/layout/SiteFrame";
import StructuredData from "@/components/seo/StructuredData";
import { getLocalFooterSettings } from "@/lib/content";
import { buildMetadata, organizationSchema, websiteSchema } from "@/lib/seo";
import { previewBanner, siteConfig } from "@/lib/site";
import { getActiveSiteBanners } from "@/sanity/lib/queries";

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-caladea",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-luckiest-guy",
  display: "swap",
});

const loveYaLikeASister = Love_Ya_Like_A_Sister({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-love-ya-like-a-sister",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    siteConfig.siteUrl.startsWith("http")
      ? siteConfig.siteUrl
      : `https://${siteConfig.siteUrl}`,
  ),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: [{ url: "/favicon.ico" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  ...buildMetadata(),
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const initialPathname = requestHeaders.get("x-pathname") || "/";
  const sanityBanners = await getActiveSiteBanners();
  const banners = sanityBanners?.length
    ? sanityBanners
    : previewBanner
      ? [previewBanner]
      : [];
  const footerSettings = getLocalFooterSettings();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${caladea.variable} ${montserrat.variable} ${luckiestGuy.variable} ${loveYaLikeASister.variable} antialiased`}
    >
      <body className="bg-[color:var(--color-surface)] text-[color:var(--color-primary)]">
        <StructuredData data={organizationSchema()} />
        <StructuredData data={websiteSchema()} />
        <SiteFrame
          banners={banners}
          footerSettings={footerSettings}
          initialPathname={initialPathname}
        >
          {children}
        </SiteFrame>
      </body>
    </html>
  );
}
