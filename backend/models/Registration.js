const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    elective: { type: mongoose.Schema.Types.ObjectId, ref: "Elective", required: true },
}, { timestamps: true });

registrationSchema.index({ student: 1, elective: 1 }, { unique: true }); // avoid duplicate

module.exports = mongoose.model("Registration", registrationSchema);
