const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    rollNo: { type: String, required: true, unique: true },  // unique student id
    name: { type: String, required: true },
    semester: { type: Number, required: true },
    oddEven: { type: String, enum: ["odd", "even"], required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], default: "student" }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
