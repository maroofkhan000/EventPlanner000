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

// Loads a booking the current user owns, or sends the error response
const findOwnBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("venue", "name");
  if (!booking) {
    res.status(404).json({ message: "Booking not found" });
    return null;
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Not authorized for this booking" });
    return null;
  }
  return booking;
};

// UPI payment details for a booking: the amount always comes from the database
const getUpiPayment = async (req, res) => {
  try {
    const { UPI_ID, UPI_PAYEE_NAME = "Blissful Weddings" } = process.env;
    if (!UPI_ID) {
      return res
        .status(503)
        .json({ message: "UPI payments are not set up yet. Please try later." });
    }

    const booking = await findOwnBooking(req, res);
    if (!booking) return;

    const amount = booking.totalAmount.toFixed(2);
    const ref = booking._id.toString().slice(-8).toUpperCase();
    const note = `Booking ${ref}`;
    const query = new URLSearchParams({
      pa: UPI_ID,
      pn: UPI_PAYEE_NAME,
      am: amount,
      cu: "INR",
      tn: note,
    }).toString();

    res.json({
      upiId: UPI_ID,
      payeeName: UPI_PAYEE_NAME,
      amount: booking.totalAmount,
      reference: ref,
      paymentStatus: booking.paymentStatus,
      query,
      link: `upi://pay?${query}`,
    });
  } catch (error) {
    console.error("UPI payment error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Customer submits the UPI reference (UTR) after paying
const submitPaymentReference = async (req, res) => {
  try {
    const reference = String(req.body.reference || "").replace(/\s/g, "");
    if (!/^\d{12}$/.test(reference)) {
      return res.status(400).json({
        message: "Enter the 12-digit UPI reference / UTR number from your payment app",
      });
    }

    const booking = await findOwnBooking(req, res);
    if (!booking) return;

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking was cancelled" });
    }
    if (booking.paymentStatus === "paid") {
      return res.status(400).json({ message: "This booking is already paid" });
    }

    const used = await Booking.exists({
      _id: { $ne: booking._id },
      paymentReference: reference,
    });
    if (used) {
      return res
        .status(409)
        .json({ message: "This reference number was already used for another booking" });
    }

    booking.paymentReference = reference;
    booking.paymentSubmittedAt = new Date();
    booking.paymentStatus = "verifying";
    await booking.save();

    res.json({ message: "Payment submitted. We'll confirm it shortly.", booking });
  } catch (error) {
    console.error("Submit payment error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: every booking, newest first (the page groups them by status)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("venue", "name location")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 })
      .limit(1000);
    res.json(bookings);
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: cancel a booking. This frees the venue's date again.
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking is already cancelled" });
    }

    booking.status = "cancelled";
    // A payment still waiting for review is dropped; a paid one stays "paid"
    // so the admin can see a refund is due
    if (booking.paymentStatus === "verifying") booking.paymentStatus = "pending";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: permanently delete a booking. Only cancelled bookings can be deleted.
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status !== "cancelled") {
      return res
        .status(400)
        .json({ message: "Cancel the booking before deleting it" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (error) {
    console.error("Delete booking error:", error);
    res.status(400).json({ message: error.message });
  }
};

// Admin: approve or reject a submitted UPI payment
const reviewPayment = async (req, res) => {
  try {
    const { action } = req.body;
    if (!["approve", "reject"].includes(action)) {
      return res.status(400).json({ message: "Action must be approve or reject" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "This booking was cancelled" });
    }
    if (booking.paymentStatus !== "verifying") {
      return res
        .status(400)
        .json({ message: "This booking has no payment waiting for review" });
    }

    if (action === "approve") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
    } else {
      // Customer can pay again / re-enter the reference
      booking.paymentStatus = "pending";
      booking.paymentReference = undefined;
      booking.paymentSubmittedAt = undefined;
    }
    await booking.save();

    res.json({
      message: action === "approve" ? "Payment approved" : "Payment rejected",
      booking,
    });
  } catch (error) {
    console.error("Review payment error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  getUpiPayment,
  submitPaymentReference,
  getAllBookings,
  cancelBooking,
  deleteBooking,
  reviewPayment,
};
