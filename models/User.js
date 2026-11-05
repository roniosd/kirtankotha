import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    deletedAt: { type: Date, default: null },
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
