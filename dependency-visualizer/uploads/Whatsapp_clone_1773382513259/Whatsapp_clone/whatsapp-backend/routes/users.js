const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // make sure this exists
const {
  getMe,
  searchUsers,
  getUserStatus,
  updateProfilePic // import the new controller
} = require('../controllers/userController');

// Get logged-in user info
router.get('/me', auth, getMe);

// Search users
router.get('/', auth, searchUsers); // ?q=search

// Get user status by ID
router.get('/status/:id', auth, getUserStatus);

// Update profile picture (after login)
router.put('/profile-pic', auth, upload.single('profilePic'), updateProfilePic);

module.exports = router;
