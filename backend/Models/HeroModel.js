const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    subtitle: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    image: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },

    experience: {
        type: String,
    },

    social: {
        netlify: {
            type: String,
            default: "",
            match: [/^https?:\/\/.+/, "Please use a valid URL"]
        },
        github: {
            type: String,
            default: "",
            match: [/^https?:\/\/.+/, "Please use a valid URL"]
        }
    }

}, { timestamps: true });

module.exports = mongoose.model("Hero", heroSchema);