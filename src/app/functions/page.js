import PremiumPlaceholderPage from "@/components/layout/PremiumPlaceholderPage";
import { placeholderServicePages } from "@/data/placeholder-service-pages";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("functions");

export default function FunctionsPage() {
  return <PremiumPlaceholderPage page={placeholderServicePages.functions} />;
}
