import Link from "next/link";
import FaqSection from "@/components/layout/FaqSection";
import SimpleInfoPage from "@/components/layout/SimpleInfoPage";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("accommodation");

const accommodationFaqs = [
  {
    question: "Where can I stay in Launceston, Cornwall?",
    answer:
      "If you are looking for somewhere to stay in Launceston, Cornwall, The White Horse Inn offers comfortable accommodation with the convenience of a [pub and restaurant on site](/food). It is a practical choice for visitors, workers, families, and anyone looking for a relaxed place to stay locally.",
  },
  {
    question: "Is there pub accommodation in Launceston?",
    answer:
      "Yes. The White Horse Inn provides pub accommodation in Launceston, giving guests somewhere to eat, drink, and stay under one roof. It is ideal for people who prefer the character and convenience of a local inn rather than a larger hotel. You can [contact us about accommodation](/contact?enquiryType=Accommodation%20Enquiry) before you visit.",
  },
  {
    question: "What is a good place to stay near Launceston town centre?",
    answer:
      "The White Horse Inn is a convenient place to stay in Launceston, with access to the town, local routes, nearby countryside, and the wider Cornwall and Devon border area. It is suited to short stays, overnight stops, and weekend visits. See where we are on the [find us page](/find-us).",
  },
  {
    question: "Where can I stay near the Devon and Cornwall border?",
    answer:
      "Launceston is close to the Devon and Cornwall border, making The White Horse Inn a useful base for exploring both counties. Guests can stay locally while visiting nearby towns, countryside, coastlines, attractions, or family in the area. You can use our [Launceston location details](/find-us) to plan your route.",
  },
  {
    question: "Is there accommodation in Launceston with food and drink on site?",
    answer:
      "Yes. The White Horse Inn offers accommodation with food and drink available on site, subject to food service times and table availability. It is a convenient option for guests who want to stay somewhere with a proper pub atmosphere and freshly prepared food nearby. View our [food and drink information](/food) or [book a table](/book-a-table).",
  },
  {
    question: "Where can I stay in Launceston for a short break?",
    answer:
      "The White Horse Inn is suitable for short breaks in Launceston, whether you are visiting for a weekend, exploring Cornwall, seeing family, attending an event, or stopping overnight while travelling. You can [contact the team](/contact?enquiryType=Accommodation%20Enquiry) to ask about stay options.",
  },
  {
    question: "Is Launceston a good base for visiting Cornwall and Devon?",
    answer:
      "Yes. Launceston is well placed for exploring North Cornwall, West Devon, Bodmin Moor, Dartmoor, and the surrounding countryside. Staying in Launceston can be a practical option for visitors who want access to both Cornwall and Devon. Start with our [find us page](/find-us) for local details.",
  },
  {
    question: "Are there places to stay in Launceston for work trips?",
    answer:
      "Yes. The White Horse Inn can be a practical accommodation option for people visiting Launceston for work, trade visits, meetings, local projects, or short business stays. Please [send an accommodation enquiry](/contact?enquiryType=Accommodation%20Enquiry) to check availability.",
  },
  {
    question: "Can I stay overnight near a function or family event in Launceston?",
    answer:
      "Yes. If you are attending a family gathering, private event, wedding, wake, or local celebration in or around Launceston, The White Horse Inn may be a convenient place to stay overnight, subject to room availability. You can also view our [function room information](/functions).",
  },
  {
    question: "How do I book accommodation in Launceston?",
    answer:
      "Full online booking details for The White Horse Inn are being prepared. For now, guests looking for accommodation in Launceston can [contact the team directly](/contact?enquiryType=Accommodation%20Enquiry) to ask about room availability, facilities, and stay options.",
  },
];

export default function AccommodationPage() {
  return (
    <>
      <SimpleInfoPage
        seoKey="accommodation"
        eyebrow="Accommodation"
        title="Stay at The White Horse Inn, Launceston"
        description="Comfortable accommodation in the heart of Launceston, with food, drink, and hospitality all under one roof."
      >
        <div className="space-y-6">
          <p>
            The White Horse Inn offers comfortable accommodation in the heart of
            Launceston, making it a convenient place to stay whether you are
            visiting Cornwall for work, a short break, a family occasion, or a
            longer trip around the local area.
          </p>

          <p>
            Set above and alongside a welcoming{" "}
            <Link href="/food" className="footer-link">
              pub and restaurant
            </Link>
            , our rooms give guests an easy base with food, drink, and
            hospitality all under one roof. Whether you are looking for a simple
            overnight stay, a weekend stopover, or somewhere practical while
            visiting friends, family, or local attractions, The White Horse Inn
            offers a friendly and relaxed setting.
          </p>

          <p>
            We are currently preparing full accommodation details, including room
            information, images, facilities, and booking options. In the
            meantime, guests are welcome to{" "}
            <Link
              href="/contact?enquiryType=Accommodation%20Enquiry"
              className="footer-link"
            >
              contact us directly
            </Link>{" "}
            to ask about room availability, stays, and upcoming bookings.
          </p>

          <p>
            The White Horse Inn is well placed for exploring Launceston and the
            surrounding area, including nearby countryside, local heritage sites,
            walking routes, and the wider Devon and Cornwall border. With good
            honest food, quality local ingredients, a proper pub atmosphere, and
            comfortable rooms, it is a practical and welcoming choice for
            visitors looking to stay locally. You can also{" "}
            <Link href="/find-us" className="footer-link">
              find us in Launceston
            </Link>{" "}
            before travelling.
          </p>
        </div>
      </SimpleInfoPage>

      <FaqSection
        faqs={accommodationFaqs}
        eyebrow="Accommodation FAQs"
        title="Accommodation questions answered."
      />
    </>
  );
}
