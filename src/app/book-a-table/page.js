import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import BookATableWidget from "@/components/book/BookATableWidget";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";
import { Suspense } from "react";

export const metadata = getPageMetadata("bookATable");

const reservationSchema = {
  ...getPageSchema("bookATable"),
  potentialAction: {
    "@type": "ReserveAction",
    target: absoluteUrl("/book-a-table"),
  },
};

export default function BookATablePage() {
  const schema = [
    reservationSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Book a Table", path: "/book-a-table" },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <PageIntro
        eyebrow="Book a Table"
        title="Book a table at the White Horse Inn."
        description="Call us directly or send a table booking enquiry and the team will help with availability."
      />
      <Suspense fallback={null}>
        <SectionReveal>
          <BookATableWidget />
        </SectionReveal>
      </Suspense>
    </>
  );
}
