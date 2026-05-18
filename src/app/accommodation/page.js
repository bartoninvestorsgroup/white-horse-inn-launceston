import SimpleInfoPage from "@/components/layout/SimpleInfoPage";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("accommodation");

export default function AccommodationPage() {
  return (
    <SimpleInfoPage
      seoKey="accommodation"
      eyebrow="Accommodation"
      title="Accommodation"
      description="Stay at the White Horse Inn in Launceston, with comfortable rooms above a welcoming pub."
    >
      <p>
        Accommodation details, room information, and booking guidance will be added here.
      </p>
    </SimpleInfoPage>
  );
}
