const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const Project = require("../Models/ProjectModel");
const verifyToken = require("../Middleware/authMiddleware");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

/* ================= GET ALL PROJECTS ================= */
router.get("/", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/all", async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: 1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= CREATE PROJECT ================= */
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const { title, link, description } = req.body;

        let data = {
            title,
            link,
            description
        };

        // image upload
        if (req.file) {
            data.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const project = await Project.create(data);
        res.json(project);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= UPDATE PROJECT ================= */
router.put("/:id", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const { title, link, description } = req.body;

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        let data = {
            title,
            link,
            description
        };

        // new image upload
        if (req.file) {

            // delete old image
            if (project.image?.public_id) {
                await cloudinary.uploader.destroy(project.image.public_id);
            }

            data.image = {
                url: req.file.path,
                public_id: req.file.filename
            };
        }

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            data,
            { returnDocument: "after" }
        );

        res.json(updated);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ================= DELETE PROJECT ================= */
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // delete image from cloudinary
        if (project.image?.public_id) {
            await cloudinary.uploader.destroy(project.image.public_id);
        }

        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: "Deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
