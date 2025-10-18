const express = require("express");
const { exportPerElective, exportPerElectiveSection, exportMultiSheet } = require("../controllers/reportController");
const { protect, adminOnly, branchAccess } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/per-elective", protect, adminOnly, branchAccess, exportPerElective);
router.get("/per-elective-section", protect, adminOnly, branchAccess, exportPerElectiveSection);
router.get("/multi-sheet", protect, adminOnly, branchAccess, exportMultiSheet);

module.exports = router;
