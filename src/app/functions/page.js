import Link from "next/link";
import FaqSection from "@/components/layout/FaqSection";
import SimpleInfoPage from "@/components/layout/SimpleInfoPage";
import { getPageMetadata } from "@/lib/seo-config";

export const metadata = getPageMetadata("functions");

const functionFaqs = [
  {
    question: "Where can I hire a function room in Launceston?",
    answer:
      "The White Horse Inn offers a function room in Launceston for private events, local gatherings, family celebrations, meetings, wakes, and community occasions. Guests can [contact the team directly](/contact?enquiryType=Function%20Room%20Enquiry) to discuss availability and event requirements.",
  },
  {
    question: "Is there a private party venue in Launceston?",
    answer:
      "Yes. The White Horse Inn can provide a private function space for parties and celebrations in Launceston, including birthdays, anniversaries, family gatherings, reunions, and informal private events. You can [enquire about a private event](/contact?enquiryType=Function%20Room%20Enquiry) with the team.",
  },
  {
    question: "Where can I hold a wake in Launceston?",
    answer:
      "The White Horse Inn offers a welcoming and practical setting for wakes, memorial gatherings, and celebration-of-life events in Launceston. The team can discuss food, drink, timings, and room availability with care and sensitivity through the [function room enquiry form](/contact?enquiryType=Function%20Room%20Enquiry).",
  },
  {
    question: "Are there function rooms near Launceston for family celebrations?",
    answer:
      "Yes. The White Horse Inn has a function room suitable for family celebrations in the Launceston area, including birthdays, anniversaries, reunions, christenings, and other private gatherings. Guests can also view our [find us page](/find-us) when planning travel.",
  },
  {
    question: "Can I book a room for a private meal in Launceston?",
    answer:
      "The function room at The White Horse Inn may be suitable for private meals, depending on availability, guest numbers, and food requirements. It is a good option for people looking for a relaxed local venue with [pub food and hospitality](/food).",
  },
  {
    question: "Where can I hold a business meeting or group meeting in Launceston?",
    answer:
      "The White Horse Inn function room may be suitable for business meetings, local group meetings, training sessions, club gatherings, and community meetings in Launceston. Guests can [contact the team](/contact?enquiryType=Function%20Room%20Enquiry) to discuss practical requirements.",
  },
  {
    question: "Is there a Launceston venue with food, drink, and accommodation?",
    answer:
      "Yes. The White Horse Inn offers pub hospitality, [food and drink](/food), a function room, and [accommodation](/accommodation) under one roof. This can be useful for events where guests may want to eat, drink, gather, and potentially stay overnight.",
  },
  {
    question: "Can I hire a function room in Launceston with catering?",
    answer:
      "The White Horse Inn can discuss food options for private functions, subject to availability and the type of event. This may include suitable choices for family gatherings, wakes, meetings, and private celebrations. Start with a [function room enquiry](/contact?enquiryType=Function%20Room%20Enquiry).",
  },
  {
    question: "What types of events can be held in a pub function room?",
    answer:
      "A pub function room can be used for many types of events, including birthdays, wakes, anniversaries, private meals, meetings, club events, community gatherings, and informal celebrations. The White Horse Inn offers a flexible local option in Launceston with [food, drink, and rooms](/accommodation) nearby.",
  },
  {
    question: "How do I enquire about function room hire in Launceston?",
    answer:
      "To enquire about function room hire in Launceston, [contact The White Horse Inn](/contact?enquiryType=Function%20Room%20Enquiry) with your preferred date, approximate guest numbers, type of event, food requirements, and any other details. The team can then advise on availability and next steps.",
  },
];

export default function FunctionsPage() {
  return (
    <>
      <SimpleInfoPage
        seoKey="functions"
        eyebrow="Functions"
        title="Functions and Private Events at The White Horse Inn"
        description="A welcoming local venue in Launceston for private functions, family celebrations, meetings, and special occasions."
      >
        <div className="space-y-6">
          <p>
            The White Horse Inn in Launceston offers a welcoming setting for
            private functions, local gatherings, family celebrations, meetings,
            and special occasions. With a large function room alongside the{" "}
            <Link href="/food" className="footer-link">
              pub and restaurant
            </Link>{" "}
            and{" "}
            <Link href="/accommodation" className="footer-link">
              accommodation
            </Link>
            , it is a practical choice for events that need a friendly local
            venue with food and drink close at hand.
          </p>

          <p>
            Our function space can be used for a wide range of occasions,
            including birthdays, wakes, private meals, community events, business
            meetings, family get-togethers, and local celebrations. Whether you
            are planning something simple and informal or a more organised
            event, our team will be happy to talk through what you need.
          </p>

          <p>
            We are currently preparing full function room details, including
            images, layout options, capacity information, food choices, and
            booking details. In the meantime, guests are welcome to{" "}
            <Link
              href="/contact?enquiryType=Function%20Room%20Enquiry"
              className="footer-link"
            >
              contact us directly
            </Link>{" "}
            to discuss availability, event requirements, and how we may be able
            to help.
          </p>

          <p>
            As part of our wider pub hospitality, our focus is on making events
            feel relaxed, well looked after, and personal. With good honest
            food, quality local ingredients, friendly service, and a proper
            local-pub atmosphere, The White Horse Inn is well suited to
            gatherings that need warmth, flexibility, and a practical venue in
            Launceston. You can also{" "}
            <Link href="/find-us" className="footer-link">
              find us in Launceston
            </Link>{" "}
            before visiting.
          </p>
        </div>
      </SimpleInfoPage>

      <FaqSection
        faqs={functionFaqs}
        eyebrow="Function Room FAQs"
        title="Function room questions answered."
      />
    </>
  );
}
