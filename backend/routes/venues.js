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

// Multer errors (wrong type, too large) come back as a 400 with a message
router.post("/upload", protect, admin, (req, res, next) => {
  upload.uploadVenueImages(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    uploadVenueImages(req, res, next);
  });
});

router.route("/:id").get(getVenueById).delete(protect, admin, deleteVenue);

router.route("/:id/availability").get(getVenueAvailability);

router.route("/:id/reviews").post(protect, addVenueReview);

module.exports = router;
