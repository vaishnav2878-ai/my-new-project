const express = require("express");
const router = express.Router();
const User = require("../models/User");

// API logger
router.use((req, res, next) => {
  console.log(`API Request: ${req.method} ${req.url}`);
  next();
});

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.json({ message: "Username or email already exists" });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    console.log("User registered:", username);
    res.json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN (username OR email)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.json({ message: "Username/email and password are required" });
    }

    const user = await User.findOne({
      $and: [
        { password: password },
        {
          $or: [
            { username: username },
            { email: username }
          ]
        }
      ]
    });

    if (user) {
      console.log("User logged in:", username);
      res.json({ message: "Login successful" });
    } else {
      res.json({ message: "Invalid username/email or password" });
    }

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;