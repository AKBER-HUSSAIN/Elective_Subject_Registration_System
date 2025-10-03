const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

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
