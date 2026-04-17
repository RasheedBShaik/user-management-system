import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String, required: true, trim: true }, // <--- Added Phone Number field
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

// Check if the model exists before exporting to prevent errors in Next.js development
export default mongoose.models.User || mongoose.model("User", userSchema);