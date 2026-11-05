import mongoose from "mongoose";
import { categories } from "@/lib/songs";
const schema = new mongoose.Schema(
  {
    deletedAt: {type:Date,default:null},
    title: { type: String, required: true, maxlength: 120 },
    category: { type: String, enum: categories, required: true },
    type: { type: String, enum: ["কীর্তন", "গান"], required: true },
    lyricsContent: { type: mongoose.Schema.Types.Mixed, default: null },
    lyrics: { type: String, required: true, maxlength: 20000 },
    author: { type: String, default: "" }, // Legacy uploader name; never treat as lyricist.
    lyricist: { type: String, trim: true, maxlength: 120, default: "" },
    collectedBy: { type: String, maxlength: 120, default: "" },
    source: { type: String, trim: true, maxlength: 300, default: "" },
    contributionType: { type: String, enum: ["collected", "original"], default: "collected" },
    rightsConfirmed: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);
export default mongoose.models.Song || mongoose.model("Song", schema);
