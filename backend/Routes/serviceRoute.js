const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const Service = require("../Models/ServiceModel");
const verifyToken = require("../Middleware/authMiddleware");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

/* ================= GET ALL SERVICES ================= */
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
/* ================= CREATE SERVICE ================= */
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    let data = {
      title,
      description
    };

    // image upload
    if (req.file) {
      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const service = await Service.create(data);
    res.json(service);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPDATE SERVICE ================= */
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, description } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let data = {
      title,
      description
    };

    // new image upload
    if (req.file) {

      // delete old image
      if (service.image?.public_id) {
        await cloudinary.uploader.destroy(service.image.public_id);
      }

      data.image = {
        url: req.file.path,
        public_id: req.file.filename
      };
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      data,
      { returnDocument: "after" }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= DELETE SERVICE ================= */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // delete image from cloudinary
    if (service.image?.public_id) {
      await cloudinary.uploader.destroy(service.image.public_id);
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;