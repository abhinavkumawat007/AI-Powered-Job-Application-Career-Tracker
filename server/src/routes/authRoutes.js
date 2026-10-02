const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// Authentication
router.post("/register", register);
router.post("/login", login);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Password
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;