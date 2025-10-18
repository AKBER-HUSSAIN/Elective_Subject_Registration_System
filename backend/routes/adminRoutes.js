const express = require("express");
const {
    uploadStudents,
    getStudents,
    getSemesters,
    getElectivesBySemester,
    getSectionsBySemester,
    getFilteredRegistrations,
    uploadMiddleware
} = require("../controllers/adminController");
const { protect, adminOnly, branchAccess } = require("../middleware/authMiddleware");
const router = express.Router();

// All admin routes require authentication, admin role, and branch access
router.use(protect);
router.use(adminOnly);
router.use(branchAccess);

// Test endpoint to verify upload functionality
router.post("/test-upload", uploadMiddleware, (req, res) => {
    console.log("Test upload endpoint hit");
    console.log("File received:", req.file ? "Yes" : "No");
    console.log("User branch:", req.userBranch);
    res.json({
        msg: "Test upload successful",
        fileReceived: !!req.file,
        userBranch: req.userBranch
    });
});

// Upload students from Excel
router.post("/upload-students", uploadMiddleware, uploadStudents);

// Get all students for admin's branch
router.get("/students", getStudents);

// Filtering endpoints
router.get("/semesters", getSemesters);
router.get("/electives/:semester", getElectivesBySemester);
router.get("/sections/:semester", getSectionsBySemester);
router.get("/filtered-registrations", getFilteredRegistrations);

module.exports = router;
