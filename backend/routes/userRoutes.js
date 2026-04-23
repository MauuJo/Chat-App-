const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
  deleteUser,
  updateUserProfile,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/delete").delete(protect, deleteUser);
router.route("/update").put(protect, updateUserProfile);

module.exports = router;