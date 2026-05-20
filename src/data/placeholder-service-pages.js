import faqs from "@/data/faqs.json";

export const placeholderServicePages = {
  accommodation: {
    seoKey: "accommodation",
    eyebrow: "Accommodation",
    title: "Stay at The White Horse Inn, Launceston",
    description:
      "Comfortable accommodation in the heart of Launceston, with food, drink, and hospitality all under one roof.",
    detailHeading: "Accommodation in Launceston, Cornwall",
    imageCard: {
      src: "/assets/images/locations/comfortable_seating_area.jpg",
      alt: "Comfortable seating area at the White Horse Inn in Launceston",
      title: "A relaxed base in Launceston",
      description:
        "Rooms, pub hospitality, and freshly prepared food in one welcoming local inn.",
      eyebrow: "Stay Local",
      href: "/contact?enquiryType=Accommodation%20Enquiry",
    },
    intro:
      "The White Horse Inn offers comfortable accommodation in the heart of Launceston, making it a convenient place to stay whether you are visiting Cornwall for work, a short break, a family occasion, or a longer trip around the local area.",
    sections: [
      {
        title: "Food, drink and rooms under one roof",
        body: "Set above and alongside a welcoming [pub and restaurant](/food), our rooms give guests an easy base with food, drink, and hospitality all under one roof. Whether you are looking for a simple overnight stay, a weekend stopover, or somewhere practical while visiting friends, family, or local attractions, The White Horse Inn offers a friendly and relaxed setting.",
      },
      {
        title: "Booking details are being prepared",
        body: "We are currently preparing full accommodation details, including room information, images, facilities, and booking options. In the meantime, guests are welcome to [contact us directly](/contact?enquiryType=Accommodation%20Enquiry) to ask about room availability, stays, and upcoming bookings.",
      },
      {
        title: "A practical base for Cornwall and Devon",
        body: "The White Horse Inn is well placed for exploring Launceston and the surrounding area, including nearby countryside, local heritage sites, walking routes, and the wider Devon and Cornwall border. With good honest food, quality local ingredients, a proper pub atmosphere, and comfortable rooms, it is a practical and welcoming choice for visitors looking to stay locally. You can also [find us in Launceston](/find-us) before travelling.",
      },
    ],
    highlights: [
      "Comfortable accommodation in Launceston",
      "Food and drink available on site",
      "Useful for short breaks, work trips, and family visits",
      "Well placed for Cornwall and Devon routes",
      "Full online booking details coming soon",
    ],
    primaryCta: {
      label: "Enquire About Accommodation",
      href: "/contact?enquiryType=Accommodation%20Enquiry",
    },
    secondaryCta: {
      label: "Find Us in Launceston",
      href: "/find-us",
    },
    note:
      "This placeholder data can later point to Booking.com availability pages, room-specific booking links, or an embedded booking form.",
    faqs: faqs.accommodation,
  },
  functions: {
    seoKey: "functions",
    eyebrow: "Functions",
    title: "Functions and Private Events at The White Horse Inn",
    description:
      "A welcoming local venue in Launceston for private functions, family celebrations, meetings, and special occasions.",
    detailHeading: "Function Room Hire in Launceston",
    imageCard: {
      src: "/assets/images/locations/white_horse_inn_launceston_chesterfield.png",
      alt: "Interior seating at the White Horse Inn in Launceston",
      title: "Gatherings with local character",
      description:
        "A practical function space supported by food, drink, rooms, and proper pub hospitality.",
      eyebrow: "Private Events",
      href: "/contact?enquiryType=Function%20Room%20Enquiry",
    },
    intro:
      "The White Horse Inn in Launceston offers a welcoming setting for private functions, local gatherings, family celebrations, meetings, and special occasions. With a large function room alongside the pub, restaurant, and accommodation, it is a practical choice for events that need a friendly local venue with food and drink close at hand.",
    sections: [
      {
        title: "Occasions we can host",
        body: "Our function space can be used for a wide range of occasions, including birthdays, wakes, private meals, community events, business meetings, family get-togethers, and local celebrations. Whether you are planning something simple and informal or a more organised event, our team will be happy to talk through what you need.",
      },
      {
        title: "Function details are being prepared",
        body: "We are currently preparing full function room details, including images, layout options, capacity information, food choices, and booking details. In the meantime, guests are welcome to [contact us directly](/contact?enquiryType=Function%20Room%20Enquiry) to discuss availability, event requirements, and how we may be able to help.",
      },
      {
        title: "Hospitality that feels personal",
        body: "As part of our wider pub hospitality, our focus is on making events feel relaxed, well looked after, and personal. With good honest [food](/food), quality local ingredients, friendly service, and a proper local-pub atmosphere, The White Horse Inn is well suited to gatherings that need warmth, flexibility, and a practical venue in Launceston. You can also [find us in Launceston](/find-us) before visiting.",
      },
    ],
    highlights: [
      "Large function room in Launceston",
      "Suitable for wakes, birthdays, meetings, and gatherings",
      "Food and drink options can be discussed",
      "Accommodation available for overnight guests",
      "Full capacity and layout details coming soon",
    ],
    primaryCta: {
      label: "Enquire About Function Hire",
      href: "/contact?enquiryType=Function%20Room%20Enquiry",
    },
    secondaryCta: {
      label: "View Food and Drink",
      href: "/food",
    },
    note:
      "This placeholder data can later be extended with room layouts, package options, calendar availability, or dedicated enquiry forms.",
    faqs: faqs.functions,
  },
};
