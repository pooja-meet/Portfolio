const express = require('express')
const router = express.Router()
require("dotenv").config()
const AdminUser = require('../Models/AdminModels')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const verifyToken = require('../Middleware/authMiddleware')
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/signin', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: "Fill all fields" })
        }
        const user = await AdminUser.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            return res.status(400).json({ msg: "Invalid credentials" })
        }
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '15m' })

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.status(200).json({
            msg: "Login successful",
            user: {
                id: user._id,
                username: user.username
            }
        });

    } catch (error) {
        console.error("login time error", error.message)
        res.status(500).json({ error: "server error" })
    }
})
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await AdminUser.findById(req.userId)
            .select("_id username");

        if (!user) {
            return res.status(401).json({ msg: "User not found" });
        }

        res.status(200).json({
            loggedIn: true,
            user
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
})
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Local HTTP testing
        sameSite: 'lax',
        path: '/',
    });

    res.status(200).json({
        msg: 'Logout successful',
    });
});
module.exports = router;
