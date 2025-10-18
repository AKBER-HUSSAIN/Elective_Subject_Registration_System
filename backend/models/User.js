const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },  // unique student id
    name: { type: String, required: true },
    semester: { type: Number, required: true },
    section: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" },
    branch: { type: String, required: true, enum: ["CSE", "IT", "EEE", "ECE", "Mechanical", "Civil", "Chemical", "Bio-Technology", "AIML", "CSE-AIML", "CET", "AIDS", "MECH", "civil", "automobile", "CSM", "bio tech"] }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
