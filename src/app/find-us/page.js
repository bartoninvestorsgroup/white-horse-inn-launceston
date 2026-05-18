import SimpleInfoPage from "@/components/layout/SimpleInfoPage";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("findUs");

export default function FindUsPage() {
  return (
    <SimpleInfoPage
      seoKey="findUs"
      eyebrow="Find Us"
      title="Find Us"
      description="Find the White Horse Inn in Launceston and plan your visit."
    >
      <div className="space-y-5">
        <p>
          White Horse Inn, 14 Newport Square, Launceston, PL15 8EL.
        </p>
        <a
          href="https://www.google.com/maps/search/?api=1&query=White%20Horse%20Inn%2014%20Newport%20Square%20Launceston%20PL15%208EL"
          target="_blank"
          rel="noopener noreferrer"
          className="link-button"
        >
          Open directions in Google Maps
        </a>
      </div>
    </SimpleInfoPage>
  );
}
