import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    favorites: { type: [String], default: [], select: false },
    name: { type: String, default: "", maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
  },
  { timestamps: true },
);
export default mongoose.models.User || mongoose.model("User", schema);
