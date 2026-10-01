const express = require("express");
const {
  createBooking,
  getUserBookings,
  getBookingById,
  getUpiPayment,
  submitPaymentReference,
  getAllBookings,
  cancelBooking,
  deleteBooking,
  reviewPayment,
} = require("../controllers/bookingController");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

router.route("/").post(protect, createBooking).get(protect, getUserBookings);

router.get("/admin/all", protect, admin, getAllBookings);

router
  .route("/:id")
  .get(protect, getBookingById)
  .delete(protect, admin, deleteBooking);

router.get("/:id/upi", protect, getUpiPayment);
router.post("/:id/payment-reference", protect, submitPaymentReference);
router.put("/:id/payment", protect, admin, reviewPayment);
router.put("/:id/cancel", protect, admin, cancelBooking);

module.exports = router;
