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
      img("1587271407850-8d438ca9fdf2"),
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
      img("1587271407850-8d438ca9fdf2"),
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
    name: "Taj View Palace Hotel",
    type: "hotel",
    location: {
      address: "Taj East Gate Road, Tajganj",
      city: "Agra",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 250000,
    amenities: ["Taj Mahal View", "Rooftop Terrace", "Luxury Suites", "Spa", "Fine Dining", "Guest Transfers"],
    images: [
      img("1524492412937-b28074a5d7da"),
      img("1624763149686-1893acf73092"),
      img("1542314831-068cd1dbfeeb"),
    ],
    description:
      "Say your vows with the Taj Mahal in view. Rooftop sangeet terrace, grand ballroom and suites for the whole family.",
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
    images: [img("1545232979-8bf68ee9b1af"), img("1520854221256-17451cc331bf")],
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
