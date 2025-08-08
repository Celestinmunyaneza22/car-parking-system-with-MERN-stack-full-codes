const express = require("express");
const router = express.Router();
const Car = require("../models/carModel");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/cars
// @desc    Add a new car
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { plateNumber, brand, color } = req.body;

    if (!plateNumber || !brand) {
      return res.status(400).json({ message: "Plate number and brand are required" });
    }

    const carExists = await Car.findOne({ plateNumber });
    if (carExists) {
      return res.status(400).json({ message: "Car with this plate number already exists" });
    }

    const car = await Car.create({
      user: req.user._id,
      plateNumber,
      brand,
      color,
    });

    res.status(201).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/cars
// @desc    Get all cars for the logged-in user
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const cars = await Car.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(cars);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching cars" });
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car by ID (only if owned by logged-in user)
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Car.deleteOne({ _id: car._id });

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car's info
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const { plateNumber, brand, color } = req.body;
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Ensure the logged-in user owns this car
    if (car.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    car.plateNumber = plateNumber || car.plateNumber;
    car.brand = brand || car.brand;
    car.color = color || car.color;

    const updatedCar = await car.save();
    res.json(updatedCar);

  } catch (error) {
    console.error("Car update error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;