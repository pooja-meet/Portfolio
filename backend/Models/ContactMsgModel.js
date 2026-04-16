const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    }
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);