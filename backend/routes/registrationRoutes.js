const express = require("express");
const router = express.Router();

// Example test route
router.get("/", (req, res) => {
    res.send("Registration routes working ✅");
});

module.exports = router;
