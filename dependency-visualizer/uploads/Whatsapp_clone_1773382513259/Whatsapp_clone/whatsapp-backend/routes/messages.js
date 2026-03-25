const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  sendMessage,
  getMessages,
  markDelivered,
  markRead,
  deleteForEveryone,
  deleteForMe
} = require("../controllers/messageController");

// ------------------------------
// Send Message (text or file)
// ------------------------------
router.post("/", auth, upload.single("file"), sendMessage);

// ------------------------------
// Get all chat messages
// ------------------------------
router.get("/:chatId", auth, getMessages);

// ------------------------------
// Mark Delivered
// ------------------------------
router.post("/delivered", auth, markDelivered);

// ------------------------------
// Mark a specific message as Read (old)
// ------------------------------
router.post("/read", auth, markRead);

// ------------------------------
// 🔥 Mark all messages in a chat as Read (new)
// frontend will call PUT /messages/read/:chatId
// ------------------------------
router.put("/read/:chatId", auth, markRead);

// ------------------------------
// Delete
// ------------------------------
router.delete('/:id', auth, deleteForEveryone);        
router.delete('/deleteForMe/:id', auth, deleteForMe);

module.exports = router;
