const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMyChats,
  createOneToOne,
  createGroup,
  addToGroup,
  removeFromGroup,
  getChatDetail
} = require('../controllers/chatController');

// ---------------------------
// Get all chats for logged-in user
// ---------------------------
router.get('/my', auth, getMyChats);

// ---------------------------
// Get chat detail by ID
// ---------------------------
router.get('/:chatId', auth, getChatDetail);

// ---------------------------
// Create or fetch a one-to-one private chat
// ---------------------------
router.post('/one', auth, createOneToOne);

// ---------------------------
// Group chat routes
// ---------------------------
router.post('/group', auth, createGroup);
router.put('/group/add', auth, addToGroup);
router.put('/group/remove', auth, removeFromGroup);



module.exports = router;
