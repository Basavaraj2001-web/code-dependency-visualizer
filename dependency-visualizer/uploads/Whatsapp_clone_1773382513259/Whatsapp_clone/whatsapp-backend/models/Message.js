const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // TEXT MESSAGE
    content: {
      type: String,
      default: "",
    },

    // IMAGE MESSAGE
    image: {
      type: String, // /uploads/image.png
      default: null,
    },

    // FILE MESSAGE (PDF, DOC, ZIP, etc.)
    file: {
      type: String, // /uploads/file.pdf
      default: null,
    },

    fileName: {
      type: String,
      default: null,
    },

    fileType: {
      type: String,
      default: null, // e.g. "application/pdf"
    },

    fileSize: {
      type: Number,
      default: null, // in bytes
    },

    // CHAT ID
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    // MESSAGE STATUS
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },

    // TRACK WHICH USERS CAN SEE THE MESSAGE
    visibleTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    readBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
