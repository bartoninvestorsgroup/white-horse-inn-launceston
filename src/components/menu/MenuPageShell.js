import StructuredData from "@/components/seo/StructuredData";
import { breadcrumbSchema } from "@/lib/seo";
import { getPageSchema } from "@/lib/seo-config";

export default function MenuPageShell({
  seoKey,
  title,
  activeHref,
  schemaOverrides,
  children,
}) {
  const schema = [
    getPageSchema(seoKey, {}, schemaOverrides),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Food", path: "/food" },
      ...(activeHref && activeHref !== "/food"
        ? [{ name: title, path: activeHref }]
        : []),
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      {children}
    </>
  );
}
