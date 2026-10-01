const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getUpiPayment,
  submitPaymentReference,
  getPaymentsForReview,
  reviewPayment,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, getUserBookings);

router.get("/admin/payments", protect, admin, getPaymentsForReview);

router.route("/:id").get(protect, getBookingById);

router.get("/:id/upi", protect, getUpiPayment);
router.post("/:id/payment-reference", protect, submitPaymentReference);
router.put("/:id/payment", protect, admin, reviewPayment);

module.exports = router;
