"use client";

import { Mail, Phone } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "";
const tableBookingEnquiryHref = "/contact?enquiryType=Table+Booking+Enquiry";

export default function BookATableWidget({ live = true }) {
  if (!live) {
    return null;
  }

  const hasBookingUrl = Boolean(bookingUrl);

  return (
    <section className="pb-20 md:pb-24">
      <div className="site-container px-1">
        <div className="border border-[color:var(--color-gold)] bg-[color:var(--color-primary)] p-5 sm:p-7 lg:p-8">
          <div className="mx-auto grid max-w-[66rem] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="eyebrow">Book a Table</p>
              <h2 className="mt-3 font-heading text-[2rem] leading-[1.05] text-[color:var(--color-gold)] md:text-[2.5rem]">
                Reserve a table at White Horse Inn
              </h2>
              <p className="mt-4 max-w-[42rem] text-base leading-7 text-white/88">
                For table bookings, call us directly or send an enquiry and our
                team will help with availability.
              </p>

              <div className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                {hasBookingUrl ? (
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "brandCta", size: "hero" }),
                      "w-full sm:w-auto",
                    )}
                  >
                    Book Online
                  </a>
                ) : null}
                <a
                  href={`tel:${siteConfig.telephone}`}
                  className={cn(
                    buttonVariants({ variant: "brandCta", size: "hero" }),
                    "w-full sm:w-auto",
                  )}
                >
                  Call to Book
                </a>
                <a
                  href={tableBookingEnquiryHref}
                  className="link-button link-button-on-primary"
                >
                  Email Enquiry
                </a>
              </div>
            </div>

            <div className="border border-white/14 bg-white/6 p-5 text-white/86">
              <div className="grid gap-4">
                <div className="flex gap-3">
                  <Phone className="mt-1 size-4 shrink-0 text-[color:var(--color-gold-soft)]" />
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[color:var(--color-gold-soft)]">
                      Phone
                    </p>
                    <a href={`tel:${siteConfig.telephone}`} className="footer-link">
                      {siteConfig.telephone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="mt-1 size-4 shrink-0 text-[color:var(--color-gold-soft)]" />
                  <div>
                    <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[color:var(--color-gold-soft)]">
                      Email
                    </p>
                    <a href={tableBookingEnquiryHref} className="footer-link">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
