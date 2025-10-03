const express = require("express");
const { exportPerElective, exportMultiSheet } = require("../controllers/reportController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/per-elective", protect, adminOnly, exportPerElective);
router.get("/multi-sheet", protect, adminOnly, exportMultiSheet);

module.exports = router;
