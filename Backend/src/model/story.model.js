const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  imageUrl: { type: String, required: true },     
  imageFileId: { type: String, required: true },    
  type: {
    type: String,
    enum: ["ai", "custom"],
    default: "custom"
  },
  overlay: {
    text: { type: String, default: "" },
    textPosition: {
      x: { type: Number, default: 50 },
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
    filter: { type: String, default: "none" }
  },
  music: {
    songId: { type: mongoose.Schema.Types.ObjectId, ref: "Music" },
    startTime: { type: Number, default: 0 } 
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) 
  }
});

const storyModel = mongoose.model("Story", storySchema);

export default storyModel;