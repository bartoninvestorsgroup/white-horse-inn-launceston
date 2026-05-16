import GalleryMasonry from "@/components/gallery/GalleryMasonry";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { getLocalGalleryItems } from "@/lib/content";
import { breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";

export const metadata = getPageMetadata("gallery");

export default async function GalleryPage() {
  const galleryItems = getLocalGalleryItems();
  const galleryPageSchema = [
    getPageSchema("gallery"),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Gallery", path: "/gallery" },
    ]),
  ];

  return (
    <>
      <StructuredData data={galleryPageSchema} />
      <PageIntro
        eyebrow="Gallery"
        title="Take a closer look at Barton Investors Group."
        description="Browse a curated gallery of our venues, spaces and moments, designed to showcase the character, warmth and everyday charm found across the group."
      />

      <section className="relative z-20 bg-[color:var(--color-surface)] pb-14 pt-6 md:pb-18 md:pt-8">
        <SectionReveal className="site-container px-2">
          <GalleryMasonry items={galleryItems} />
        </SectionReveal>
      </section>
    </>
  );
}
