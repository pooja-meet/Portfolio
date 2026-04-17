const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Skill = require("../Models/SkillModel");
const verifyToken = require("../Middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary"); // ✅ correct import

const upload = multer({ storage });

// GET skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/all", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json(skills);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST skill
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, items, percent } = req.body;

    const existing = await Skill.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    let data = {
      name,
      items,
      percent
    };

    // image upload
    if (req.file) {
      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const created = await Skill.create(data);
    res.json(created);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, items, percent } = req.body;

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Not found" });
    }

    let data = {
      name,
      items,
      percent
    };

    // new image upload
    if (req.file) {

      // old image delete
      if (skill.image?.public_id) {
        await cloudinary.uploader.destroy(skill.image.public_id);
      }

      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updated = await Skill.findByIdAndUpdate(
      req.params.id,
      data,
      { returnDocument: "after" }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// DELETE skill
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ message: "Not found" });
    }

    // delete image
    if (skill.image?.public_id) {
      await cloudinary.uploader.destroy(skill.image.public_id);
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
