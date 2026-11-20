const express = require("express");
const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("./address.Controller");
const { requireAuth } = require("../../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", getAddresses);
router.post("/", addAddress);
router.patch("/:id/default", setDefaultAddress);
router.patch("/:id", updateAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
