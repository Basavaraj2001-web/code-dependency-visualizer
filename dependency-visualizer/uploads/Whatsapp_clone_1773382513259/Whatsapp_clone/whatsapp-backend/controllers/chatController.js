const Chat = require('../models/Chat');
const User = require('../models/User');
const Message = require("../models/Message");

// // Get all chats for logged-in user
// exports.getMyChats = async (req, res) => {
//   try {
//     const chats = await Chat.find({ users: req.user._id })
//       .populate('users', '-password')
//       .populate('groupAdmin', '-password')
//       .populate('latestMessage')
//       .sort({ updatedAt: -1 });
//     res.json(chats);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// Get all chats for logged-in user
exports.getMyChats = async (req, res) => {
  try {
    let chats = await Chat.find({ users: req.user._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
        populate: {
          path: "sender",
          select: "username profilePic",
        },
      });

    // 🔥 Add unreadCount to each chat
    chats = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: req.user._id },
          readBy: { $ne: req.user._id },
        });

        return {
          ...chat.toObject(),
          unreadCount,
        };
      })
    );

    // 🔥 SORTING RULE:
    // 1. Unread chats first
    // 2. Then sort by updatedAt desc (latest message)
    chats.sort((a, b) => {
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get chat detail by ID
exports.getChatDetail = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create one-to-one chat
exports.createOneToOne = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: 'UserId required' });

    let chat = await Chat.findOne({
      isGroup: false,
      users: { $all: [req.user._id, userId] }
    }).populate('users', '-password');

    if (chat) return res.json(chat);

    chat = await Chat.create({
      chatName: 'private',
      isGroup: false,
      users: [req.user._id, userId]
    });

    const fullChat = await Chat.findById(chat._id).populate('users', '-password');
    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =====================================================
// CREATE GROUP
// =====================================================
exports.createGroup = async (req, res) => {
  try {
    const { name, userIds } = req.body;

    if (!name || !userIds || userIds.length < 1) {
      return res.status(400).json({ message: "Provide group name and members" });
    }

    // Create group
    const chat = await Chat.create({
      chatName: name,
      isGroup: true,
      users: [req.user._id, ...userIds],
      groupAdmin: req.user._id,
    });

    const fullChat = await Chat.findById(chat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json(fullChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =====================================================
// ADD USER TO GROUP
// =====================================================
exports.addToGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // ---- Only Admin Can Add Users ----
    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can manage group" });
    }

    // ---- Check if user already exists ----
    if (chat.users.includes(userId)) {
      return res.status(400).json({ message: "User already in group" });
    }

    // ---- Add User ----
    chat.users.push(userId);
    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =====================================================
// REMOVE USER FROM GROUP
// =====================================================
exports.removeFromGroup = async (req, res) => {
  try {
    const { chatId, userId } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // ---- Only Admin Can Remove Users ----
    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only admin can manage group" });
    }

    // ---- Remove User ----
    chat.users = chat.users.filter(
      (u) => u.toString() !== userId.toString()
    );

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.json(updatedChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
