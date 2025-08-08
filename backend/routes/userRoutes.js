const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser); // 🔑 Login route

// 🔒 Add protected route
router.get("/profile", protect, async (req, res) => {
  res.json({
    id: req.user._id,
    fullname: req.user.fullname,
    email: req.user.email,
  });
});

module.exports = router;