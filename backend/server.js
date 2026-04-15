// 1. DNS FIX (MUST BE AT THE VERY TOP)
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]); 

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
const app = express();

// 2. DYNAMIC CORS CONFIGURATION
const allowedOrigins = [
  "http://localhost:3000",
  "https://user-management-system-five-alpha.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        // Log blocked origins to your Render console for debugging
        console.log("⚠️ CORS Blocked Origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 3. EXPLICIT PREFLIGHT OPTIONS HANDLER
// This ensures that 'OPTIONS' requests (preflights) always return 200 OK
app.options(/^(.*)$/, cors());

// 4. BODY PARSING (Must be after CORS)
app.use(express.json());

// 5. ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/customers", customerRoutes);

// 6. UI HEALTH CHECK (Visible at your Render URL)
app.get("/", (req, res) => {
  res.send({
    status: "Backend Live 🚀",
    database: mongoose.connection.readyState === 1 ? "Connected ✅" : "Disconnected ❌",
    timestamp: new Date().toISOString()
  });
});

// 7. PORT BINDING (Render assigns a dynamic port via process.env.PORT)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server locked and loaded on port ${PORT}`);
});

// 8. DATABASE CONNECTION
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
} else {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch((err) => {
      console.error("❌ MongoDB Connection Failed:", err.message);
    });
}