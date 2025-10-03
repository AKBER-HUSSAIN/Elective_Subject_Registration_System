const express = require("express");
const { registerElective, getMyRegistration, getAllRegistrations } = require("../controllers/registrationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Student endpoints
router.post("/", protect, registerElective);
router.get("/me", protect, getMyRegistration);

// Admin endpoint
router.get("/", protect, adminOnly, getAllRegistrations);

module.exports = router;
