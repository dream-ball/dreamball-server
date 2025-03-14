require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { generateJWT} = require("../../middleware/jwt_token"); // Ensure correct path
const router = express.Router();

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

const invalidTokens = new Set();

// Admin Login Route
router.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        const token = generateJWT(username);
        return res.json({ status: "ok", token });
    }

    res.status(401).json({ status: "error", message: "Invalid credentials" });
});


// Admin Protected Route
router.get("/admin/protected", (req, res) => {
    res.json({ status: "ok", message: "You have access!" });
});

// Admin Logout Route
router.post("/admin/logout", (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({ status: "error", message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    invalidTokens.add(token);

    res.json({ status: "ok", message: "Logged out successfully" });
});

module.exports = router;
