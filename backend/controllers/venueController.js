const Venue = require("../models/Venue");

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
  createVenue,
  addVenueReview,
};
