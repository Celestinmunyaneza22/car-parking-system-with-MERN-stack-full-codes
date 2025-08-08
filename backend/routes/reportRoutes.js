const express = require("express");
const router = express.Router();
const Reservation = require("../models/Reservation");
const { protect } = require("../middleware/authMiddleware");

// Reservation count and status report
router.get("/reservations-summary", protect, async (req, res) => {
  try {
    const total = await Reservation.countDocuments();
    const active = await Reservation.countDocuments({ status: "active" });
    const cancelled = await Reservation.countDocuments({ status: "cancelled" });
    const completed = await Reservation.countDocuments({ status: "completed" });

    res.json({ total, active, cancelled, completed });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch report" });
  }
});

// Payment report - total revenue and by month
router.get("/payments-summary", protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: { $ne: "cancelled" } });

    const totalRevenue = reservations.reduce((acc, r) => acc + r.price, 0);

    // Group by month
    const monthly = {};

    reservations.forEach((r) => {
      const month = new Date(r.startTime).toLocaleString("default", {
        year: "numeric",
        month: "short",
      });

      monthly[month] = (monthly[month] || 0) + r.price;
    });

    res.json({ totalRevenue, monthly });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payment report" });
  }
});

module.exports = router;