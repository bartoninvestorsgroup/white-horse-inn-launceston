import Link from "next/link";
import { MapPin } from "lucide-react";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledQrCode from "@/components/location/StyledQrCode";
import PageIntro from "@/components/layout/PageIntro";
import SectionReveal from "@/components/layout/SectionReveal";
import StructuredData from "@/components/seo/StructuredData";
import { absoluteUrl, breadcrumbSchema } from "@/lib/seo";
import { getPageMetadata, getPageSchema } from "@/lib/seo-config";

export const metadata = getPageMetadata("findUs");

const addressLines = [
  "The White Horse Inn",
  "14 Newport Square",
  "Launceston",
  "Cornwall",
  "PL15 8EL",
];

const wazeUrl =
  "https://www.waze.com/en-GB/live-map/directions/gb/england/the-white-horse-inn?to=place.ChIJdZ-Y9ChjbEgRLT5H-HAcu3M";
const googleDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=White%20Horse%20Inn%2C%2014%20Newport%20Square%2C%20Launceston%20PL15%208EL";
const whatThreeWordsUrl = "https://w3w.co/snored.escapades.handed";
const whatThreeWords = "///snored.escapades.handed";
const googleMapEmbedUrl =
  "https://www.google.com/maps?q=White%20Horse%20Inn%2C%2014%20Newport%20Square%2C%20Launceston%20PL15%208EL&output=embed";
const findUsSchema = {
  ...getPageSchema("findUs"),
  mainEntity: {
    "@type": "Place",
    name: "The White Horse Inn",
    url: absoluteUrl("/find-us"),
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Newport Square",
      addressLocality: "Launceston",
      addressRegion: "Cornwall",
      postalCode: "PL15 8EL",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 50.6423696,
      longitude: -4.3657584,
    },
  },
};

export default function FindUsPage() {
  const schema = [
    findUsSchema,
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Find Us", path: "/find-us" },
    ]),
  ];

  return (
    <>
      <StructuredData data={schema} />
      <PageIntro
        eyebrow="Find Us"
        title="Find The White Horse Inn in Launceston."
        description="Plan your visit to The White Horse Inn with our address, live map, Google directions, Waze QR code, and what3words location."
      />

      <section className="relative z-20 bg-[color:var(--color-surface)] py-16 md:py-24">
        <SectionReveal className="site-container px-2">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-stretch">
            <div className="flex flex-col justify-between border border-[color:var(--color-border-soft)] bg-[color:var(--muted)] p-6 shadow-[var(--shadow-card)] md:p-8">
              <div>
                <p className="eyebrow">Our Address</p>
                <h2 className="mt-4 font-heading text-4xl leading-tight text-[color:var(--color-primary)] md:text-5xl">
                  Visit us in Newport Square.
                </h2>

                <address className="mt-8 space-y-1 text-xl not-italic leading-8 text-[color:var(--color-primary)] md:text-2xl md:leading-9">
                  {addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>

                <p className="mt-6 max-w-xl text-base leading-8 text-[color:var(--color-copy-soft)] md:text-lg">
                  We are in the heart of Launceston, close to local routes,
                  nearby countryside, and the wider Cornwall and Devon border.
                </p>
              </div>

              <div className="mt-8 grid gap-3">
                <Link
                  href={googleDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button min-h-14 gap-2 px-5"
                >
                  <FontAwesomeIcon icon={faGoogle} className="size-4" />
                  <span>Directions via Google</span>
                </Link>

                <Link
                  href={whatThreeWordsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-button min-h-14 gap-2 px-5"
                >
                  <MapPin className="size-4" aria-hidden="true" />
                  <span>{whatThreeWords}</span>
                </Link>
              </div>
            </div>

            <div className="min-h-[420px] overflow-hidden border border-[color:var(--color-border-soft)] bg-[color:var(--muted)] shadow-[var(--shadow-card)] md:min-h-[560px]">
              <iframe
                title="Map showing The White Horse Inn in Launceston"
                src={googleMapEmbedUrl}
                className="h-full min-h-[420px] w-full border-0 md:min-h-[560px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="mt-8 grid gap-8 border border-[color:var(--color-gold)]/45 bg-[color:var(--color-primary)] p-6 text-white shadow-[var(--shadow-panel)] md:p-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(18rem,0.8fr)] lg:items-center">
            <div>
              <p className="eyebrow text-[color:var(--color-gold)]">
                Scan for Waze
              </p>
              <h2 className="mt-4 font-heading text-3xl leading-tight text-[color:var(--color-gold)] md:text-5xl">
                Open directions on your phone.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
                Scan the code to open Waze directions to The White Horse Inn,
                or use the button above if you are already on your phone.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative flex size-[19rem] items-center justify-center rounded-[1.5rem] border border-[color:var(--color-gold)]/70 bg-[color:var(--color-surface)] p-3 shadow-[var(--shadow-card)] md:size-[22rem] md:p-4">
                <StyledQrCode
                  data={wazeUrl}
                  label="QR code for Waze directions to The White Horse Inn"
                  className="size-full rounded-[1rem]"
                />
              </div>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
