const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  imageUrl: { type: String, required: true },      // ImageKit se milega
  imageFileId: { type: String, required: true },    // ImageKit file id (delete ke liye)
  type: {
    type: String,
    enum: ["ai", "custom"],
    default: "custom"
  },
  overlay: {
    text: { type: String, default: "" },
    textPosition: {
      x: { type: Number, default: 50 }, // percentage based (0-100)
      y: { type: Number, default: 80 }
    },
    textColor: { type: String, default: "#ffffff" },
    emojis: [
      {
        emoji: String,
        x: Number,
        y: Number
      }
    ],
    filter: { type: String, default: "none" } // e.g. "warm", "cool", "bw"
  },
  music: {
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "Music" },
    startTime: { type: Number, default: 0 } // kaha se song bajega
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24hr baad expire
  }
});

const storyModel = mongoose.model("Story", storySchema);

export default storyModel;