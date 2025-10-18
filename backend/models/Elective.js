const mongoose = require("mongoose");

const electiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    semester: { type: Number, required: true },
    branch: { type: String, required: true, enum: ["CSE", "IT", "EEE", "ECE", "Mechanical", "Civil", "Chemical", "Bio-Technology", "AIML", "CSE-AIML", "CET", "AIDS", "MECH", "civil", "automobile", "CSM", "bio tech"] }
}, { timestamps: true });

module.exports = mongoose.model("Elective", electiveSchema);
