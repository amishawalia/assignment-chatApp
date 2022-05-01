const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    members: [
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
        default: "09/12/1999",
      },
      publicId: {
        type: String,
      },
    },
    about: {
      type: String,
      default: "This is a group",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("group", groupSchema);
