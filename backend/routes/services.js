const express = require("express");
const {
  getServices,
  getServiceById,
  createService,
} = require("../controllers/serviceController");
const { protect, admin } = require("../middleware/auth");
const router = express.Router();

router.route("/").get(getServices).post(protect, admin, createService);

router.route("/:id").get(getServiceById);

module.exports = router;
