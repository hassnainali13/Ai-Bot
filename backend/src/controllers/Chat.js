const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: "guest",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
