const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { ApiError } = require("../../middleware/errorHandler");

const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  // Extension comes from the validated mime type, never from the client filename.
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ALLOWED[file.mimetype]}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED[file.mimetype]) {
      return cb(new ApiError(400, "Only JPG, PNG, WEBP or GIF images are allowed."));
    }
    cb(null, true);
  },
});

module.exports = { upload, UPLOAD_DIR };
