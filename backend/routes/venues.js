const express = require("express");
const {
  getVenues,
  getVenueById,
  createVenue,
  addVenueReview,
} = require("../controllers/venueController");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getVenues).post(protect, admin, createVenue);

router.route("/:id").get(getVenueById);

router.route("/:id/reviews").post(protect, addVenueReview);

module.exports = router;
