const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      require: true,
    },
    groupChats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "group",
      },
    ],
    personalChats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "personal",
      },
    ],
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("user", userSchema);
