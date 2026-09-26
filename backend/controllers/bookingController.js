const Booking = require("../models/Booking");

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      venue,
      services,
      eventDate,
      guestCount,
      totalAmount,
      specialRequests,
    } = req.body;

    const booking = new Booking({
      user: req.user._id,
      venue,
      services,
      eventDate,
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
