const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  improveResume,
} = require("../controllers/resumeImproveController");

router.post(
  "/improve",
  protect,
  improveResume
);

module.exports = router;