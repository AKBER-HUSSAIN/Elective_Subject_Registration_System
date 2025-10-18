const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    try {
        const { rollNo, password } = req.body;

        const user = await User.findOne({ rollNo });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role, branch: user.branch }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            token,
            role: user.role,
            name: user.name,
            semester: user.semester,
            branch: user.branch,
            section: user.section
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
