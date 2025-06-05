import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename:    { type: String, required: true },
  originalname:{ type: String },
  url:         { type: String, required: true },
  type:        { type: String, required: true },
  size:        { type: Number, required: true },
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category:    { type: String, enum: ["pdf", "video", "ebook", "cours", "film", "autre"], default: "autre" },
  tags:        [String],
  description: { type: String },
  downloads:   { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now },
  isPublic:    { type: Boolean, default: true }
});

export default mongoose.model("File", fileSchema);