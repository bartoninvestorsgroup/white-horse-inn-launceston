import Link from "next/link";
import SectionReveal from "@/components/layout/SectionReveal";

export default function SiteFooter({
  footerLinks,
  socialLinks,
  address,
  email,
  telephone,
  eyebrow = "White Horse Inn",
  title = "Food, drink, rooms and gatherings in the heart of Launceston.",
  description = "A welcoming pub with seasonal menus, comfortable accommodation, function room hire and easy table bookings.",
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 bg-[color:var(--color-primary)] text-white">
      <SectionReveal className="site-container grid gap-12 px-2 py-16 md:grid-cols-[1.35fr_0.85fr_0.8fr]">
        <div className="space-y-5">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="font-heading text-3xl leading-tight text-white">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-white/74">
            {description}
          </p>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Explore</p>
          <div className="flex flex-col gap-3">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="footer-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className="eyebrow">Contact</p>
          <div className="space-y-3 text-white/82">
            <p>{address.streetAddress}</p>
            <p>{address.addressLocality}</p>
            <Link href="/contact?enquiryType=General+Enquiry" className="footer-link">
              {email}
            </Link>
            <br></br>
            <a href={`tel:${telephone}`} className="footer-link">
              {telephone}
            </a>
          </div>
          {/* <div className="flex flex-wrap gap-4 pt-3">
            {Object.entries(socialLinks).map(([name, href]) => (
              <a key={name} href={href} className="footer-link capitalize">
                {name}
              </a>
            ))}
          </div> */}
        </div>
      </SectionReveal>
      <div>
        <SectionReveal
          className="site-container flex flex-col items-center justify-center gap-2 px-2 py-4 text-center md:flex-row md:gap-4"
          delay={0.08}
        >
          <p className="text-sm text-white/72">
            © {currentYear} All rights reserved.
          </p>
          <a
            href="https://www.datopia.co.uk/?utm_source=whitehorseinnlaunceston&utm_medium=referral&utm_campaign=footer_credit"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link text-sm"
          >
            Website Design by Datopia
          </a>
        </SectionReveal>
      </div>
    </footer>
  );
}
