const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    description: { type: String, trim: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ContactInfo", contactInfoSchema);