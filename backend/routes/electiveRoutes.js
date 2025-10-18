const express = require("express");
const { addElective, getElectives, updateElective, deleteElective, getElectivesForStudent } = require("../controllers/electiveController");
const { protect, adminOnly, branchAccess } = require("../middleware/authMiddleware");
const router = express.Router();

// CRUD endpoints
router.post("/", protect, adminOnly, branchAccess, addElective);          // Add new elective
router.get("/", protect, branchAccess, getElectives);          // Get electives (with filters) - filtered by branch
router.get("/my", protect, getElectivesForStudent);  // Get electives for logged-in student
router.put("/:id", protect, adminOnly, branchAccess, updateElective);     // Update elective
router.delete("/:id", protect, adminOnly, branchAccess, deleteElective);  // Delete elective

module.exports = router;
