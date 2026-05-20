import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const pageSeo = {
  home: {
    title: "White Horse Inn Launceston | Pub, Food, Rooms & Functions",
    description:
      "Welcome to the White Horse Inn in Launceston, a warm and welcoming pub with good food, comfortable accommodation, function room hire, events, and easy table bookings.",
    path: "/",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Launceston.",
    schemaType: "WebPage",
    schemaName: "White Horse Inn Launceston",
  },

  food: {
    title: "Food & Drink | White Horse Inn Launceston",
    description:
      "Explore food and drink at the White Horse Inn in Launceston, including pub classics, seasonal dishes, children’s options, Sunday menu, desserts, and drinks.",
    path: "/food",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish from the White Horse Inn food menu.",
    schemaType: "WebPage",
    schemaName: "Food and Drink at White Horse Inn Launceston",
  },

  menu: {
    title: "Main Menu | White Horse Inn Launceston",
    description:
      "View the main menu at the White Horse Inn in Launceston, featuring freshly prepared pub favourites, seasonal dishes, and comforting food for relaxed dining.",
    path: "/food",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish from the White Horse Inn main menu.",
    schemaType: "Menu",
    schemaName: "White Horse Inn Main Menu",
  },

  accommodation: {
    title: "Accommodation | Rooms at White Horse Inn Launceston",
    description:
      "Stay at the White Horse Inn in Launceston, with comfortable accommodation above a welcoming pub, ideal for visits to Launceston and the surrounding area.",
    path: "/accommodation",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "WebPage",
    schemaName: "Accommodation at White Horse Inn Launceston",
  },

  findUs: {
    title: "Find Us | White Horse Inn Launceston",
    description:
      "Find the White Horse Inn in Launceston, view our location, get directions, and plan your visit with helpful travel and contact information.",
    path: "/find-us",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Newport Square, Launceston.",
    schemaType: "WebPage",
    schemaName: "Find White Horse Inn Launceston",
  },

  functions: {
    title: "Function Room Hire | White Horse Inn Launceston",
    description:
      "Hire the function room at the White Horse Inn in Launceston for parties, private events, meetings, celebrations, and local gatherings.",
    path: "/functions",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "WebPage",
    schemaName: "Function Room Hire at White Horse Inn Launceston",
  },

  gallery: {
    title: "Gallery | White Horse Inn Launceston",
    description:
      "View photos of the White Horse Inn in Launceston, including the pub interior, food, drink, accommodation, events, and function spaces.",
    path: "/gallery",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "ImageGallery",
    schemaName: "White Horse Inn Launceston Gallery",
  },

  bookATable: {
    title: "Book a Table | White Horse Inn Launceston",
    description:
      "Book a table at the White Horse Inn in Launceston for food, drinks, Sunday dining, family meals, and relaxed pub visits.",
    path: "/book-a-table",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish at the White Horse Inn.",
    schemaType: "WebPage",
    schemaName: "Book a Table at White Horse Inn Launceston",
  },

  contact: {
    title: "Contact Us | White Horse Inn Launceston",
    description:
      "Contact the White Horse Inn in Launceston for table bookings, accommodation enquiries, function room hire, events, and general questions.",
    path: "/contact",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Launceston.",
    schemaType: "ContactPage",
    schemaName: "Contact White Horse Inn Launceston",
  },

  privacyPolicy: {
    title: "Privacy Policy | White Horse Inn Launceston",
    description:
      "Privacy, cookies, and data handling information for the White Horse Inn in Launceston.",
    path: "/privacy-policy",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Launceston.",
    schemaType: "WebPage",
    schemaName: "White Horse Inn Launceston Privacy Policy",
  },
};

export function getPageMetadata(key) {
  return buildMetadata(pageSeo[key] || pageSeo.home);
}

export function getPageSchema(key, extra = {}, overrides = {}) {
  const config = {
    ...(pageSeo[key] || pageSeo.home),
    ...overrides,
  };

  return {
    "@context": "https://schema.org",
    "@type": config.schemaType,
    "@id": absoluteUrl(`${config.path}#webpage`),
    name: config.schemaName,
    url: absoluteUrl(config.path),
    description: config.description,
    image: config.image ? absoluteUrl(config.image) : undefined,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    about: {
      "@id": absoluteUrl("/#organization"),
    },
    inLanguage: "en-GB",
    ...extra,
  };
}
