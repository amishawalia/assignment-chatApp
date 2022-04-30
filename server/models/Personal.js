const mongoose = require("mongoose");

const personalChatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    messages: [
      {
        _id: mongoose.Schema.ObjectId,
        sender: String,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        publicId: {
          type: String,
        },
      },
    ],
    lastMessage: {
      _id: mongoose.Schema.ObjectId,
      sender: String,
      message: String,
      isNotSeen: {
        type: Boolean,
        default: true,
      },
      timestamp: {
        type: Date,
        default: Date("09/12/1999"),
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("personal", personalChatSchema);
