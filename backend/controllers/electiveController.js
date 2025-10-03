const Elective = require("../models/Elective");

// Add new elective
exports.addElective = async (req, res) => {
    try {
        const { name, code, description, semester, oddEven } = req.body;

        // Check duplicate elective code
        const existing = await Elective.findOne({ code });
        if (existing) return res.status(400).json({ msg: "Elective code already exists" });

        const elective = new Elective({ name, code, description, semester, oddEven });
        await elective.save();

        res.status(201).json({ msg: "Elective added successfully", elective });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Get all electives (optionally filter by semester & oddEven)
exports.getElectives = async (req, res) => {
    try {
        const { semester, oddEven } = req.query;
        let filter = {};
        if (semester) filter.semester = semester;
        if (oddEven) filter.oddEven = oddEven;

        const electives = await Elective.find(filter);
        res.json(electives);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Update elective
exports.updateElective = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Elective.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ msg: "Elective not found" });

        res.json({ msg: "Elective updated", updated });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// Delete elective
exports.deleteElective = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Elective.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ msg: "Elective not found" });

        res.json({ msg: "Elective deleted" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};
