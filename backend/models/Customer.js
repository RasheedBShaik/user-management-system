import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ["active", "inactive", "lead"], 
    default: "active" 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Customer", customerSchema);