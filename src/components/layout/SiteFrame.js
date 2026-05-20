"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import CookieConsentBanner from "@/components/layout/CookieConsentBanner";
import SiteBanner from "@/components/layout/SiteBanner";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteNavbar from "@/components/layout/SiteNavbar";
import ViewportMetaFix from "@/components/layout/ViewportMetaFix";
import { siteConfig } from "@/lib/site";

export default function SiteFrame({
  banners,
  children,
  footerSettings,
  initialPathname = "/",
}) {
  const pathname = usePathname() || initialPathname;
  const isStudioRoute = pathname?.startsWith("/studio");
  const hasBanner = Array.isArray(banners) && banners.length > 0;
  const [isBannerVisible, setIsBannerVisible] = useState(hasBanner);
  const bannerOffset = isBannerVisible ? "34px" : "0px";

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <div style={{ "--site-banner-offset": bannerOffset }}>
      <SiteBanner banners={banners} onVisibilityChange={setIsBannerVisible} />
      <ViewportMetaFix />
      <SiteNavbar
        navItems={siteConfig.navItems}
        initialPathname={initialPathname}
      />
      <main className="flex-1 pt-[var(--site-banner-offset)] transition-[padding] duration-300 ease-out">
        {children}
      </main>
      <SiteFooter
        footerLinks={footerSettings?.footerLinks || siteConfig.footerLinks}
        socialLinks={siteConfig.footerSocialLinks}
        address={siteConfig.address}
        email={siteConfig.email}
        telephone={siteConfig.telephone}
        eyebrow={footerSettings?.eyebrow}
        title={footerSettings?.title}
        description={footerSettings?.description}
      />
      <CookieConsentBanner />
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
