const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role }
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
