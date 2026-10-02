const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  askCareerAI,
} = require("../controllers/aiController");

router.post("/career", protect, askCareerAI);

module.exports = router;