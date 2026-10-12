const fs = require("fs");
const os = require("os");
const path = require("path");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// With Cloudinary keys set, photos are stored there (needed on Vercel, whose
// disk doesn't keep files). Without them they are saved under uploadsRoot.
const useCloudinary = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
);
if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}
const CLOUD_FOLDER = "wedding-planner";

// Vercel's disk is read-only apart from /tmp (files there don't persist)
const uploadsRoot = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.join(__dirname, "..", "uploads");

const uniqueName = (prefix) =>
  `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

// Photo upload for one folder (field "images", up to 10)
const imageUpload = (folder, prefix) => {
  let storage;
  if (useCloudinary) {
    storage = multer.memoryStorage();
  } else {
    const dir = path.join(uploadsRoot, folder);
    fs.mkdirSync(dir, { recursive: true });
    storage = multer.diskStorage({
      destination: (req, file, cb) => cb(null, dir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
        cb(null, `${uniqueName(prefix)}${ext}`);
      },
    });
  }

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

const uploadToCloudinary = (file, folder, prefix) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `${CLOUD_FOLDER}/${folder}`,
          public_id: uniqueName(prefix),
          resource_type: "image",
        },
        (err, result) => (err ? reject(err) : resolve(result.secure_url))
      )
      .end(file.buffer);
  });

// Runs an upload and turns multer errors (wrong type, too large) into a 400.
// With Cloudinary, each file's URL is stored on file.url.
const handleUpload = (upload, folder, prefix) => (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!useCloudinary || !req.files) return next();
    try {
      for (const file of req.files) {
        file.url = await uploadToCloudinary(file, folder, prefix);
      }
      next();
    } catch (error) {
      console.error("Cloudinary upload failed:", error.message);
      res.status(502).json({ message: "Photo upload failed, please try again" });
    }
  });
};

// Public URLs for the files just uploaded
const uploadedUrls = (req, folder) => {
  const base = `${req.protocol}://${req.get("host")}`;
  return req.files.map(
    (f) => f.url || `${base}/uploads/${folder}/${f.filename}`
  );
};

// Deletes uploaded photos (Cloudinary or uploads/<folder>) these URLs point to
const removeUploadedImages = (urls, folder) => {
  const localPattern = new RegExp(`/uploads/${folder}/([\\w.-]+)$`);
  const cloudPattern = new RegExp(
    `/image/upload/(?:v\\d+/)?(${CLOUD_FOLDER}/${folder}/[\\w-]+)\\.\\w+$`
  );
  urls.forEach((url) => {
    const cloud = url.match(cloudPattern);
    if (cloud && useCloudinary) {
      cloudinary.uploader.destroy(cloud[1]).catch(() => {});
      return;
    }
    const local = url.match(localPattern);
    if (local) {
      fs.unlink(path.join(uploadsRoot, folder, local[1]), () => {});
    }
  });
};

module.exports = {
  uploadVenueImages: handleUpload(imageUpload("venues", "venue"), "venues", "venue"),
  uploadVendorImages: handleUpload(imageUpload("vendors", "vendor"), "vendors", "vendor"),
  uploadedUrls,
  removeUploadedImages,
};
