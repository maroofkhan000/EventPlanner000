const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, getUserBookings);

router.route("/:id").get(protect, getBookingById);

module.exports = router;
