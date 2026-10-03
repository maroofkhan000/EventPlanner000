const mongoose = require("mongoose");
const Venue = require("./models/Venue");
const Service = require("./models/Service");
require("dotenv").config();

// Build an Unsplash image URL from a photo id
const img = (id) =>
  `https://images.unsplash.com/photo-${id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80`;

const UP = { city: "Lucknow", state: "Uttar Pradesh" };

const sampleVenues = [
  {
    name: "Royal Garden Lawn",
    type: "marriage-lawn",
    location: {
      address: "123 Garden Road, Gomti Nagar",
      ...UP,
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 85000,
    amenities: ["Parking", "AC", "Stage", "Lighting", "Dance Floor", "Green Room"],
    images: [
      img("1511795409834-ef04bbd61622"),
      img("1469371670807-013ccf25f16a"),
      img("1522673607200-164d1b6ce486"),
    ],
    description:
      "Beautiful outdoor lawn with lush garden surroundings, perfect for grand wedding celebrations. Features elegant decor and ample parking space.",
    rating: 4.5,
  },
  {
    name: "Grand Palace Hotel",
    type: "hotel",
    location: {
      address: "456 Luxury Street, Hazratganj",
      ...UP,
      country: "India",
    },
    capacity: { min: 150, max: 800 },
    price: 120000,
    amenities: ["AC Banquet Hall", "Valet Parking", "Luxury Suites", "Spa", "Pool", "Fine Dining"],
    images: [
      img("1624763149686-1893acf73092"),
      img("1566073771259-6a8506099945"),
      img("1542314831-068cd1dbfeeb"),
    ],
    description:
      "Luxurious hotel ballroom with premium amenities and five-star service. Perfect for royal wedding celebrations.",
    rating: 4.8,
  },
  {
    name: "Heritage Marriage Hall",
    type: "banquet-hall",
    location: {
      address: "789 Cultural Avenue, Alambagh",
      ...UP,
      country: "India",
    },
    capacity: { min: 200, max: 1000 },
    price: 95000,
    amenities: ["AC Hall", "Parking", "Catering", "Decoration", "Sound System", "Projector"],
    images: [
      img("1780542900375-0cf459e38fbb"),
      img("1519167758481-83f550bb49b3"),
      img("1464366400600-7168b8af9bc3"),
    ],
    description:
      "Spacious banquet hall with traditional Lucknowi architecture and modern amenities.",
    rating: 4.3,
  },
  {
    name: "Riverside Wedding Resort",
    type: "destination",
    location: {
      address: "101 River View, Near Gomti River",
      ...UP,
      country: "India",
    },
    capacity: { min: 50, max: 300 },
    price: 150000,
    amenities: ["River View", "Resort Stay", "Poolside Events", "Gardens", "Waterfall"],
    images: [
      img("1464366400600-7168b8af9bc3"),
      img("1571896349842-33c89424de2d"),
      img("1532712938310-34cb3982ef74"),
    ],
    description:
      "Exclusive riverside resort perfect for intimate destination weddings with beautiful natural surroundings.",
    rating: 4.7,
  },
  {
    name: "Elegant Lawn & Convention",
    type: "marriage-lawn",
    location: {
      address: "234 Green Park, Indira Nagar",
      ...UP,
      country: "India",
    },
    capacity: { min: 80, max: 400 },
    price: 75000,
    amenities: ["Lawn Area", "Indoor Backup", "Catering", "Lighting", "Parking", "Stage"],
    images: [
      img("1519225421980-715cb0215aed"),
      img("1523438885200-e635ba2c371e"),
      img("1511795409834-ef04bbd61622"),
    ],
    description:
      "Beautiful lawn with indoor convention center backup. Perfect for all weather weddings.",
    rating: 4.2,
  },
  {
    name: "Crystal Banquet & Convention",
    type: "banquet-hall",
    location: {
      address: "12 Shaheed Path, Vibhuti Khand, Gomti Nagar",
      ...UP,
      country: "India",
    },
    capacity: { min: 150, max: 700 },
    price: 110000,
    amenities: ["Central AC", "Crystal Chandeliers", "Bridal Suite", "Valet Parking", "LED Wall", "In-house Decor"],
    images: [
      img("1519167758481-83f550bb49b3"),
      img("1624763149686-1893acf73092"),
      img("1464366400600-7168b8af9bc3"),
    ],
    description:
      "A glittering pillar-less banquet hall with crystal chandeliers, a private bridal suite and an LED wall for your wedding film premiere.",
    rating: 4.6,
  },
  {
    name: "Mughal Durbar Banquets",
    type: "banquet-hall",
    location: {
      address: "45 Kaiserbagh Road, Kaiserbagh",
      ...UP,
      country: "India",
    },
    capacity: { min: 100, max: 600 },
    price: 90000,
    amenities: ["Mughal Architecture", "AC Hall", "Mandap Area", "Parking", "Sound System", "Generator Backup"],
    images: [
      img("1677768062274-fdd45caac233"),
      img("1519167758481-83f550bb49b3"),
      img("1511795409834-ef04bbd61622"),
    ],
    description:
      "Nawabi-style banquet with carved arches and a dedicated mandap area, steps away from Lucknow's heritage quarter.",
    rating: 4.4,
  },
  {
    name: "Garden Pavilion Lawns",
    type: "marriage-lawn",
    location: {
      address: "8 Mall Road, Civil Lines",
      city: "Kanpur",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 200, max: 1200 },
    price: 65000,
    amenities: ["2 Acre Lawn", "Gazebo", "Parking for 300 cars", "Rooms for Family", "Lighting", "Stage"],
    images: [
      img("1523438885200-e635ba2c371e"),
      img("1522673607200-164d1b6ce486"),
      img("1469371670807-013ccf25f16a"),
    ],
    description:
      "Two acres of manicured lawns with a white gazebo, ideal for large baraat processions and open-air pheras.",
    rating: 4.1,
  },
  {
    name: "The Grand Imperial Resort",
    type: "hotel",
    location: {
      address: "Fatehabad Road",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 250000,
    amenities: ["Poolside Lawn", "Rooftop Terrace", "Luxury Suites", "Spa", "Fine Dining", "Guest Transfers"],
    images: [
      img("1542314831-068cd1dbfeeb"),
      img("1566073771259-6a8506099945"),
      img("1551882547-ff40c63fe5fa"),
    ],
    description:
      "A luxury resort with a lit poolside lawn for evening receptions, a rooftop sangeet terrace, a grand ballroom and suites for the whole family.",
    rating: 4.9,
  },
  {
    name: "Amer Fort Heritage Palace",
    type: "destination",
    location: {
      address: "Amer Road, Near Amer Fort",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 100, max: 800 },
    price: 350000,
    amenities: ["Royal Courtyard", "Elephant Baraat", "Heritage Rooms", "Folk Performers", "Palace Lighting", "Guest Transfers"],
    images: [
      img("1599661046289-e31897846e41"),
      img("1477587458883-47145ed94245"),
      img("1587271407850-8d438ca9fdf2"),
    ],
    description:
      "A true royal Rajasthani wedding in a restored palace courtyard, with an elephant baraat and folk performers on request.",
    rating: 4.9,
  },
  {
    name: "Goa Beachfront Resort",
    type: "destination",
    location: {
      address: "Candolim Beach Road, Candolim",
      city: "Goa",
      state: "Goa",
      country: "India",
    },
    capacity: { min: 50, max: 350 },
    price: 280000,
    amenities: ["Private Beach", "Sunset Deck", "Poolside Cocktail", "Resort Stay", "Beach Bonfire", "Spa"],
    images: [
      img("1512343879784-a960bf40e7f2"),
      img("1600011689032-8b628b8a8747"),
      img("1537633552985-df8429e8048b"),
    ],
    description:
      "Barefoot pheras on a private beach, a sunset cocktail deck and a bonfire after-party by the sea.",
    rating: 4.8,
  },
  {
    name: "Palm Grove Resort & Spa",
    type: "destination",
    location: {
      address: "Lake Pichola Road",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 80, max: 400 },
    price: 220000,
    amenities: ["Lakeside Lawn", "Infinity Pool", "Spa", "Luxury Villas", "Boat Entry for Couple", "Fine Dining"],
    images: [
      img("1551882547-ff40c63fe5fa"),
      img("1571896349842-33c89424de2d"),
      img("1582719478250-c89cae4dc85b"),
    ],
    description:
      "Lakeside resort in the City of Lakes with pool villas, a lawn by the water and a boat entry for the couple.",
    rating: 4.7,
  },
  {
    name: "Shubh Vivah Lawns",
    type: "marriage-lawn",
    location: {
      address: "Tonk Road, Durgapura",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 150, max: 900 },
    price: 95000,
    amenities: ["Parking", "Mandap Area", "Lighting", "Generator Backup", "Catering Kitchen"],
    images: [img("1587271636175-90d58cdad458"), img("1465495976277-4387d4b0b4c6")],
    description:
      "A sprawling open lawn with a floral mandap setup, ideal for traditional pheras and large baraat gatherings.",
    rating: 4.4,
  },
  {
    name: "Green Meadows Marriage Lawn",
    type: "marriage-lawn",
    location: {
      address: "Faizabad Road, Indira Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 100, max: 600 },
    price: 70000,
    amenities: ["Parking", "Stage", "Lighting", "Green Room", "Dance Floor"],
    images: [img("1507504031003-b417219a0fde"), img("1519741497674-611481863552")],
    description:
      "Tree-lined garden lawn with rustic decor options, perfect for day weddings and evening receptions under the stars.",
    rating: 4.3,
  },
  {
    name: "Orchard Valley Lawns",
    type: "marriage-lawn",
    location: {
      address: "Fatehabad Road, Tajganj",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 200, max: 1000 },
    price: 60000,
    amenities: ["Parking", "Lighting", "Generator Backup", "Guest Rooms", "Catering Kitchen"],
    images: [img("1522673607200-164d1b6ce486"), img("1520854221256-17451cc331bf")],
    description:
      "A green lawn set among fruit orchards, with a large open area for grand ceremonies and generous parking.",
    rating: 4.2,
  },
  {
    name: "Rajmahal Banquet Hall",
    type: "banquet-hall",
    location: {
      address: "Mall Road, Civil Lines",
      city: "Kanpur",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 150, max: 700 },
    price: 80000,
    amenities: ["AC", "Stage", "Valet Parking", "Bridal Suite", "In-house Catering"],
    images: [img("1510076857177-7470076d4098"), img("1515934751635-c81c6bc9a2d8")],
    description:
      "A fully air-conditioned hall with draped ceilings and warm lighting, suited to receptions and sangeet nights.",
    rating: 4.5,
  },
  {
    name: "Silver Oak Banquets",
    type: "banquet-hall",
    location: {
      address: "JLN Marg, Malviya Nagar",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 75000,
    amenities: ["AC", "Stage", "Parking", "Sound System", "In-house Catering"],
    images: [img("1561912774-79769a0a0a7a"), img("1464366400600-7168b8af9bc3")],
    description:
      "A banquet hall with elegant table settings and a dedicated decor team for intimate to mid-size weddings.",
    rating: 4.4,
  },
  {
    name: "Grandeur Convention Centre",
    type: "banquet-hall",
    location: {
      address: "Shaheed Path, Sushant Golf City",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 300, max: 1500 },
    price: 150000,
    amenities: ["AC", "LED Screens", "Valet Parking", "Multiple Halls", "In-house Catering"],
    images: [img("1511578314322-379afb476865"), img("1519167758481-83f550bb49b3")],
    description:
      "One of the largest pillar-less halls in the city, with LED screens and multiple halls for back-to-back functions.",
    rating: 4.6,
  },
  {
    name: "Aravalli Heights Hotel",
    type: "hotel",
    location: {
      address: "Ambrai Ghat Road",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 80, max: 350 },
    price: 210000,
    amenities: ["Mountain View", "Rooftop Terrace", "Luxury Suites", "Spa", "Fine Dining"],
    images: [img("1445019980597-93fa8acb246c"), img("1582719478250-c89cae4dc85b")],
    description:
      "A hilltop hotel with sweeping Aravalli views, a rooftop terrace for the sangeet and suites for the whole family.",
    rating: 4.7,
  },
  {
    name: "The Pink City Grand",
    type: "hotel",
    location: {
      address: "MI Road, C-Scheme",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 150, max: 600 },
    price: 240000,
    amenities: ["Poolside Lawn", "Ballroom", "Luxury Suites", "Spa", "Guest Transfers"],
    images: [img("1564501049412-61c2a3083791"), img("1582719478250-c89cae4dc85b")],
    description:
      "A luxury city hotel with a poolside lawn for mehndi, a grand ballroom for the reception and premium guest rooms.",
    rating: 4.6,
  },
  {
    name: "Cliffside Bay Hotel",
    type: "hotel",
    location: {
      address: "Vagator Beach Road",
      city: "Goa",
      state: "Goa",
      country: "India",
    },
    capacity: { min: 60, max: 300 },
    price: 260000,
    amenities: ["Infinity Pool", "Sea View", "Luxury Suites", "Spa", "Beach Access"],
    images: [img("1540541338287-41700207dee6"), img("1520250497591-112f2f40a3f4")],
    description:
      "A clifftop hotel with an infinity pool overlooking the Arabian Sea, made for sunset vows and poolside parties.",
    rating: 4.8,
  },
  {
    name: "Hawa Mahal Heritage Haveli",
    type: "destination",
    location: {
      address: "Badi Choupad, Old City",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 320000,
    amenities: ["Heritage Courtyard", "Folk Performances", "Royal Suites", "Elephant Baraat", "Fine Dining"],
    images: [img("1477587458883-47145ed94245"), img("1587271636175-90d58cdad458")],
    description:
      "A restored haveli in the old city with a heritage courtyard, folk performances and a royal baraat experience.",
    rating: 4.7,
  },
  {
    name: "Sunset Cabana Beach Resort",
    type: "destination",
    location: {
      address: "Candolim Beach",
      city: "Goa",
      state: "Goa",
      country: "India",
    },
    capacity: { min: 50, max: 250 },
    price: 300000,
    amenities: ["Beach Cabanas", "Private Beach", "Pool", "Sunset Deck", "Guest Villas"],
    images: [img("1571003123894-1f0594d2b5d9"), img("1520250497591-112f2f40a3f4")],
    description:
      "A private beach resort with poolside cabanas and a sunset deck for barefoot beach weddings.",
    rating: 4.6,
  },
  {
    name: "Lakeview Hills Retreat",
    type: "destination",
    location: {
      address: "Fateh Sagar Lake Road",
      city: "Udaipur",
      state: "Rajasthan",
      country: "India",
    },
    capacity: { min: 40, max: 200 },
    price: 275000,
    amenities: ["Lake View", "Open-air Deck", "Boutique Suites", "Spa", "Boat Transfers"],
    images: [img("1596394516093-501ba68a0ba6"), img("1445019980597-93fa8acb246c")],
    description:
      "A boutique retreat above the lake with an open-air deck, ideal for intimate destination weddings.",
    rating: 4.5,
  },
];

const sampleServices = [
  // Photography
  {
    name: "Wedding Photography - Candid & Traditional",
    category: "photography",
    providerName: "Capture Moments Studio",
    price: 40000,
    description:
      "Professional wedding photography blending candid moments with traditional poses. Multiple photographers.",
    location: UP,
    features: ["Pre-wedding Shoot", "Candid Photography", "Traditional Poses", "Album Design", "All Digital Copies"],
    images: [img("1554048612-b6a482bc67e5"), img("1591604466107-ec97de577aff"), img("1583939003579-730e3918a45a")],
    experience: "10 years",
    rating: 4.6,
  },
  {
    name: "Candid Stories Photography",
    category: "photography",
    providerName: "Aarav Candid Stories",
    price: 65000,
    description:
      "Documentary-style candid coverage by a two-photographer team. Natural, emotional frames with no forced poses.",
    location: UP,
    features: ["2 Candid Photographers", "Haldi to Reception", "600+ Edited Photos", "Online Gallery", "Premium Album"],
    images: [img("1537633552985-df8429e8048b"), img("1606216794074-735e91aa2c92"), img("1546032996-6dfacbacbf3f")],
    experience: "8 years",
    rating: 4.8,
  },
  {
    name: "Royal Frames Traditional Photography",
    category: "photography",
    providerName: "Royal Frames",
    price: 30000,
    description:
      "Classic family portraits and ritual coverage with studio lighting on site. Great value for large families.",
    location: UP,
    features: ["Traditional Coverage", "Family Portraits", "Studio Lighting", "2 Albums", "Printed Photos"],
    images: [img("1502982720700-bfff97f2ecac"), img("1583939003579-730e3918a45a")],
    experience: "15 years",
    rating: 4.3,
  },
  {
    name: "Pre-Wedding Destination Shoot",
    category: "photography",
    providerName: "Wanderlust Frames",
    price: 45000,
    description:
      "A full-day styled pre-wedding shoot at a location of your choice, including outfit changes and a teaser reel.",
    location: UP,
    features: ["Full Day Shoot", "3 Outfit Changes", "Location Scouting", "Teaser Reel", "100 Edited Photos"],
    images: [img("1604017011826-d3b4c23f8914"), img("1478146896981-b80fe463b330"), img("1544078751-58fee2d8a03b")],
    experience: "6 years",
    rating: 4.7,
  },

  // Videography
  {
    name: "Wedding Videography & Cinematography",
    category: "videography",
    providerName: "Motion Pictures Studio",
    price: 55000,
    description:
      "Cinematic wedding films with drone shots and professional editing. Highlight films and full coverage.",
    location: UP,
    features: ["Drone Shots", "Cinematic Editing", "Highlight Film", "Full Coverage", "Same Day Edit"],
    images: [img("1485846234645-a62644f84728"), img("1473968512647-3e447244af8f"), img("1591604466107-ec97de577aff")],
    experience: "9 years",
    rating: 4.6,
  },
  {
    name: "Reel Love Cinematic Films",
    category: "videography",
    providerName: "Reel Love Films",
    price: 85000,
    description:
      "Story-driven wedding films with 4K cinema cameras, recorded vows and a 5-minute highlight made for Instagram.",
    location: UP,
    features: ["4K Cinema Cameras", "Recorded Vows Audio", "5-min Highlight", "Full-length Film", "Instagram Reels"],
    images: [img("1532712938310-34cb3982ef74"), img("1485846234645-a62644f84728")],
    experience: "7 years",
    rating: 4.9,
  },
  {
    name: "SkyHigh Drone Coverage",
    category: "videography",
    providerName: "SkyHigh Aerials",
    price: 25000,
    description:
      "Licensed drone pilots for aerial shots of your baraat, venue and pheras. Add-on to any video package.",
    location: UP,
    features: ["Licensed Pilots", "4K Aerial Footage", "Baraat Coverage", "Venue Reveal Shots", "Raw Footage"],
    images: [img("1508614589041-895b88991e3e"), img("1473968512647-3e447244af8f")],
    experience: "5 years",
    rating: 4.5,
  },
  {
    name: "Photo + Video Combo Bundle",
    category: "videography",
    providerName: "Capture Moments Studio",
    price: 85000,
    description:
      "Bundle deal: candid photography plus cinematic videography from one team, so nothing gets missed and you save.",
    location: UP,
    features: ["Photo + Video Team", "Highlight Film", "Premium Album", "Drone Shots", "Save 10%"],
    images: [img("1492691527719-9d1e07e534b4"), img("1606216794074-735e91aa2c92")],
    experience: "10 years",
    rating: 4.7,
  },

  // DJ & Music
  {
    name: "DJ & Entertainment Services",
    category: "music",
    providerName: "Sound Waves Entertainment",
    price: 20000,
    description:
      "Professional DJ with latest music, sound system, and lighting for sangeet and reception.",
    location: UP,
    features: ["Professional DJ", "Sound System", "Lighting", "Latest Music", "Emcee Services"],
    images: [img("1470225620780-dba8ba36b745"), img("1574391884720-bbc3740c59d1")],
    experience: "8 years",
    rating: 4.4,
  },
  {
    name: "DJ Rohan Premium Sangeet Night",
    category: "music",
    providerName: "DJ Rohan Live",
    price: 45000,
    description:
      "Celebrity-circuit DJ with LED dance floor, CO2 jets and cold pyros. Bollywood, Punjabi and EDM sets on request.",
    location: UP,
    features: ["LED Dance Floor", "CO2 Jets", "Cold Pyros", "Truss Lighting", "Custom Playlist"],
    images: [img("1459749411175-04bf5292ceea"), img("1501281668745-f7f57925c3b4"), img("1492684223066-81342ee5ff30")],
    experience: "12 years",
    rating: 4.8,
  },
  {
    name: "Baraat Dhol & Brass Band",
    category: "music",
    providerName: "Punjab Da Dhol",
    price: 18000,
    description:
      "High-energy dhol players and a brass band for the baraat, with a mobile sound cart and lights.",
    location: UP,
    features: ["4 Dhol Players", "Brass Band", "Mobile Sound Cart", "Baraat Lights", "Ghodi Arrangement"],
    images: [img("1516450360452-9312f5e86fc7"), img("1574391884720-bbc3740c59d1")],
    experience: "20 years",
    rating: 4.5,
  },
  {
    name: "Live Sufi & Ghazal Night",
    category: "music",
    providerName: "Awadh Sufi Ensemble",
    price: 60000,
    description:
      "A soulful live band for a mehfil-style evening: Sufi, ghazals and qawwali, with an acoustic sound setup.",
    location: UP,
    features: ["6-piece Live Band", "Qawwali Set", "Ghazal Set", "Acoustic Sound", "2.5 Hour Show"],
    images: [img("1511671782779-c97d3d27a1d4"), img("1470229722913-7c0e2dbbafd3")],
    experience: "14 years",
    rating: 4.9,
  },

  // Catering
  {
    name: "Premium Catering Service",
    category: "catering",
    providerName: "Royal Caterers Lucknow",
    price: 50000,
    description:
      "Authentic Awadhi cuisine with live counters for chaat, kebabs, and biryani. Professional service staff.",
    location: UP,
    features: ["Awadhi Cuisine", "Live Counters", "Professional Staff", "Hygienic Kitchen", "Veg & Non-Veg"],
    images: [img("1555244162-803834f70033"), img("1589302168068-964664d93dc0")],
    experience: "18 years",
    rating: 4.6,
  },
  {
    name: "Awadhi Dastarkhwan Caterers",
    category: "catering",
    providerName: "Dastarkhwan Lucknow",
    price: 75000,
    description:
      "Heritage Lucknowi menu of galouti kebabs, dum biryani and sheermal, served by staff in traditional attire.",
    location: UP,
    features: ["Galouti & Kakori Kebabs", "Dum Biryani", "Traditional Service", "Dessert Counter", "Tasting Session"],
    images: [img("1589302168068-964664d93dc0"), img("1585937421612-70a008356fbe")],
    experience: "25 years",
    rating: 4.9,
  },
  {
    name: "Global Fusion Buffet",
    category: "catering",
    providerName: "Spice Route Catering",
    price: 60000,
    description:
      "Indian, Continental, Chinese and Italian counters with a mocktail bar. Great for mixed-taste guest lists.",
    location: UP,
    features: ["Multi-cuisine", "Mocktail Bar", "Live Pasta Counter", "Jain Options", "Dessert Station"],
    images: [img("1600891964599-f61ba0e24092"), img("1504674900247-0877df9cc836"), img("1414235077428-338989a2e8c0")],
    experience: "11 years",
    rating: 4.5,
  },

  // Makeup
  {
    name: "Bridal Makeup & Hair Studio",
    category: "makeup",
    providerName: "Glamour Bridal Studio",
    price: 25000,
    description:
      "Professional bridal makeup and hairstyling for the perfect wedding look. Traditional and contemporary styles.",
    location: UP,
    features: ["Bridal Makeup", "Hairstyling", "Pre-wedding Consultation", "On-site Service", "Traditional Styles"],
    images: [img("1487412947147-5cebf100ffc2"), img("1522335789203-aabd1fc54bc9")],
    experience: "9 years",
    rating: 4.6,
  },
  {
    name: "Airbrush HD Bridal Makeup",
    category: "makeup",
    providerName: "Blush by Sana",
    price: 40000,
    description:
      "Long-wear airbrush HD makeup that stays flawless through pheras and photos, with draping and hair included.",
    location: UP,
    features: ["Airbrush HD", "Saree/Lehenga Draping", "Hair Styling", "Trial Session", "Touch-up Kit"],
    images: [img("1522335789203-aabd1fc54bc9"), img("1487412947147-5cebf100ffc2")],
    experience: "7 years",
    rating: 4.8,
  },
  {
    name: "Family & Groom Grooming Package",
    category: "makeup",
    providerName: "The Salon Collective",
    price: 18000,
    description:
      "Makeup and hair for up to 6 family members plus groom grooming, at your venue.",
    location: UP,
    features: ["6 Family Members", "Groom Grooming", "Hair Styling", "On-site Team", "Party Makeup"],
    images: [img("1562322140-8baeececf3df"), img("1560066984-138dadb4c035")],
    experience: "6 years",
    rating: 4.4,
  },

  // Decoration
  {
    name: "Floral & Theme Decoration",
    category: "decoration",
    providerName: "Bloom & Decorate",
    price: 35000,
    description:
      "Beautiful floral arrangements and theme-based decorations for mandap and venue.",
    location: UP,
    features: ["Floral Arrangements", "Theme Decor", "Mandap Decoration", "Stage Setup", "Lighting"],
    images: [img("1457089328109-e5d9bd499191"), img("1469371670807-013ccf25f16a")],
    experience: "10 years",
    rating: 4.5,
  },
  {
    name: "Royal Mandap Designers",
    category: "decoration",
    providerName: "Shaadi Sets & Mandaps",
    price: 80000,
    description:
      "Grand custom mandaps, entrance gates and stage backdrops inspired by Mughal and Rajasthani palaces.",
    location: UP,
    features: ["Custom Mandap", "Entrance Gate", "Stage Backdrop", "Fresh Flowers", "3D Design Preview"],
    images: [img("1587271407850-8d438ca9fdf2"), img("1523438885200-e635ba2c371e")],
    experience: "16 years",
    rating: 4.8,
  },
  {
    name: "Fairy Lights & Reception Decor",
    category: "decoration",
    providerName: "Twinkle Events",
    price: 28000,
    description:
      "Fairy-light canopies, table centrepieces and a photo booth for a dreamy reception.",
    location: UP,
    features: ["Fairy Light Canopy", "Table Centrepieces", "Photo Booth", "Welcome Signage", "Confetti Blast"],
    images: [img("1519225421980-715cb0215aed"), img("1513151233558-d860c5398176")],
    experience: "5 years",
    rating: 4.3,
  },

  // Mehndi
  {
    name: "Bridal Mehndi by Zoya",
    category: "mehndi",
    providerName: "Henna Art by Zoya",
    price: 15000,
    description:
      "Intricate organic-henna bridal designs with hidden names and portraits, plus guest mehndi.",
    location: UP,
    features: ["Organic Henna", "Full Hands & Feet", "Hidden Names", "Portrait Designs", "Guest Mehndi"],
    images: [img("1545232979-8bf68ee9b1af")],
    experience: "9 years",
    rating: 4.7,
  },
  {
    name: "Rajasthani Mehndi Artists Team",
    category: "mehndi",
    providerName: "Marwar Mehndi Arts",
    price: 22000,
    description:
      "A team of 5 artists so every guest gets mehndi, with traditional Rajasthani and Arabic patterns.",
    location: UP,
    features: ["5 Artists", "Unlimited Guests (4 hrs)", "Rajasthani Designs", "Arabic Designs", "Bride Included"],
    images: [img("1752824250540-b5c8387f1ad0"), img("1520854221256-17451cc331bf")],
    experience: "12 years",
    rating: 4.5,
  },
];

// Upsert by name so re-running the seed never breaks existing bookings
const upsertByName = (Model, docs) =>
  Model.bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { name: doc.name },
        update: { $set: doc },
        upsert: true,
      },
    }))
  );

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/wedding-planner"
    );
    console.log("✅ Connected to MongoDB");

    const venues = await upsertByName(
      Venue,
      sampleVenues.map((v) => ({ ...v, isActive: true }))
    );
    console.log(
      `✅ Venues: ${venues.upsertedCount} added, ${venues.modifiedCount} updated`
    );

    const services = await upsertByName(
      Service,
      sampleServices.map((s) => ({ ...s, available: true }))
    );
    console.log(
      `✅ Services: ${services.upsertedCount} added, ${services.modifiedCount} updated`
    );

    console.log("\n🎉 Sample data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
