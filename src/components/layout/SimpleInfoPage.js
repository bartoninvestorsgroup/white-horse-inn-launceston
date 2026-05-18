import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { breadcrumbSchema } from "@/lib/seo";
import { getPageSchema } from "@/lib/seo-config";

export default function SimpleInfoPage({
  seoKey,
  eyebrow,
  title,
  description,
  children,
}) {
  const schema = [
    getPageSchema(seoKey),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: title, path: getPageSchema(seoKey).url },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <PageIntro eyebrow={eyebrow} title={title} description={description} />
      <section className="relative z-20 bg-[color:var(--color-surface)] py-16 md:py-20">
        <SectionReveal className="site-container px-2">
          <div className="max-w-3xl border border-[color:var(--color-border-soft)] bg-[color:var(--muted)] p-6 text-lg leading-8 text-[color:var(--color-copy-soft)] md:p-8">
            {children}
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
