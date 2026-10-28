const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: "Unknown" },
  fileUrl: { type: String, required: true }, 
  duration: { type: Number, required: true }, 
  mood: {
    type: [String], 
    enum: ["happy", "sad", "romantic", "energetic", "calm", "aesthetic", "party", "emotional"],
    required: true
  },
  genre: { type: String, default: "" }, 
  createdAt: { type: Date, default: Date.now }
});

const MusicModel = mongoose.model("Music", musicSchema);

export default MusicModel