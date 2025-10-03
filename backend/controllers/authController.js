const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    try {
        const { rollNo, name, semester, oddEven, password, role } = req.body;

        // Check duplicate rollNo
        const existingUser = await User.findOne({ rollNo });
        if (existingUser) return res.status(400).json({ msg: "Roll number already registered" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ rollNo, name, semester, oddEven, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { rollNo, password } = req.body;

        const user = await User.findOne({ rollNo });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({ token, role: user.role, name: user.name, semester: user.semester, oddEven: user.oddEven });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
