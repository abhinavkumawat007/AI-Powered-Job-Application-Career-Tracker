const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  analyzeResume,
} = require("../controllers/resumeController");

router.post(
  "/analyze",
  protect,
  upload.single("resume"),
  analyzeResume
);

module.exports = router;