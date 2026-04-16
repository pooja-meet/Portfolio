const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    },
    link: {
        type: String,
        default: "#",
        match: [/^https?:\/\/.+/, "Please use a valid URL"]
    },
    description: { type: String }
}, { timestamps: true });
module.exports = mongoose.model("Project", projectSchema);