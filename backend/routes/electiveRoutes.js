const express = require("express");
const { addElective, getElectives, updateElective, deleteElective, getElectivesForStudent } = require("../controllers/electiveController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// CRUD endpoints
router.post("/", protect, adminOnly, addElective);          // Add new elective
router.get("/", getElectives);          // Get electives (with filters) - public for students
router.get("/my", protect, getElectivesForStudent);  // Get electives for logged-in student
router.put("/:id", protect, adminOnly, updateElective);     // Update elective
router.delete("/:id", protect, adminOnly, deleteElective);  // Delete elective

module.exports = router;
