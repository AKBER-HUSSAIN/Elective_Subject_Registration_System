const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, branch }
        next();
    } catch (err) {
        res.status(401).json({ msg: "Invalid token" });
    }
};

exports.adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ msg: "Access denied: Admins only" });
    }
    next();
};

exports.branchAccess = (req, res, next) => {
    // For admin users, ensure they can only access their branch data
    if (req.user.role === "admin") {
        req.userBranch = req.user.branch;
        next();
    }
    // For student users, get their branch from the database
    else if (req.user.role === "student") {
        const User = require("../models/User");
        User.findById(req.user.id)
            .then(user => {
                if (!user) return res.status(404).json({ msg: "User not found" });
                req.userBranch = user.branch;
                next();
            })
            .catch(err => res.status(500).json({ msg: "Server error", error: err.message }));
        return;
    } else {
        next();
    }
};
