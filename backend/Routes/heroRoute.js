const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const Hero = require("../Models/HeroModel");
const verifyToken = require("../Middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

// ✅ GET Hero (Public)
router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/all", async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// ✅ CREATE (Single Hero)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, subtitle, experience, description, netlify, github } = req.body;

    let data = {
      name,
      subtitle,
      experience,
      description,
      social: {
        netlify: netlify || "",
        github: github || ""
      }
    };

    // image upload
    if (req.file) {
      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const result = await Hero.create(data);
    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//update
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { name, subtitle, experience, description, netlify, github } = req.body;

    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Not found" });
    }

    let data = {
      name,
      subtitle,
      experience,
      description,
      social: {
        netlify: netlify || "",
        github: github || ""
      }
    };

    // new image upload
    if (req.file) {

      // old image delete
      if (hero.image?.public_id) {
        await cloudinary.uploader.destroy(hero.image.public_id);
      }

      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const result = await Hero.findByIdAndUpdate(
      req.params.id,
      data,
      { returnDocument: "after" }
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DELETE Hero
router.delete("/:id", verifyToken, async (req, res) => {
  try {

    const hero = await Hero.findById(req.params.id);

    if (!hero) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🧹 delete image from cloudinary
    if (hero.image?.public_id) {
      await cloudinary.uploader.destroy(hero.image.public_id);
    }
    await Hero.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// ID se hero dhundo → agar mila to image delete karo → fir database se hero delete karo
module.exports = router;