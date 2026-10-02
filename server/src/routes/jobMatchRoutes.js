const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  matchJobDescription,
} = require("../controllers/jobMatchController");

router.post(
  "/match",
  protect,
  upload.single("resume"),
  matchJobDescription
);

module.exports = router;