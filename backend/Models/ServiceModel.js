const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true, trim: true
    },
    image: {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" }
    }
},
    { timestamps: true }
)

module.exports = mongoose.model("Service", serviceSchema);