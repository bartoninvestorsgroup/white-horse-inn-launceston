import { absoluteUrl, buildMetadata } from "@/lib/seo";

export const pageSeo = {
  home: {
    title: "White Horse Inn Launceston | Pub, Food, Rooms & Functions",
    description:
      "Welcome to the White Horse Inn in Launceston, a warm, welcoming pub with good food, comfortable accommodation, function room hire, events, and easy table bookings.",
    path: "/",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Launceston.",
    schemaType: "WebPage",
    schemaName: "White Horse Inn Launceston",
  },

  food: {
    title: "Food and Drink Menus | White Horse Inn Launceston Pub Food",
    description:
      "Explore food and drink at the White Horse Inn in Launceston, including pub classics, seasonal dishes, children’s options, Sunday roasts, desserts, and drinks.",
    path: "/food",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish from the White Horse Inn food menu.",
    schemaType: "WebPage",
    schemaName: "Food and Drink at White Horse Inn Launceston",
  },

  menu: {
    title: "Main Food Menu | White Horse Inn Launceston Pub Dining Menu",
    description:
      "View the main menu at the White Horse Inn in Launceston, featuring freshly prepared pub favourites, seasonal dishes, comforting plates, and relaxed dining.",
    path: "/food",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish from the White Horse Inn main menu.",
    schemaType: "Menu",
    schemaName: "White Horse Inn Main Menu",
  },

  accommodation: {
    title: "Accommodation Rooms | White Horse Inn Launceston Pub Stay",
    description:
      "Stay at the White Horse Inn in Launceston, with comfortable accommodation above a welcoming pub, ideal for town visits, local events, short breaks, and trips nearby.",
    path: "/accommodation",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "WebPage",
    schemaName: "Accommodation at White Horse Inn Launceston",
  },

  findUs: {
    title: "Find Us and Directions | White Horse Inn Launceston Pub",
    description:
      "Find the White Horse Inn in Launceston, view our location, get directions, check travel details, and plan your visit to our welcoming pub in Newport Square.",
    path: "/find-us",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Newport Square, Launceston.",
    schemaType: "WebPage",
    schemaName: "Find White Horse Inn Launceston",
  },

  functions: {
    title: "Function Room Hire | White Horse Inn Launceston Local Venue",
    description:
      "Hire the function room at the White Horse Inn in Launceston for parties, private events, meetings, wakes, family celebrations, local gatherings, and meals.",
    path: "/functions",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "WebPage",
    schemaName: "Function Room Hire at White Horse Inn Launceston",
  },

  gallery: {
    title: "Gallery Photos | White Horse Inn Launceston Pub and Food",
    description:
      "View photos of the White Horse Inn in Launceston, including our pub interior, freshly prepared food, drinks, accommodation, events, venue rooms, and function spaces.",
    path: "/gallery",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn in Launceston.",
    schemaType: "ImageGallery",
    schemaName: "White Horse Inn Launceston Gallery",
  },

  bookATable: {
    title: "Book a Table Online | White Horse Inn Launceston Pub Dining",
    description:
      "Book a table at the White Horse Inn in Launceston for lunch, dinner, Sunday dining, family meals, drinks with friends, celebrations, and relaxed local pub visits.",
    path: "/book-a-table",
    image: "/og-food.jpg",
    imageAlt: "A freshly prepared dish at the White Horse Inn.",
    schemaType: "WebPage",
    schemaName: "Book a Table at White Horse Inn Launceston",
  },

  contact: {
    title: "Contact and Enquiries | White Horse Inn Launceston Pub Team",
    description:
      "Contact the White Horse Inn in Launceston for table bookings, accommodation enquiries, function room hire, events, opening times, venue hire, and general questions.",
    path: "/contact",
    image: "/og-default.jpg",
    imageAlt: "The White Horse Inn exterior in Launceston.",
    schemaType: "ContactPage",
    schemaName: "Contact White Horse Inn Launceston",
  },

  privacyPolicy: {
    title: "Privacy Policy and Cookies | White Horse Inn Launceston",
    description:
      "Read privacy, cookie, and data handling information for the White Horse Inn in Launceston, including website choices, enquiries, bookings, and contact forms.",
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
