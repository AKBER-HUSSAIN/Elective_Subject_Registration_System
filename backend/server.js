const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
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

// Root endpoint - serve React app
app.get("/", (req, res) => {
    const indexPath = path.join(__dirname, '../frontend/dist/index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).json({
                error: 'Frontend not built. Please run: cd frontend && npm run build'
            });
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

// Serve static files from the React app build directory
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// Catch-all handler: send back React's index.html file for any non-API routes
app.use((req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }

    const indexPath = path.join(frontendPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).json({
                error: 'Frontend not built. Please run: cd frontend && npm run build'
            });
        }
    });
});

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
