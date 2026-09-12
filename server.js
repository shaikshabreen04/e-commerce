import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Global middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API is running successfully"
  });
});

// Authentication routes - Dakshi
app.use("/api/auth", authRoutes);

// User management routes - Dakshi
app.use("/api/users", userRoutes);

// Product routes - You
app.use("/api/products", productRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});