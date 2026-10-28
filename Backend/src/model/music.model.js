const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, default: "Unknown" },
  fileUrl: { type: String, required: true }, // ImageKit pe audio bhi store ho sakta hai
  duration: { type: Number, required: true }, // seconds mein
  mood: {
    type: [String], // ek song multiple mood tags rakh sakta hai
    enum: ["happy", "sad", "romantic", "energetic", "calm", "aesthetic", "party", "emotional"],
    required: true
  },
  genre: { type: String, default: "" }, // optional: "lofi", "bollywood", "pop"
  createdAt: { type: Date, default: Date.now }
});

const MusicModel = mongoose.model("Music", musicSchema);

export default MusicModel