const Venue = require("../models/Venue");
const Booking = require("../models/Booking");

// Start and end of the calendar day (UTC) for a YYYY-MM-DD string
const dayRange = (dateStr) => {
  const start = new Date(`${dateStr}T00:00:00.000Z`);
  if (isNaN(start)) return null;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);
  return { start, end };
};

// True if the venue already has an active booking on that day
const isVenueBooked = async (venueId, dateStr) => {
  const range = dayRange(dateStr);
  if (!range) return false;
  const existing = await Booking.findOne({
    venue: venueId,
    status: { $ne: "cancelled" },
    eventDate: { $gte: range.start, $lt: range.end },
  });
  return Boolean(existing);
};

// Get all venues
const getVenues = async (req, res) => {
  try {
    const { type, city, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (type) query.type = type;
    if (city) query["location.city"] = new RegExp(city, "i");
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    const venues = await Venue.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Venue.countDocuments(query);

    res.json({
      venues,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (error) {
    console.error("Get venues error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get single venue
const getVenueById = async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id);

    if (venue) {
      res.json(venue);
    } else {
      res.status(404).json({ message: "Venue not found" });
    }
  } catch (error) {
    console.error("Get venue error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Check if a venue is free on a given date
const getVenueAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !dayRange(date)) {
      return res.status(400).json({ message: "A valid date is required" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (date < today) {
      return res.json({ available: false, message: "Date is in the past" });
    }

    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const booked = await isVenueBooked(venue._id, date);
    res.json({
      available: !booked,
      message: booked
        ? "Venue is already booked on this date"
        : "Venue is available on this date",
    });
  } catch (error) {
    console.error("Venue availability error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Create venue
const createVenue = async (req, res) => {
  try {
    const venue = new Venue(req.body);
    const createdVenue = await venue.save();
    res.status(201).json(createdVenue);
  } catch (error) {
    console.error("Create venue error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Add review
const addVenueReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const venue = await Venue.findById(req.params.id);

    if (venue) {
      const alreadyReviewed = venue.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res
          .status(400)
          .json({ message: "You have already reviewed this venue" });
      }

      const review = {
        user: req.user._id,
        rating: Number(rating),
        comment,
      };

      venue.reviews.push(review);
      venue.rating =
        venue.reviews.reduce((acc, item) => item.rating + acc, 0) /
        venue.reviews.length;

      await venue.save();
      res.status(201).json({ message: "Review added successfully" });
    } else {
      res.status(404).json({ message: "Venue not found" });
    }
  } catch (error) {
    console.error("Add review error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getVenues,
  getVenueById,
  getVenueAvailability,
  createVenue,
  addVenueReview,
  isVenueBooked,
};
