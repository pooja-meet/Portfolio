const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  items: { type: String, trim: true },
  percent: { type: String, required: true },
  image: {
    url: { type: String, default: "" }, //url → image link
    public_id: { type: String, default: "" }// public_id → delete/update ke kaam aata hai
  },
}, { timestamps: true });

module.exports = mongoose.model("Skill", skillSchema);