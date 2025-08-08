const express = require("express");
const router = express.Router();
const CarPark = require("../models/CarPark");

// Create a car park (admin)
router.post("/", async (req, res) => {
  try {
    const { name, location, totalSlots } = req.body;

    const carPark = new CarPark({
      name,
      location,
      totalSlots,
      availableSlots: totalSlots,
    });

    const saved = await carPark.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create car park" });
  }
});

// Get all car parks
router.get("/", async (req, res) => {
  try {
    const parks = await CarPark.find();
    res.status(200).json(parks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch car parks" });
  }
});

module.exports = router;