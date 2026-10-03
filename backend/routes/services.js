const express = require("express");
const {
  getServices,
  getServiceById,
  createService,
  uploadServiceImages,
  deleteService,
  getServiceAvailability,
} = require("../controllers/serviceController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");
const router = express.Router();

router.route("/").get(getServices).post(protect, admin, createService);

router.post("/upload", protect, admin, upload.uploadVendorImages, uploadServiceImages);

router.route("/:id").get(getServiceById).delete(protect, admin, deleteService);

router.get("/:id/availability", getServiceAvailability);

module.exports = router;
