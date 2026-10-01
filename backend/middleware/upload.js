const fs = require("fs");
const path = require("path");
const multer = require("multer");

const venueUploadDir = path.join(__dirname, "..", "uploads", "venues");
fs.mkdirSync(venueUploadDir, { recursive: true });

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, venueUploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `venue-${unique}${ext}`);
  },
});

const uploadVenueImages = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG, WEBP or GIF images are allowed"));
    }
  },
}).array("images", 10);

module.exports = { uploadVenueImages };
