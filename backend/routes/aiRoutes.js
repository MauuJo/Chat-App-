const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { generateAIResponse } = require("../controllers/aiController");

const router = express.Router();

// The 'protect' middleware ensures only logged-in users can trigger the AI
router.route("/").post(protect, generateAIResponse);

module.exports = router;