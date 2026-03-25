const express = require('express');
const router = express.Router();
const { register, login, logout } = require('../controllers/authController');
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");  // NEW (for logout protection)

// ================================
// REGISTER (with profilePic upload)
// ================================
router.post("/register", upload.single("profilePic"), register);

// ================================
// LOGIN
// ================================
router.post('/login', login);

// ================================
// LOGOUT → user must be logged in
// ================================
router.post('/logout', auth, logout);

module.exports = router;
