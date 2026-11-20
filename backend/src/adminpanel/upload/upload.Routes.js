const express = require("express");
const { upload } = require("../middleware/upload");
const c = require("./upload.Controller");

const router = express.Router();

router.post("/", upload.array("images", 10), c.uploadImages);

module.exports = router;
