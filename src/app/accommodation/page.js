import PremiumPlaceholderPage from "@/components/layout/PremiumPlaceholderPage";
import { placeholderServicePages } from "@/data/placeholder-service-pages";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("accommodation");

export default function AccommodationPage() {
  return <PremiumPlaceholderPage page={placeholderServicePages.accommodation} />;
}
