import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";
import { breadcrumbSchema } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata = getPageMetadata("privacyPolicy");

const policySections = [
  {
    title: "Who We Are",
    body: [
      `This website is operated by ${siteConfig.businessName}. For the purposes of UK data protection law, ${siteConfig.businessName} is the data controller for the personal information collected through this website unless this policy says otherwise.`,
      `If you have questions about this policy or about how we handle personal information, you can contact us using the details below.`,
    ],
  },
  {
    title: "Contact Details",
    body: [
      `${siteConfig.businessName}`,
      siteConfig.address.streetAddress,
      siteConfig.email,
      siteConfig.telephone,
    ],
  },
  {
    title: "What Information We May Collect",
    body: [
      "We may collect your name, contact details, enquiry details, booking-related selections, technical device and browser information, cookie preferences, and any information you choose to send to us through forms or communications.",
      "If you follow a booking journey from this website to OpenTable, Booking.com, Voucher Connect, or another third-party service, you may also provide information directly to that provider. That information is collected and processed on the provider's platform under its own terms and privacy practices.",
    ],
  },
  {
    title: "How We Use Personal Information",
    body: [
      "We use personal information to operate and improve the website, respond to enquiries, manage venue and booking-related communications, maintain security, remember cookie choices, and understand how the website is used where analytics are enabled with consent.",
      "We do not use this website to complete restaurant reservations, accommodation bookings, gift card purchases, or loyalty programme activity directly. Where you choose to use those services, you may be redirected to the relevant third-party platform to complete that process.",
    ],
  },
  {
    title: "Lawful Bases",
    body: [
      "Depending on the context, we rely on one or more of the following lawful bases: consent, performance of a contract or taking steps at your request before entering into a contract, compliance with legal obligations, and our legitimate interests in operating, maintaining, and improving the website and our services.",
      "Where consent is required, such as for optional analytics cookies, you can refuse or withdraw that consent.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "We use necessary cookies to help the website function, including remembering your cookie preferences. Necessary cookies do not require opt-in consent.",
      "We may also use analytics cookies in future to understand website traffic and usage. Those analytics cookies should only be activated after you have given consent through the cookie banner or any later preference controls we introduce.",
      "You can also control cookies through your browser settings, although disabling necessary cookies may affect how the website works.",
    ],
  },
  {
    title: "Google Analytics",
    body: [
      "Google Analytics is not currently active on this website unless and until we enable it. If we do enable it, we intend to use Google Analytics 4 to help us understand aggregated website usage, measure site performance, and improve user experience.",
      "If Google Analytics is enabled in future, it will be subject to cookie consent for analytics and this policy will apply to that use. Google may process technical information such as IP-related data, device information, browser details, and on-site behaviour data in accordance with its own privacy terms.",
    ],
  },
  {
    title: "OpenTable Bookings",
    body: [
      "When you use booking links or the booking journey on this website, you are redirected to OpenTable to complete your reservation. OpenTable collects and processes the booking information required to manage that reservation.",
      `${siteConfig.businessName} may receive reservation-related details from OpenTable so that we can administer and honour bookings. OpenTable is responsible for its own platform, cookies, and reservation processing. You should review OpenTable's privacy policy before completing a booking.`,
    ],
  },
  {
    title: "Booking.com Accommodation",
    body: [
      "When you use accommodation booking links from this website, you may be redirected to Booking.com to check availability or complete a room booking. Booking.com collects and processes the information needed to manage that accommodation booking on its own platform.",
      `${siteConfig.businessName} may receive accommodation-related booking details from Booking.com so that we can administer and honour stays. Booking.com is responsible for its own platform, cookies, and booking processing. You should review Booking.com's privacy policy before completing a booking.`,
    ],
  },
  {
    title: "Voucher Connect Gift Cards and Loyalty",
    body: [
      "Where we provide links to customer loyalty, gift card, or voucher services, those services may be operated through Voucher Connect at voucherconnect.com. Voucher Connect may collect and process the information needed to issue, manage, redeem, or support vouchers, gift cards, and loyalty activity.",
      `${siteConfig.businessName} may receive voucher, gift card, or loyalty-related details from Voucher Connect where needed to administer those services. Voucher Connect is responsible for its own platform, cookies, payment flow, and processing. You should review Voucher Connect's privacy policy before using those services.`,
    ],
  },
  {
    title: "Sharing Information",
    body: [
      "We may share information with service providers who help us operate the website or related services, including hosting providers, website suppliers, analytics providers where enabled with consent, and service platforms such as OpenTable, Booking.com, and Voucher Connect.",
      "We may also disclose information where required by law or where necessary to protect legal rights, prevent fraud, or respond to security issues.",
    ],
  },
  {
    title: "International Transfers",
    body: [
      "Some website service providers may process information outside the United Kingdom. Where that happens, we expect appropriate safeguards to be used, such as standard contractual clauses or equivalent protections recognised under applicable data protection law.",
    ],
  },
  {
    title: "Retention",
    body: [
      "We keep personal information only for as long as reasonably necessary for the purposes described in this policy, including to meet legal, regulatory, tax, accounting, operational, and dispute-resolution requirements.",
    ],
  },
  {
    title: "Your Rights",
    body: [
      "Under UK data protection law, you may have rights including the right to access personal information, request correction, request deletion, object to certain processing, request restriction, request data portability in some cases, and withdraw consent where processing is based on consent.",
      "If you wish to exercise your rights, please contact us using the contact details in this policy.",
    ],
  },
  {
    title: "Complaints",
    body: [
      "If you are unhappy with how we handle personal information, we would appreciate the opportunity to address your concerns first. You also have the right to complain to the Information Commissioner's Office (ICO) in the United Kingdom.",
    ],
  },
  {
    title: "Changes To This Policy",
    body: [
      "We may update this privacy policy from time to time. Any material changes will be reflected on this page together with an updated effective date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const privacySchema = [
    getPageSchema("privacyPolicy"),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Privacy Policy", path: "/privacy-policy" },
    ]),
  ];

  return (
    <>
      <StructuredData data={privacySchema} />
      <PageIntro
        eyebrow="Privacy Policy"
        title="Privacy, cookies, and reservation data handling."
        description="This policy explains how the White Horse Inn handles website data, cookie choices, enquiries, bookings, accommodation, vouchers, gift cards, and loyalty-related services."
      />
      <section className="relative z-20 bg-[color:var(--color-surface)]">
        <SectionReveal className="site-container px-2 py-16 md:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.08em] text-[color:var(--color-copy-soft)]">
              Effective date: 11 April 2026
            </p>
            <p className="mt-6 text-lg leading-8 text-[color:var(--color-copy-soft)]">
              This privacy policy explains what personal information we collect,
              how we use it, when we may share it with trusted service providers,
              and the choices and rights available to you.
            </p>
          </div>

          <div className="mt-14 grid gap-8">
            {policySections.map((section) => (
              <section
                key={section.title}
                className="rounded-[var(--radius-panel)] border border-[color:var(--color-border-soft)] bg-[color:var(--color-surface)] p-8 shadow-[var(--shadow-card)]"
              >
                <h2 className="font-heading text-3xl text-[color:var(--color-primary)]">
                  {section.title}
                </h2>
                <div className="mt-5 space-y-4">
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-base leading-8 text-[color:var(--color-copy-soft)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
