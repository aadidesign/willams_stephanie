/* ============================================================
   BELLA VITA - Central Content Source of Truth
   ------------------------------------------------------------
   This object powers (1) the public website, (2) the AI chatbot
   knowledge base, and (3) the admin dashboard CMS defaults.
   Replace copy / images here or via the Admin Dashboard.
   ============================================================ */

export type ImageAsset = { src: string; alt: string };

/** Pexels CDN helper (verified image IDs). */
export const px = (id: number, w = 1280): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export type MenuItem = {
  name: string;
  description: string;
  price: number;
  tags?: string[];
  image?: string;
  featured?: boolean;
};

export type MenuCategory = {
  id: string;
  name: string;
  italian: string;
  description: string;
  items: MenuItem[];
};

export type Hour = { day: string; open: string; close: string; closed?: boolean };

export type RestaurantTable = { id: string; seats: number; area: string };

export const BOOKING_STATUSES = ["pending", "confirmed", "booked", "seated", "cancelled"] as const;
/** Statuses that occupy a table for availability purposes. */
export const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed", "booked", "seated"];

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
  rating: number;
  image?: string;
};

export type HostingPlan = {
  name: string;
  price: number;
  period: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

export type CateringPackage = {
  name: string;
  price: number;
  unit: string;
  features: string[];
  highlighted?: boolean;
};

export const siteContent = {
  brand: {
    name: "Bella Vita",
    fullName: "Bella Vita Ristorante",
    tagline: "Authentic Italian Fine Dining",
    motto: "Good Food · Good Wine · Good Life",
    established: 1978,
    owner: "Willams Stephanie",
    currency: "$",
  },

  announcement:
    "Now accepting reservations for the Winter Tasting Season · Wednesdays are Happy Hour, half-price bottles after 5pm",

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Menu", href: "/menu" },
    { label: "Banquet", href: "/banquet" },
    { label: "Gallery", href: "/gallery" },
    { label: "Catering", href: "/catering" },
    { label: "Menu Kit", href: "/menu-kit" },
    { label: "Contact", href: "/contact" },
  ],

  contact: {
    phone: "+1 (212) 555-0178",
    phoneHref: "tel:+12125550178",
    reservationsPhone: "+1 (212) 555-0100",
    email: "hello@bellavita-ristorante.com",
    cateringEmail: "events@bellavita-ristorante.com",
    address: {
      street: "142 Greenwich Avenue",
      city: "New York",
      region: "NY",
      postal: "10011",
      country: "United States",
    },
    addressLine: "142 Greenwich Avenue, New York, NY 10011",
    mapEmbed:
      "https://www.google.com/maps?q=Greenwich+Avenue+New+York&output=embed",
    mapLink: "https://maps.google.com/?q=142+Greenwich+Avenue+New+York",
    social: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com",
      tripadvisor: "https://tripadvisor.com",
      yelp: "https://yelp.com",
    },
  },

  hours: [
    { day: "Monday", open: "12:00", close: "22:00" },
    { day: "Tuesday", open: "12:00", close: "22:00" },
    { day: "Wednesday", open: "12:00", close: "23:00" },
    { day: "Thursday", open: "12:00", close: "23:00" },
    { day: "Friday", open: "12:00", close: "23:30" },
    { day: "Saturday", open: "11:00", close: "23:30" },
    { day: "Sunday", open: "11:00", close: "21:00" },
  ] as Hour[],
  hoursNote:
    "Kitchen closes 45 minutes before closing time. Brunch served weekends until 3pm.",

  hero: {
    eyebrow: "Locally crafted food & wine since 1978",
    titleTop: "Bella",
    titleBottom: "Vita",
    subtitle:
      "A family table in the heart of the city, where Nonna's recipes meet candle-lit evenings, hand-picked wines and the warmth of true Italian hospitality.",
    video:
      "https://videos.pexels.com/video-files/8247207/8247207-hd_1920_1080_25fps.mp4",
    videoSd:
      "https://videos.pexels.com/video-files/8247207/8247207-hd_1280_720_25fps.mp4",
    poster: px(67468, 1920),
    badge: "Country's Most Loved Trattoria",
    primaryCta: { label: "Reserve a Table", href: "/booking" },
    secondaryCta: { label: "Explore the Menu", href: "/menu" },
  },

  about: {
    eyebrow: "Our Story",
    heading: "We are locally crafted food & wine, serving since 1978",
    lead:
      "Three generations. One table. From a tiny corner trattoria opened by the Stephanie family, Bella Vita has grown into the city's most-loved Italian dining room, without ever losing the soul of a home kitchen.",
    body: [
      "Every plate begins at dawn, with bread proofing, sauces simmering and pasta rolled by hand. We source from local farms and import only what Italy does best: San Marzano tomatoes, Parmigiano-Reggiano aged 24 months, and olive oil pressed in Puglia.",
      "Our cellar holds over 200 labels, curated to pair with the seasons. Whether it's a quiet dinner for two or a celebration for two hundred, you are family the moment you walk in.",
    ],
    chef: {
      name: "Chef Marco Rinaldi",
      title: "Executive Chef & Co-Owner",
      quote:
        "Cooking is the language we speak when words aren't enough. Every dish carries a memory.",
    },
    image: px(3201920, 1200),
    imageSecondary: px(1267320, 900),
    stats: [
      { value: "47", label: "Years of tradition" },
      { value: "200+", label: "Wine labels" },
      { value: "12", label: "Master chefs" },
      { value: "98%", label: "Guests return" },
    ],
  },

  values: [
    {
      title: "Hand-Made Daily",
      description:
        "Fresh pasta, breads and sauces crafted in-house every morning. Never frozen, never rushed.",
      icon: "wheat",
    },
    {
      title: "Locally Sourced",
      description:
        "Partnered with regional farms for produce picked at its peak and delivered the same day.",
      icon: "leaf",
    },
    {
      title: "Curated Cellar",
      description:
        "Over 200 Italian and New World labels, hand-selected to pair with every course.",
      icon: "wine",
    },
    {
      title: "True Hospitality",
      description:
        "A family-run dining room where every guest is welcomed like an old friend.",
      icon: "heart",
    },
  ],

  menuIntro: {
    eyebrow: "Quality Ingredients, Tasty Meals",
    heading: "A menu written by the seasons",
    description:
      "From wood-fired antipasti to hand-rolled pasta and dolci that linger, every dish is a small celebration of la dolce vita.",
  },

  menu: [
    {
      id: "antipasti",
      name: "Antipasti",
      italian: "To Begin",
      description: "Shared plates to open the table and the appetite.",
      items: [
        {
          name: "Burrata di Puglia",
          description:
            "Creamy burrata, heirloom tomatoes, basil oil, aged balsamic & toasted focaccia.",
          price: 16,
          tags: ["Vegetarian", "Signature"],
          image: px(1640772, 800),
          featured: true,
        },
        {
          name: "Tagliere Italiano",
          description:
            "Selection of cured meats, regional cheeses, marinated olives & honeycomb.",
          price: 24,
          tags: ["To Share"],
          image: px(5639263, 800),
        },
        {
          name: "Calamari Fritti",
          description:
            "Lightly fried calamari, lemon aioli, charred lemon & sea salt.",
          price: 18,
          image: px(2233348, 800),
        },
        {
          name: "Bruschetta Trio",
          description:
            "Three crostini: classic pomodoro, whipped ricotta & fig, wild mushroom.",
          price: 14,
          tags: ["Vegetarian"],
          image: px(5710178, 800),
        },
      ],
    },
    {
      id: "pasta",
      name: "Pasta Fresca",
      italian: "Hand-Rolled Daily",
      description: "Our heart and soul: pasta made by hand each morning.",
      items: [
        {
          name: "Tagliatelle al Tartufo",
          description:
            "Hand-cut tagliatelle, black truffle cream, Parmigiano & cracked pepper.",
          price: 32,
          tags: ["Chef's Choice", "Signature"],
          image: px(1279330, 800),
          featured: true,
        },
        {
          name: "Spaghetti alle Vongole",
          description:
            "Fresh clams, garlic, white wine, chili & parsley over house spaghetti.",
          price: 28,
          image: px(1438672, 800),
        },
        {
          name: "Lasagna della Nonna",
          description:
            "Slow-cooked beef & pork ragù, béchamel, layered and baked golden.",
          price: 26,
          tags: ["House Favorite"],
          image: px(4518843, 800),
          featured: true,
        },
        {
          name: "Gnocchi al Pesto",
          description:
            "Pillowy potato gnocchi, Genovese basil pesto, green beans & pine nuts.",
          price: 24,
          tags: ["Vegetarian"],
          image: px(1527603, 800),
        },
      ],
    },
    {
      id: "forno",
      name: "Dal Forno",
      italian: "From the Wood Oven",
      description: "Naturally leavened, fired at 450°C for a blistered crust.",
      items: [
        {
          name: "Margherita D.O.P.",
          description:
            "San Marzano tomato, fior di latte, fresh basil & Puglian olive oil.",
          price: 19,
          tags: ["Vegetarian", "Classic"],
          image: px(1565982, 800),
          featured: true,
        },
        {
          name: "Diavola",
          description:
            "Spicy Calabrian salami, tomato, mozzarella & a drizzle of hot honey.",
          price: 22,
          image: px(803290, 800),
        },
        {
          name: "Tartufo Bianco",
          description:
            "White truffle cream, mushroom, mozzarella, fontina & thyme.",
          price: 26,
          tags: ["Signature"],
          image: px(708587, 800),
        },
      ],
    },
    {
      id: "secondi",
      name: "Secondi",
      italian: "Main Courses",
      description: "Plates from land and sea, finished with seasonal sides.",
      items: [
        {
          name: "Osso Buco alla Milanese",
          description:
            "Braised veal shank, saffron risotto, gremolata & rich jus.",
          price: 42,
          tags: ["Chef's Choice"],
          image: px(4147872, 800),
          featured: true,
        },
        {
          name: "Branzino al Forno",
          description:
            "Whole Mediterranean sea bass, roasted lemon, capers & herbs.",
          price: 38,
          image: px(2147491, 800),
        },
        {
          name: "Bistecca alla Fiorentina",
          description:
            "Dry-aged T-bone for two, rosemary, sea salt & roasted potatoes.",
          price: 78,
          tags: ["For Two", "Signature"],
          image: px(4109111, 800),
        },
      ],
    },
    {
      id: "dolci",
      name: "Dolci",
      italian: "Sweet Endings",
      description: "House-made desserts and a digestivo to finish.",
      items: [
        {
          name: "Tiramisù Classico",
          description:
            "Espresso-soaked savoiardi, mascarpone cream & cocoa. The original.",
          price: 12,
          tags: ["Signature"],
          image: px(1126359, 800),
          featured: true,
        },
        {
          name: "Panna Cotta ai Frutti",
          description: "Vanilla bean panna cotta, macerated berries & mint.",
          price: 11,
          image: px(291528, 800),
        },
        {
          name: "Cannoli Siciliani",
          description:
            "Crisp shells, sweet ricotta, pistachio & candied orange.",
          price: 10,
          image: px(357573, 800),
        },
      ],
    },
  ] as MenuCategory[],

  happyHour: {
    eyebrow: "Good Food · Good Wine",
    heading: "Wednesdays mean Happy Hour",
    description:
      "Half-price bottles of wine and six tasting plates for $9 each, every Wednesday from 5pm till late.",
    cta: { label: "See the Offer", href: "/menu#happy-hour" },
    image: px(696218, 1200),
  },

  banquet: {
    eyebrow: "Banquet Facility",
    heading: "Celebrate beneath the vaulted ceilings",
    lead:
      "Our private dining rooms turn milestones into memories: weddings, corporate galas, rehearsal dinners and intimate gatherings, all wrapped in old-world elegance.",
    body:
      "Three distinct spaces, a dedicated events team and a bespoke menu crafted with you. From a seated dinner for 20 to a standing reception for 220, every detail is ours to handle so you can simply enjoy.",
    capacity: { seated: 180, standing: 220, privateRooms: 3 },
    image: px(260922, 1400),
    spaces: [
      {
        name: "The Vineyard Room",
        capacity: "Up to 60 seated",
        description:
          "Sun-lit and intimate, framed by floor-to-ceiling wine displays.",
        image: px(262978, 800),
      },
      {
        name: "The Grand Salone",
        capacity: "Up to 180 seated",
        description:
          "Our flagship hall with vaulted ceilings, chandeliers & a stage.",
        image: px(2253643, 800),
      },
      {
        name: "The Terrazza",
        capacity: "Up to 80 standing",
        description:
          "An open-air terrace under string lights and olive trees.",
        image: px(1860208, 800),
      },
    ],
    inclusions: [
      "Dedicated event coordinator",
      "Bespoke multi-course menus",
      "Sommelier-paired wine service",
      "AV, staging & lighting",
      "Custom floral & décor",
      "Valet & coat service",
    ],
  },

  catering: {
    eyebrow: "Catering",
    heading: "Bring Bella Vita to your table",
    lead:
      "Off-site catering with the same hand-made craft we serve in the dining room, for weddings, offices, film sets and private homes.",
    services: [
      {
        title: "Corporate & Office",
        description:
          "Boxed lunches, grazing tables and hot buffets delivered on time, every time.",
        image: px(5949888, 800),
      },
      {
        title: "Weddings & Events",
        description:
          "Full-service catering with on-site chefs, waitstaff and bar.",
        image: px(2079438, 800),
      },
      {
        title: "Private Dining",
        description:
          "A personal chef experience in the comfort of your own home.",
        image: px(3434523, 800),
      },
    ],
    packages: [
      {
        name: "Antipasti Grazing",
        price: 28,
        unit: "per guest",
        features: [
          "Cured meats & cheeses",
          "Marinated vegetables",
          "Artisan breads & dips",
          "Seasonal fruit",
        ],
      },
      {
        name: "Trattoria Buffet",
        price: 46,
        unit: "per guest",
        features: [
          "Two fresh pastas",
          "Wood-fired focaccia",
          "Garden & Caesar salads",
          "Choice of two secondi",
          "Dolci platter",
        ],
        highlighted: true,
      },
      {
        name: "Full-Service Wedding",
        price: 95,
        unit: "per guest",
        features: [
          "Four-course plated dinner",
          "On-site chefs & waitstaff",
          "Sommelier wine pairing",
          "Custom cake & dolci bar",
          "Full bar service",
        ],
      },
    ] as CateringPackage[],
    process: [
      { step: "01", title: "Consult", description: "Tell us your vision, guest count and date." },
      { step: "02", title: "Curate", description: "We craft a bespoke menu and tasting." },
      { step: "03", title: "Confirm", description: "Lock the details with a transparent quote." },
      { step: "04", title: "Celebrate", description: "We handle everything, you enjoy the day." },
    ],
    image: px(2741448, 1400),
  },

  gallery: [
    { src: px(1640777, 900), alt: "Plated pasta with fresh herbs", category: "Food" },
    { src: px(67468, 900), alt: "Elegant dining room ambience", category: "Ambience" },
    { src: px(1565982, 900), alt: "Wood-fired Margherita pizza", category: "Food" },
    { src: px(941861, 900), alt: "Wine glasses at a set table", category: "Wine" },
    { src: px(1267320, 900), alt: "Chef plating a dish", category: "Kitchen" },
    { src: px(1126359, 900), alt: "Tiramisù dessert close-up", category: "Food" },
    { src: px(260922, 900), alt: "Banquet hall set for an event", category: "Events" },
    { src: px(1058277, 900), alt: "Pouring red wine", category: "Wine" },
    { src: px(3814446, 900), alt: "Chef in the kitchen", category: "Kitchen" },
    { src: px(2253643, 900), alt: "Romantic candle-lit table", category: "Ambience" },
    { src: px(4109111, 900), alt: "Grilled steak entrée", category: "Food" },
    { src: px(696218, 900), alt: "Friends toasting with wine", category: "Wine" },
  ] as { src: string; alt: string; category: string }[],

  testimonials: [
    {
      name: "Shamika Smith",
      role: "Food Critic, The City Plate",
      quote:
        "The tagliatelle al tartufo is worth the trip alone. Bella Vita serves the most honest Italian food in the city, and the warmest welcome.",
      rating: 5,
    },
    {
      name: "Jose Hatts",
      role: "Regular since 2009",
      quote:
        "We've celebrated every anniversary here for fourteen years. The Stephanie family treats you like their own. Simply the best.",
      rating: 5,
    },
    {
      name: "Monica Tata",
      role: "Bride, Grand Salone Wedding",
      quote:
        "They hosted 180 guests for our wedding and not a single detail was missed. The food had everyone talking for months.",
      rating: 5,
    },
  ] as Testimonial[],

  hosting: {
    eyebrow: "Website & Hosting",
    heading: "Your website, fully managed",
    description:
      "Transparent, all-inclusive plans with no shopping cart and no hidden fees. We design, host and maintain everything so you can focus on the food.",
    note:
      "All plans include the AI concierge chatbot, the admin dashboard, SSL, daily backups and ongoing support. Domain billed at cost.",
    plans: [
      {
        name: "Essential",
        price: 29,
        period: "/mo",
        blurb: "Everything a single-location restaurant needs to shine online.",
        features: [
          "Premium 9-page website",
          "Managed cloud hosting & SSL",
          "Online reservations + email alerts",
          "Mobile-perfect & SEO-ready",
          "Daily backups",
          "Email support",
        ],
      },
      {
        name: "Signature",
        price: 59,
        period: "/mo",
        blurb: "Our most popular plan. Adds the AI concierge & full CMS.",
        features: [
          "Everything in Essential",
          "AI concierge chatbot (Gemini)",
          "Full admin dashboard / CMS",
          "Menu, gallery & content editing",
          "Booking & catering management",
          "Priority support",
        ],
        highlighted: true,
        badge: "Most Popular",
      },
      {
        name: "Banquet",
        price: 99,
        period: "/mo",
        blurb: "For multi-room venues running events & catering at scale.",
        features: [
          "Everything in Signature",
          "Events & catering CRM",
          "3rd-party calendar sync",
          "Multi-staff dashboard logins",
          "Custom integrations",
          "Dedicated account manager",
        ],
      },
    ] as HostingPlan[],
  },

  menuKit: {
    eyebrow: "Menu Kit",
    heading: "Take a taste of Bella Vita home",
    description:
      "Download our printable menus, wine list and seasonal specials, or request our full catering & events kit delivered to your inbox.",
    downloads: [
      { name: "À la Carte Menu", format: "PDF", size: "1.2 MB", file: "#" },
      { name: "Wine & Cocktail List", format: "PDF", size: "0.8 MB", file: "#" },
      { name: "Banquet & Events Kit", format: "PDF", size: "3.4 MB", file: "#" },
      { name: "Catering Brochure", format: "PDF", size: "2.1 MB", file: "#" },
    ],
  },

  faq: [
    {
      q: "Do you take walk-ins or is a reservation required?",
      a: "We happily welcome walk-ins at the bar and patio, but for the dining room, especially Thursday through Sunday, we strongly recommend booking a table online.",
    },
    {
      q: "Do you accommodate dietary restrictions?",
      a: "Absolutely. We offer vegetarian, vegan and gluten-free options across the menu, and our chefs can adapt most dishes. Please note allergies when booking.",
    },
    {
      q: "Is there a dress code?",
      a: "Smart-casual. We want you comfortable, though many guests love to dress up for the occasion.",
    },
    {
      q: "Can I host a private event or large party?",
      a: "Yes. Our banquet facility seats up to 180 (220 standing) across three private rooms. Visit our Banquet page or contact our events team.",
    },
    {
      q: "Do you offer catering off-site?",
      a: "We do, from office lunches to full-service weddings. See our Catering page for packages and request a custom quote.",
    },
    {
      q: "Where are you located and is parking available?",
      a: "We're at 142 Greenwich Avenue, New York. Valet parking is available Thursday–Sunday evenings, with public garages nearby.",
    },
  ],

  info: {
    payment: "We accept all major cards (Visa, Mastercard, American Express), Apple Pay and Google Pay. Cash is welcome.",
    kids: "Families are very welcome. High chairs and a children's menu are available on request.",
    accessibility: "Our dining room, patio and restrooms are wheelchair accessible. Let us know of any needs when booking.",
    corkage: "BYO wine is welcome with a $25 per-bottle corkage fee (maximum two bottles).",
    giftCards: "Gift cards are available in any amount, in person or by phone.",
    parking: "Complimentary valet parking is offered Thursday to Sunday evenings, with public garages nearby.",
    reservationHold: "Tables are held for 15 minutes past the reservation time.",
    cancellation: "Please give at least 4 hours' notice to cancel or change a booking; parties of 8 or more require 24 hours.",
    petPolicy: "Well-behaved dogs are welcome on the outdoor patio.",
    largeParty: "Parties of 8 or more are arranged through our events team with a tailored set menu.",
  },

  booking: {
    timeSlots: [
      "11:30", "12:00", "12:30", "13:00", "13:30", "14:00",
      "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
      "20:00", "20:30", "21:00", "21:30",
    ],
    partySizes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    occasions: ["Casual Dining", "Birthday", "Anniversary", "Date Night", "Business", "Celebration"],
    maxAdvanceDays: 90,
    largePartyThreshold: 8,
    // Floor plan — the restaurant's bookable tables.
    tables: [
      { id: "T1", seats: 2, area: "Window" },
      { id: "T2", seats: 2, area: "Window" },
      { id: "T3", seats: 2, area: "Main" },
      { id: "T4", seats: 4, area: "Main" },
      { id: "T5", seats: 4, area: "Main" },
      { id: "T6", seats: 4, area: "Main" },
      { id: "T7", seats: 4, area: "Garden" },
      { id: "T8", seats: 6, area: "Garden" },
      { id: "T9", seats: 6, area: "Main" },
      { id: "P1", seats: 4, area: "Patio" },
      { id: "P2", seats: 2, area: "Patio" },
      { id: "B1", seats: 8, area: "Booth" },
      { id: "B2", seats: 10, area: "Private" },
    ] as RestaurantTable[],
  },
};

export type SiteContent = typeof siteContent;
