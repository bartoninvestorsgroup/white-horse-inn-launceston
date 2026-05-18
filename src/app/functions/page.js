import SimpleInfoPage from "@/components/layout/SimpleInfoPage";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("functions");

export default function FunctionsPage() {
  return (
    <SimpleInfoPage
      seoKey="functions"
      eyebrow="Functions"
      title="Function Room Hire"
      description="Hire our large function room for private events, celebrations, meetings, and local gatherings."
    >
      <p>
        Function room details, capacity, facilities, and enquiry information will be added here.
      </p>
    </SimpleInfoPage>
  );
}
