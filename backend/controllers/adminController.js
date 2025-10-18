const User = require("../models/User");
const bcrypt = require("bcrypt");
const XLSX = require("xlsx");
const multer = require("multer");

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Excel upload for student creation
exports.uploadStudents = async (req, res) => {
    try {
        console.log("Excel upload started");
        console.log("File received:", req.file ? "Yes" : "No");
        console.log("User branch:", req.userBranch);

        if (!req.file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const branch = req.userBranch; // From middleware
        console.log("Processing for branch:", branch);

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log("Excel data rows:", data.length);
        console.log("First row sample:", data[0]);

        const results = {
            created: 0,
            updated: 0,
            errors: []
        };

        for (const row of data) {
            try {
                const { Name, RollNo, Section, Password, Semester } = row;

                console.log("Processing row:", { Name, RollNo, Section, Password: "***", Semester });

                if (!Name || !RollNo || !Section || !Password || !Semester) {
                    results.errors.push(`Row missing required fields: ${JSON.stringify(row)}`);
                    continue;
                }

                // Check if student already exists
                const existingStudent = await User.findOne({ rollNo: RollNo });

                // Convert password to string to handle numeric passwords from Excel
                const passwordString = String(Password);

                if (existingStudent) {
                    // Update existing student
                    const hashedPassword = await bcrypt.hash(passwordString, 10);
                    await User.findByIdAndUpdate(existingStudent._id, {
                        name: Name,
                        section: Section,
                        password: hashedPassword,
                        branch: branch,
                        role: "student",
                        semester: parseInt(Semester)
                    });
                    results.updated++;
                    console.log("Updated student:", RollNo);
                } else {
                    // Create new student
                    const hashedPassword = await bcrypt.hash(passwordString, 10);
                    const newStudent = new User({
                        rollNo: RollNo,
                        name: Name,
                        section: Section,
                        password: hashedPassword,
                        branch: branch,
                        role: "student",
                        semester: parseInt(Semester)
                    });
                    await newStudent.save();
                    results.created++;
                    console.log("Created student:", RollNo);
                }
            } catch (error) {
                console.error("Error processing row:", error);
                results.errors.push(`Error processing row ${JSON.stringify(row)}: ${error.message}`);
            }
        }

        console.log("Upload results:", results);
        res.json({
            msg: "Student upload completed",
            results
        });
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get all students for admin's branch
exports.getStudents = async (req, res) => {
    try {
        const branch = req.userBranch; // From middleware
        const students = await User.find({ branch, role: "student" })
            .select("-password")
            .sort({ rollNo: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get available semesters for filtering
exports.getSemesters = async (req, res) => {
    try {
        const branch = req.userBranch;
        const semesters = await User.distinct("semester", { branch, role: "student" });
        res.json(semesters.sort());
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get electives for a specific semester
exports.getElectivesBySemester = async (req, res) => {
    try {
        const { semester } = req.params;
        const branch = req.userBranch;

        const electives = await require("../models/Elective").find({
            branch,
            semester: parseInt(semester)
        }).sort({ name: 1 });

        res.json(electives);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get sections for a specific semester
exports.getSectionsBySemester = async (req, res) => {
    try {
        const { semester } = req.params;
        const branch = req.userBranch;

        const sections = await User.distinct("section", {
            branch,
            role: "student",
            semester: parseInt(semester)
        });

        res.json(sections.sort());
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get filtered registrations
exports.getFilteredRegistrations = async (req, res) => {
    try {
        const { semester, electiveId, section } = req.query;
        const branch = req.userBranch;

        // Build filter for students
        const studentFilter = { branch, role: "student" };
        if (semester) studentFilter.semester = parseInt(semester);
        if (section) studentFilter.section = section;

        // Get students matching the filter
        const students = await User.find(studentFilter).select("_id");
        const studentIds = students.map(student => student._id);

        // Build registration filter
        const registrationFilter = { student: { $in: studentIds } };
        if (electiveId) registrationFilter.elective = electiveId;

        // Get registrations with populated data
        const registrations = await require("../models/Registration").find(registrationFilter)
            .populate("student", "name rollNo section semester")
            .populate("elective", "name code")
            .sort({ "student.rollNo": 1 });

        res.json(registrations);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Export upload middleware
exports.uploadMiddleware = upload.single('excelFile');
