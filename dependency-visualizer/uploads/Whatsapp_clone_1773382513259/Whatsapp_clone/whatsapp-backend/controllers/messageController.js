const Message = require("../models/Message");
const Chat = require("../models/Chat");

// // =========================================
// // SEND MESSAGE (TEXT / IMAGE / FILE)
// // =========================================
// exports.sendMessage = async (req, res) => {
//   try {
//     const { chatId, content } = req.body;

//     if (!chatId && !req.body.chat) {
//       return res.status(400).json({ message: "chatId required" });
//     }

//     let finalChatId = chatId || req.body.chat;

//     // Prepare message object
//     let messageData = {
//       chat: finalChatId,
//       sender: req.user._id,
//       content: content || "",
//     };

//     // If file uploaded
//     if (req.file) {
//       const filePath = "/uploads/" + req.file.filename;

//       if (req.file.mimetype.startsWith("image/")) {
//         messageData.image = filePath;
//       } else {
//         messageData.file = filePath;
//         messageData.fileName = req.file.originalname;
//         messageData.fileType = req.file.mimetype;
//         messageData.fileSize = req.file.size;
//       }
//     }

//     const chat = await Chat.findById(messageData.chat).populate("users");

// if (!chat) return res.status(404).json({ message: "Chat not found" });

// // Add visibleTo for all users in the chat
// messageData.visibleTo = chat.users.map((user) => user._id);

// // Save message
// let message = await Message.create(messageData);


//     // Update chat latest message
//     await Chat.findByIdAndUpdate(finalChatId, {
//       latestMessage: message._id,
//     });

//     // Populate for frontend
//     message = await Message.findById(message._id)
//       .populate("sender", "-password")
//       .populate("chat");

//     res.status(201).json(message);
//   } catch (err) {
//     console.error("Send message error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };


// =========================================
// SEND MESSAGE (TEXT / IMAGE / FILE)
// =========================================
exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    if (!chatId && !req.body.chat) {
      return res.status(400).json({ message: "chatId required" });
    }

    let finalChatId = chatId || req.body.chat;

    // Prepare message object
    let messageData = {
  chat: finalChatId,
  sender: req.user._id,
  content: content || "",
  status: "sent",          // ✔ default sent
  readBy: [req.user._id]   // sender already read
};


    // If file uploaded
    if (req.file) {
      const filePath = "/uploads/" + req.file.filename;

      if (req.file.mimetype.startsWith("image/")) {
        messageData.image = filePath;
      } else {
        messageData.file = filePath;
        messageData.fileName = req.file.originalname;
        messageData.fileType = req.file.mimetype;
        messageData.fileSize = req.file.size;
      }
    }

    const chat = await Chat.findById(messageData.chat).populate("users");

    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Add visibleTo for all users in the chat
    messageData.visibleTo = chat.users.map((user) => user._id);

    // Save message
    let message = await Message.create(messageData);

    // 🔥 UPDATE latest message so chat moves to top
    await Chat.findByIdAndUpdate(finalChatId, {
      latestMessage: message._id,
    });

    // Populate for frontend
    message = await Message.findById(message._id)
      .populate("sender", "-password")
      .populate("chat");

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =========================================
// GET ALL MESSAGES IN CHAT (Visible to User)
// =========================================
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user

    const messages = await Message.find({
      chat: req.params.chatId,
      visibleTo: userId, // Only messages visible to this user
    })
      .populate("sender", "-password")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get messages error:", err);
    res.status(500).json({ message: err.message });
  }
};



// MARK MESSAGE DELIVERED
exports.markDelivered = async (req, res) => {
  try {
    const { messageId } = req.body;
    const updated = await Message.findByIdAndUpdate(
      messageId,
      { status: "delivered" },
      { new: true }
    );

    // 🔥 Emit to sender so frontend updates ticks
    const senderId = updated.sender.toString(); // the original sender of the message
    req.app.get("io").to(senderId).emit("messageDelivered", updated._id);

    res.json(updated);
  } catch (err) {
    console.error("Delivered error:", err);
    res.status(500).json({ message: err.message });
  }
};


// // MARK MESSAGE READ
// exports.markRead = async (req, res) => {
//   try {
//     const { messageId } = req.body;
//     const updated = await Message.findByIdAndUpdate(
//       messageId,
//       { status: "read" },
//       { new: true }
//     );
//     res.json(updated);
//   } catch (err) {
//     console.error("Read error:", err);
//     res.status(500).json({ message: err.message });
//   }
// };

// MARK ALL MESSAGES AS READ IN A CHAT
exports.markRead = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const userId = req.user._id;

    const io = req.app.get("io");

    // 1️⃣ Get all unread messages
    const unreadMessages = await Message.find({
      chat: chatId,
      sender: { $ne: userId },
      readBy: { $ne: userId }
    });

    // 2️⃣ Update them all
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId },
        $set: { status: "read" }
      }
    );

    // 3️⃣ Emit messageRead for each message
    unreadMessages.forEach((msg) => {
      const senderId = msg.sender.toString();
      io.to(senderId).emit("messageRead", msg._id);
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Mark read error:", err);
    res.status(500).json({ message: err.message });
  }
};





const fs = require('fs');
const path = require('path');
// controllers/messageController.js
exports.deleteForEveryone = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id; // logged-in user
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete for everyone
    if (message.sender.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Only sender can delete this message for everyone' });
    }

    // Delete image if exists
    if (message.image) {
      const imagePath = path.join(__dirname, '..', message.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.log('Image deletion error:', err);
      });
    }

    // Delete file if exists
    if (message.file) {
      const filePath = path.join(__dirname, '..', message.file);
      fs.unlink(filePath, (err) => {
        if (err) console.log('File deletion error:', err);
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.status(200).json({ message: 'Message deleted for everyone' });
  } catch (err) {
    console.error('Delete for everyone error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


exports.deleteForMe = async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Initialize visibleTo if empty (all users can see by default)
    if (!message.visibleTo || message.visibleTo.length === 0) {
      message.visibleTo = [userId]; // optional: you can add all chat members here
    }

    // Remove current user from visibleTo
    if (!message.visibleTo.includes(userId)) {
      return res.status(400).json({ message: 'Message already deleted for you' });
    }

    message.visibleTo = message.visibleTo.filter(u => u.toString() !== userId.toString());
    await message.save();

    res.status(200).json({ message: 'Message deleted for you' });
  } catch (err) {
    console.error('Delete for me error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
