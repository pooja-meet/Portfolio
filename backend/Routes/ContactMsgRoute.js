const express = require("express");
const router = express.Router();

const Contact = require("../Models/ContactMsgModel");
const verifyToken = require("../Middleware/authMiddleware");


// ================= GET ALL MESSAGES (ADMIN) =================
router.get("/", verifyToken, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= CREATE MESSAGE (PUBLIC) =================
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const msg = await Contact.create({
      name,
      email,
      message
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: msg
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= DELETE MESSAGE =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ message: "Message deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;