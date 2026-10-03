const fs = require("fs");
const path = require("path");
const multer = require("multer");

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Photo upload for one folder under backend/uploads (field "images", up to 10)
const imageUpload = (folder, prefix) => {
  const dir = path.join(__dirname, "..", "uploads", folder);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${prefix}-${unique}${ext}`);
    },
  });

  return multer({
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
};

// Runs an upload and turns multer errors (wrong type, too large) into a 400
const handleUpload = (upload) => (req, res, next) => {
  upload(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

// Public URLs for the files multer just saved
const uploadedUrls = (req, folder) => {
  const base = `${req.protocol}://${req.get("host")}`;
  return req.files.map((f) => `${base}/uploads/${folder}/${f.filename}`);
};

// Deletes files in uploads/<folder> that these URLs point to
const removeUploadedImages = (urls, folder) => {
  const pattern = new RegExp(`/uploads/${folder}/([\\w.-]+)$`);
  urls
    .map((url) => url.match(pattern))
    .filter(Boolean)
    .forEach(([, file]) => {
      fs.unlink(path.join(__dirname, "..", "uploads", folder, file), () => {});
    });
};

module.exports = {
  uploadVenueImages: handleUpload(imageUpload("venues", "venue")),
  uploadVendorImages: handleUpload(imageUpload("vendors", "vendor")),
  uploadedUrls,
  removeUploadedImages,
};
