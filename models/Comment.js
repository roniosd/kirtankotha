import mongoose from "mongoose";
const schema = new mongoose.Schema({
  songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, maxlength: 120 },
  text: { type: String, required: true, trim: true, maxlength: 1000 },
}, { timestamps: true });
schema.index({ songId: 1, createdAt: -1 });
export default mongoose.models.Comment || mongoose.model("Comment", schema);
