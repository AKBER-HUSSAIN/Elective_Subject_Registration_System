const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const User = require("./models/User");
const bcrypt = require("bcrypt");

async function createAdmin() {
    const existing = await User.findOne({ role: "admin" });
    if (!existing) {
        const hashed = await bcrypt.hash("admin123", 10);
        const admin = new User({
            rollNo: "admin001",
            name: "System Admin",
            semester: 0,
            oddEven: "odd",
            password: hashed,
            role: "admin"
        });
        await admin.save();
        console.log("✅ Default admin created: admin001 / admin123");
    }
}
createAdmin();

// Routes
const authRoutes = require("./routes/authRoutes");
const electiveRoutes = require("./routes/electiveRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/electives", electiveRoutes);
app.use("/api/registrations", registrationRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
