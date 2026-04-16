const express = require('express')
const router = express.Router()
require("dotenv").config()
const AdminUser = require('../Models/AdminModels')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY || "helloji";

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: "fill form..." })
        }
        const existingUser = await AdminUser.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ msg: "this name is already used by some other user" })
        }
        const hashPassword = await bcrypt.hash(password, 10)
        const user = await AdminUser.create({
            username, password: hashPassword
        })
        res.status(201).json({ msg: "user registered successfully", user: { id: user._id, username: user.username } })
    } catch (error) {
        console.error("server error", error.message)
        res.status(500).json({ error: "server error" })
    }
})
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
        const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '12h' })
        res.status(200).json({
            msg: "Login successful",
            token,
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
module.exports = router;
