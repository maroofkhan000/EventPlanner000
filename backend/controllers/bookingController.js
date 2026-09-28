const Booking = require("../models/Booking");
const Venue = require("../models/Venue");
const Service = require("../models/Service");
const { isVenueBooked } = require("./venueController");

// Create booking
const createBooking = async (req, res) => {
  try {
    const { venue: venueId, services = [], eventDate, specialRequests } =
      req.body;
    const guestCount = Number(req.body.guestCount);

    if (!venueId) {
      return res.status(400).json({ message: "Please select a venue" });
    }

    const venue = await Venue.findById(venueId);
    if (!venue || !venue.isActive) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const dateStr = String(eventDate || "").slice(0, 10);
    const today = new Date().toISOString().split("T")[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || dateStr < today) {
      return res
        .status(400)
        .json({ message: "Please choose a valid upcoming event date" });
    }

    if (
      !Number.isInteger(guestCount) ||
      guestCount < venue.capacity.min ||
      guestCount > venue.capacity.max
    ) {
      return res.status(400).json({
        message: `Guest count must be between ${venue.capacity.min} and ${venue.capacity.max} for this venue`,
      });
    }

    if (await isVenueBooked(venue._id, dateStr)) {
      return res
        .status(409)
        .json({ message: "This venue is already booked on that date" });
    }

    // Prices come from the database, not the client
    const serviceIds = services.map((s) => s.service?._id || s.service);
    const serviceDocs = await Service.find({
      _id: { $in: serviceIds },
      available: true,
    });
    if (serviceDocs.length !== new Set(serviceIds.map(String)).size) {
      return res
        .status(400)
        .json({ message: "One or more selected services are unavailable" });
    }

    const bookingServices = serviceDocs.map((doc) => ({
      service: doc._id,
      quantity: 1,
      date: dateStr,
      price: doc.price,
    }));

    const totalAmount =
      venue.price + bookingServices.reduce((sum, s) => sum + s.price, 0);

    const booking = new Booking({
      user: req.user._id,
      venue: venue._id,
      services: bookingServices,
      eventDate: dateStr,
      guestCount,
      totalAmount,
      specialRequests,
    });

    const createdBooking = await booking.save();
    res.status(201).json(createdBooking);
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("venue")
      .populate("services.service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("venue")
      .populate("services.service")
      .populate("user", "name email phone");

    if (booking) {
      if (
        booking.user._id.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res
          .status(403)
          .json({ message: "Not authorized to view this booking" });
      }

      res.json(booking);
    } else {
      res.status(404).json({ message: "Booking not found" });
    }
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
};
