const express = require("express");
const { registerElective, getMyRegistration, getAllRegistrations } = require("../controllers/registrationController");
const { protect, adminOnly, branchAccess } = require("../middleware/authMiddleware");

const router = express.Router();

// Student endpoints
router.post("/", protect, registerElective);
router.get("/me", protect, getMyRegistration);

// Admin endpoint
router.get("/", protect, adminOnly, branchAccess, getAllRegistrations);

module.exports = router;
