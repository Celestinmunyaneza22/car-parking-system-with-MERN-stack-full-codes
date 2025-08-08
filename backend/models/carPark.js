const mongoose = require("mongoose");

const carParkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  totalSlots: { type: Number, required: true },
  availableSlots: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CarPark", carParkSchema);