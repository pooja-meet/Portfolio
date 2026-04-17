const express = require("express");
const router = express.Router();

const ContactInfo = require("../Models/ContactInfoModel");
const verifyToken = require("../Middleware/authMiddleware");

// ================= GET ALL =================
router.get("/", async (req, res) => {
  try {
    const contacts = await ContactInfo.find().sort({ createdAt: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const contacts = await ContactInfo.find().sort({ createdAt: 1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ================= CREATE =================
router.post("/", verifyToken, async (req, res) => {
  try {
    const { location, phone, email, description } = req.body;

    const data = {
      location,
      phone,
      email,
      description
    };

    const created = await ContactInfo.create(data);

    res.json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= UPDATE =================
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { location, phone, email, description } = req.body;

    const updated = await ContactInfo.findByIdAndUpdate(
      req.params.id,
      { location, phone, email, description },
      { returnDocument: "after" }
    );

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= DELETE =================
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const contact = await ContactInfo.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    await ContactInfo.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
