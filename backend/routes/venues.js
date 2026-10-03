const express = require("express");
const {
  getVenues,
  getVenueById,
  getVenueAvailability,
  createVenue,
  uploadVenueImages,
  deleteVenue,
  addVenueReview,
} = require("../controllers/venueController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

router.route("/").get(getVenues).post(protect, admin, createVenue);

router.post("/upload", protect, admin, upload.uploadVenueImages, uploadVenueImages);

router.route("/:id").get(getVenueById).delete(protect, admin, deleteVenue);

router.route("/:id/availability").get(getVenueAvailability);

router.route("/:id/reviews").post(protect, addVenueReview);

module.exports = router;
