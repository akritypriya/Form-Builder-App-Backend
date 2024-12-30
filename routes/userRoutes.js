// const express = require("express");
// const User = require("..//User"); // Replace with the correct path to your User model
// const authenticateToken = require("../middleware/authMiddleware");

// const router = express.Router();

// // Route to fetch user details
// router.get("/user", authenticateToken, async (req, res) => {
//   try {
//     // Use req.user.id provided by the authenticateToken middleware
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json({ name: user.name }); // Return user details (only name for now)
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// module.exports = router;