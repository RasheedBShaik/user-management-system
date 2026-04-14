import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(5000, () => {
      console.log("Server running on http://localhost:5000");
    });
  })
  .catch(err => console.log(err));