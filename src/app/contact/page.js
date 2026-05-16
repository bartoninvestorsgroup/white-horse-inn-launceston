import { Suspense } from "react";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import ContactFormSection from "@/components/contact/ContactFormSection.jsx";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";

export const metadata = getPageMetadata("contact");

const contactSchema = {
  ...getPageSchema("contact"),
  mainEntity: {
    "@type": "Organization",
    name: "Barton Investors Group",
    url: absoluteUrl("/"),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: absoluteUrl("/contact"),
    },
  },
  potentialAction: {
    "@type": "CommunicateAction",
    target: absoluteUrl("/contact"),
  },
};

export default function ContactPage() {
  const schema = [
    contactSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: "/contact" },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />

      <PageIntro
        eyebrow="Contact Us"
        title="Get in touch with our teams."
        description="Whether it is a venue query, media request, partnership opportunity, or general feedback, this form gives you a direct route in."
      />

      <Suspense fallback={null}>
        <SectionReveal>
          <ContactFormSection />
        </SectionReveal>
      </Suspense>
    </>
  );
}
