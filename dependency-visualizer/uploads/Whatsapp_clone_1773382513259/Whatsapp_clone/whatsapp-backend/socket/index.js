const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log("⚡ Client connected:", socket.id);

    // =========================================
    // USER SETUP (online)
    // =========================================
    socket.on('setup', async (userId) => {
      socket.join(userId);
      socket.userId = userId;

      await User.findByIdAndUpdate(userId, {
        online: true,
        lastSeen: new Date()
      });

      socket.broadcast.emit("user-online", userId);

      console.log(`🟢 User ONLINE: ${userId}`);
    });

    // =========================================
    // TYPING INDICATOR
    // =========================================
    socket.on("typing", ({ senderId, receiverId }) => {
      socket.to(receiverId).emit("typing", senderId);
    });

    socket.on("stop typing", ({ senderId, receiverId }) => {
      socket.to(receiverId).emit("stop typing", senderId);
    });

    // =========================================
    // DELETE MESSAGE
    // =========================================

    socket.on("deleteMessage", (messageId) => {
  io.to(socket.chatId).emit("messageDeleted", messageId);
});

    // =========================================
    // SEND MESSAGE (REAL-TIME)
    // =========================================
    socket.on("new message", async (msg) => {
      try {
        const { senderId, receiverId, content } = msg;

        if (!senderId || !receiverId || !content) return;

        // Find or create one-to-one chat
        let chat = await Chat.findOne({
          isGroup: false,
          users: { $all: [senderId, receiverId] }
        });

        if (!chat) {
          chat = await Chat.create({
            chatName: "private",
            isGroup: false,
            users: [senderId, receiverId]
          });
        }

        // Create message
        const message = await Message.create({
          sender: senderId,
          chat: chat._id,
          content,
          status: "sent"
        });

        // Update chat latest message
        chat.latestMessage = message._id;
        await chat.save();

        // Populate full message
        const fullMsg = await Message.findById(message._id)
          .populate("sender", "-password")
          .populate({
            path: "chat",
            populate: { path: "users", select: "-password" }
          });

        // 🔥 Send to both sender & receiver
        io.to(receiverId).emit("messageReceived", fullMsg);
        io.to(senderId).emit("messageReceived", fullMsg);

        console.log("📨 Message delivered:", senderId, receiverId);

      } catch (err) {
        console.error("💥 Message send error:", err);
      }
    });

    // =========================================
    // USER DISCONNECT (offline)
    // =========================================
    socket.on("disconnect", async () => {
      if (!socket.userId) return;

      const lastSeen = new Date();

      await User.findByIdAndUpdate(socket.userId, {
        online: false,
        lastSeen
      });

      socket.broadcast.emit("user-offline", {
        userId: socket.userId,
        lastSeen
      });

      console.log(`🔴 User OFFLINE: ${socket.userId}`);
    });
  });
};
