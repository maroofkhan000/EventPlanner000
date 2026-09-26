const mongoose = require("mongoose");
const Venue = require("./models/Venue");
const Service = require("./models/Service");
const User = require("./models/User");
require("dotenv").config();

const sampleVenues = [
  {
    name: "Royal Garden Lawn",
    type: "marriage-lawn",
    location: {
      address: "123 Garden Road, Gomti Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 100, max: 500 },
    price: 85000,
    amenities: [
      "Parking",
      "AC",
      "Stage",
      "Lighting",
      "Dance Floor",
      "Green Room",
    ],
    images: [
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    ],
    description:
      "Beautiful outdoor lawn with lush garden surroundings, perfect for grand wedding celebrations. Features elegant decor and ample parking space.",
    availableDates: [
      new Date("2024-12-15"),
      new Date("2024-12-20"),
      new Date("2024-12-25"),
    ],
    rating: 4.5,
    isActive: true,
  },
  {
    name: "Grand Palace Hotel",
    type: "hotel",
    location: {
      address: "456 Luxury Street, Hazratganj",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 150, max: 800 },
    price: 120000,
    amenities: [
      "AC Banquet Hall",
      "Valet Parking",
      "Luxury Suites",
      "Spa",
      "Pool",
      "Fine Dining",
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    ],
    description:
      "Luxurious hotel ballroom with premium amenities and five-star service. Perfect for royal wedding celebrations.",
    availableDates: [
      new Date("2024-12-10"),
      new Date("2024-12-18"),
      new Date("2024-12-28"),
    ],
    rating: 4.8,
    isActive: true,
  },
  {
    name: "Heritage Marriage Hall",
    type: "banquet-hall",
    location: {
      address: "789 Cultural Avenue, Alambagh",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 200, max: 1000 },
    price: 95000,
    amenities: [
      "AC Hall",
      "Parking",
      "Catering",
      "Decoration",
      "Sound System",
      "Projector",
    ],
    images: [
      "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    ],
    description:
      "Spacious banquet hall with traditional Lucknowi architecture and modern amenities.",
    availableDates: [
      new Date("2024-12-12"),
      new Date("2024-12-22"),
      new Date("2024-12-30"),
    ],
    rating: 4.3,
    isActive: true,
  },
  {
    name: "Riverside Wedding Resort",
    type: "destination",
    location: {
      address: "101 River View, Near Gomti River",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 50, max: 300 },
    price: 150000,
    amenities: [
      "River View",
      "Resort Stay",
      "Poolside Events",
      "Gardens",
      "Waterfall",
    ],
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    ],
    description:
      "Exclusive riverside resort perfect for intimate destination weddings with beautiful natural surroundings.",
    availableDates: [new Date("2024-12-14"), new Date("2024-12-24")],
    rating: 4.7,
    isActive: true,
  },
  {
    name: "Elegant Lawn & Convention",
    type: "marriage-lawn",
    location: {
      address: "234 Green Park, Indira Nagar",
      city: "Lucknow",
      state: "Uttar Pradesh",
      country: "India",
    },
    capacity: { min: 80, max: 400 },
    price: 75000,
    amenities: [
      "Lawn Area",
      "Indoor Backup",
      "Catering",
      "Lighting",
      "Parking",
      "Stage",
    ],
    images: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    ],
    description:
      "Beautiful lawn with indoor convention center backup. Perfect for all weather weddings.",
    availableDates: [new Date("2024-12-16"), new Date("2024-12-26")],
    rating: 4.2,
    isActive: true,
  },
];

const sampleServices = [
  {
    name: "Premium Catering Service",
    category: "catering",
    providerName: "Royal Caterers Lucknow",
    price: 50000,
    description:
      "Authentic Awadhi cuisine with live counters for chaat, kebabs, and biryani. Professional service staff.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Awadhi Cuisine",
      "Live Counters",
      "Professional Staff",
      "Hygienic Kitchen",
      "Veg & Non-Veg",
    ],
    available: true,
  },
  {
    name: "Bridal Makeup & Hair Studio",
    category: "makeup",
    providerName: "Glamour Bridal Studio",
    price: 25000,
    description:
      "Professional bridal makeup and hairstyling for the perfect wedding look. Traditional and contemporary styles.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Bridal Makeup",
      "Hairstyling",
      "Pre-wedding Consultation",
      "On-site Service",
      "Traditional Styles",
    ],
    available: true,
  },
  {
    name: "Wedding Photography - Candid & Traditional",
    category: "photography",
    providerName: "Capture Moments Studio",
    price: 40000,
    description:
      "Professional wedding photography blending candid moments with traditional poses. Multiple photographers.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Pre-wedding Shoot",
      "Candid Photography",
      "Traditional Poses",
      "Album Design",
      "All Digital Copies",
    ],
    available: true,
  },
  {
    name: "Wedding Videography & Cinematography",
    category: "videography",
    providerName: "Motion Pictures Studio",
    price: 55000,
    description:
      "Cinematic wedding films with drone shots and professional editing. Highlight films and full coverage.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Drone Shots",
      "Cinematic Editing",
      "Highlight Film",
      "Full Coverage",
      "Same Day Edit",
    ],
    available: true,
  },
  {
    name: "Floral & Theme Decoration",
    category: "decoration",
    providerName: "Bloom & Decorate",
    price: 35000,
    description:
      "Beautiful floral arrangements and theme-based decorations for mandap and venue.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Floral Arrangements",
      "Theme Decor",
      "Mandap Decoration",
      "Stage Setup",
      "Lighting",
    ],
    available: true,
  },
  {
    name: "DJ & Entertainment Services",
    category: "music",
    providerName: "Sound Waves Entertainment",
    price: 20000,
    description:
      "Professional DJ with latest music, sound system, and lighting for sangeet and reception.",
    location: { city: "Lucknow", state: "Uttar Pradesh" },
    features: [
      "Professional DJ",
      "Sound System",
      "Lighting",
      "Latest Music",
      "Emcee Services",
    ],
    available: true,
  },
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/wedding-planner"
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    console.log("🗑️ Clearing existing data...");
    await Venue.deleteMany({});
    await Service.deleteMany({});
    console.log("✅ Existing data cleared");

    // Insert sample venues
    console.log("📝 Inserting sample venues...");
    const venues = await Venue.insertMany(sampleVenues);
    console.log(`✅ ${venues.length} venues inserted`);

    // Insert sample services
    console.log("📝 Inserting sample services...");
    const services = await Service.insertMany(sampleServices);
    console.log(`✅ ${services.length} services inserted`);

    console.log("\n🎉 Sample data inserted successfully!");
    console.log("\n📊 Summary:");
    console.log(`   Venues: ${venues.length}`);
    console.log(`   Services: ${services.length}`);
    console.log("\n📍 All data is for Lucknow city");
    console.log("\n🚀 You can now test the application with real data!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
