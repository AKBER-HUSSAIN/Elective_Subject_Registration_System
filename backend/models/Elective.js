const mongoose = require("mongoose");

const electiveSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    semester: { type: Number, required: true },
    oddEven: { type: String, enum: ["odd", "even"], required: true }
}, { timestamps: true });

module.exports = mongoose.model("Elective", electiveSchema);
