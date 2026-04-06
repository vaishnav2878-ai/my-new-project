require('dotenv').config();
const express = require("express");
const path = require("path");
const Razorpay = require("razorpay");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

/* MONGODB CONNECTION */
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));
/* MIDDLEWARE */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* STATIC FILES */
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* RAZORPAY SETUP */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
/* AUTH ROUTES */
const authRoutes = require("./routes/authRoutes");
app.use("/api", authRoutes);

/* PRODUCT MODEL */
const Product = require("./models/Product");

/* GET ALL PRODUCTS */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error while loading products" });
  }
});

/* GET SINGLE PRODUCT */
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

/* TEST ROUTE */
app.get("/test", (req, res) => {
  res.json({ message: "Server working fine" });
});

/* HOME ROUTE */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* CREATE RAZORPAY ORDER */
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount"
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (error) {
    console.error("Razorpay create-order error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order"
    });
  }
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});