const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const CarPark = require("../models/CarPark");
const { protect } = require("../middleware/authMiddleware");

// Create a reservation
const hourlyRate = 2.5; // USD per hour (or any currency)

router.post("/", protect, async (req, res) => {
  try {
    const { car, carPark, startTime, endTime } = req.body;

    const park = await CarPark.findById(carPark);
    if (!park || park.availableSlots <= 0) {
      return res.status(400).json({ message: "No available slots" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    const price = hours * hourlyRate;

    const reservation = new Reservation({
      user: req.user._id,
      car,
      carPark,
      startTime,
      endTime,
      price, // save price (add to model if needed)
    });

    await reservation.save();

    park.availableSlots -= 1;
    await park.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create reservation" });
  }
});

// Get user's reservations
router.get("/", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("car")
      .populate("carPark");

    res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get reservations" });
  }
});

// Cancel reservation
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation || reservation.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    // Release slot
    const carPark = await CarPark.findById(reservation.carPark);
    if (carPark) {
      carPark.availableSlots += 1;
      await carPark.save();
    }

    res.status(200).json({ message: "Reservation cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to cancel reservation" });
  }
});

module.exports = router;


