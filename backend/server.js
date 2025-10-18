const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const User = require("./models/User");
const bcrypt = require("bcrypt");

async function createAdmins() {
    const branches = [
        "CSE", "IT", "EEE", "ECE", "Mechanical", "Civil",
        "Chemical", "Bio-Technology", "AIML", "CSE-AIML", "CET", "AIDS"
    ];

    for (const branch of branches) {
        const existing = await User.findOne({ role: "admin", branch });
        if (!existing) {
            const hashed = await bcrypt.hash("admin123", 10);
            const admin = new User({
                rollNo: `admin${branch.toLowerCase().replace(/[^a-z0-9]/g, '')}001`,
                name: `${branch} Admin`,
                semester: 0,
                section: "Admin",
                password: hashed,
                role: "admin",
                branch: branch
            });
            await admin.save();
            console.log(`✅ ${branch} admin created: admin${branch.toLowerCase().replace(/[^a-z0-9]/g, '')}001 / admin123`);
        }
    }
}
createAdmins();

// Routes
const authRoutes = require("./routes/authRoutes");
const electiveRoutes = require("./routes/electiveRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const reportRoutes = require("./routes/reportRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Elective Subject Registration System API",
        endpoints: {
            health: "/health",
            auth: "/api/auth",
            electives: "/api/electives",
            registrations: "/api/registrations",
            reports: "/api/reports"
        }
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/electives", electiveRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connect
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB Connected"))
        .catch((err) => {
            console.error("❌ DB Error:", err);
            console.log("⚠️ Continuing without MongoDB for testing...");
        });
} else {
    console.log("⚠️ No MONGO_URI found, continuing without MongoDB...");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
