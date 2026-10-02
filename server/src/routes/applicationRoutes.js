const express = require("express");

const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication,
} = require("../controllers/applicationController");


// GET /api/applications
router.get("/", protect, getApplications);


// POST /api/applications
router.post("/", protect, createApplication);


// PUT /api/applications/:id
router.put("/:id", protect, updateApplication);


// DELETE /api/applications/:id
router.delete("/:id", protect, deleteApplication);


module.exports = router;