import mongoose from "mongoose";
import { categories } from "@/lib/songs";
const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 120 },
    category: { type: String, enum: categories, required: true },
    type: { type: String, enum: ["কীর্তন", "গান"], required: true },
    lyricsContent: { type: mongoose.Schema.Types.Mixed, default: null },
    lyrics: { type: String, required: true, maxlength: 20000 },
    author: { type: String, default: "কমিউনিটি" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
export default mongoose.models.Song || mongoose.model("Song", schema);
