const express = require("express");
const { addElective, getElectives, updateElective, deleteElective } = require("../controllers/electiveController");
const router = express.Router();

// CRUD endpoints
router.post("/", addElective);          // Add new elective
router.get("/", getElectives);          // Get electives (with filters)
router.put("/:id", updateElective);     // Update elective
router.delete("/:id", deleteElective);  // Delete elective

module.exports = router;
