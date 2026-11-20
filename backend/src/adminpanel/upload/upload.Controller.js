const { ApiError } = require("../../middleware/errorHandler");
const service = require("./upload.Service");

const uploadImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, "No image received.");
  }
  res.status(201).json({ urls: service.toUrls(req, req.files) });
};

module.exports = { uploadImages };
