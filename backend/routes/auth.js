import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "default_secret_key";

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Check if user exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user
        user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        // Create JWT payload
        const payload = {
            id: user._id,
            username: user.username
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { username: user.username, id: user._id } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during registration" });
    }
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        // Authenticate user
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Match password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const payload = {
            id: user._id,
            username: user.username
        };

        jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { username: user.username, id: user._id } });
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during login" });
    }
});

export default router;
