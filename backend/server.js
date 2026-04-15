// MUST BE AT THE VERY TOP OF THE FILE
import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Force Google DNS to resolve Atlas SRV records

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import customerRoutes from "./routes/customerRoutes.js"

dotenv.config();
const app = express();

app.use(cors({
  origin: "http://localhost:3000", // During development, this ensures no browser blocks you
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);  
app.use("/api/customers", customerRoutes);

// UI Health Check
app.get("/", (req, res) => {
    res.send({
        status: "Backend Live 🚀",
        database: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌"
    });
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Stable Connection Logic
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });