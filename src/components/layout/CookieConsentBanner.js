"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  defaultConsent,
  readConsentCookie,
  writeConsentCookie,
} from "@/lib/consent";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(null);

  useEffect(() => {
    const existingConsent = readConsentCookie();
    const frame = window.requestAnimationFrame(() => {
      setVisible(!existingConsent);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (visible !== true) {
    return null;
  }

  const handleNecessaryOnly = () => {
    writeConsentCookie({
      ...defaultConsent,
      analytics: false,
    });
    setVisible(false);
  };

  const handleAcceptAll = () => {
    writeConsentCookie({
      ...defaultConsent,
      analytics: true,
    });
    setVisible(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] px-2 pb-4">
      <div className="site-container">
        <div className="rounded-[1.4rem] border border-[color:rgba(var(--color-gold-rgb),0.32)] bg-[color:rgba(var(--color-primary-rgb),0.92)] px-5 py-5 text-white shadow-[var(--shadow-lifted)] backdrop-blur-xl md:px-7 md:py-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow text-[color:var(--color-gold)]">
                Cookies & Privacy
              </p>
              <h2 className="mt-3 font-heading text-2xl text-white md:text-3xl">
                We use necessary cookies and may later use analytics cookies with your
                consent.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/78 md:text-base">
                Necessary cookies help the site function. If analytics are enabled in
                future, they will only be used after consent. You can read more in our{" "}
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="min-h-[60px] border-white/18 bg-white/6 px-6 text-white hover:bg-white/10 hover:text-white"
                onClick={handleNecessaryOnly}
              >
                Use Necessary Only
              </Button>
              <Button
                type="button"
                variant="brandCta"
                size="nav"
                className="px-6"
                onClick={handleAcceptAll}
              >
                Accept All Cookies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
