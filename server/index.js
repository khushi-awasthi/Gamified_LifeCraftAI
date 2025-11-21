
// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const cors = require('cors'); // Required for cross-origin requests

// // const app = express();
// // const PORT = 5000; // Must match the port in your React component

// // // --- MIDDLEWARE ---
// // // Enable CORS for all routes and origins
// // app.use(cors());

// // // Parse incoming JSON data from the React frontend
// // app.use(bodyParser.json());
// // // app.use(express.json()); // Alternative to body-parser

// // // --- ENDPOINTS ---

// // // 1. Endpoint for testing connection
// // // (Called by the testBackend function in your React code)
// // app.post('/test-connection', (req, res) => {
// //     console.log("Received test connection request from frontend:", req.body);
// //     // You should see "Hello from frontend" in the Node.js console
// //     res.status(200).json({ 
// //         message: "✅ Backend connection successful! Data received: " + req.body.test 
// //     });
// // });

// // // 2. Endpoint to save Firebase user info
// // // (Called by the sendUserToBackend function in your React code)
// // app.post('/save-user', (req, res) => {
// //     const { uid, email, displayName } = req.body;
    
// //     // ⚠️ CRITICAL STEP: Store or update user in your database
// //     console.log("--- New User Data Received ---");
// //     console.log("UID:", uid);
// //     console.log("Email:", email);
// //     console.log("Display Name:", displayName);
    
// //     // In a real application, you would connect to a database (e.g., MongoDB, PostgreSQL)
// //     // and run an INSERT or UPSERT operation here to store the user details.
    
// //     // Example: Database.saveUser({ uid, email, displayName });

// //     if (uid) {
// //         // Send a success response back to the frontend
// //         res.status(200).json({ message: "User data saved/updated successfully in backend DB." });
// //     } else {
// //         res.status(400).json({ message: "Missing user UID." });
// //     }
// // });

// // // --- SERVER START ---
// // app.listen(PORT, () => {
// //     console.log(`Node.js Server running on http://localhost:${PORT}`);
// // });

// // require('dotenv').config();

// // // === Import dependencies ===
// // const mongoose = require('mongoose');
// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const cors = require('cors');
// // const User = require("./models/user");

// // // === Initialize express app ===
// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // === Middleware ===
// // app.use(cors());
// // app.use(bodyParser.json()); // Parse JSON data from frontend

// // // === Show connection preview (for debugging) ===
// // console.log(
// //   "MONGO_URI preview:",
// //   process.env.MONGO_URI ? process.env.MONGO_URI.slice(0, 80) + "..." : "undefined"
// // );

// // // === Connect to MongoDB Atlas ===
// // mongoose
// //   .connect(process.env.MONGO_URI)
// //   .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
// //   .catch((err) => console.error("❌ Database Connection Error:", err));

// // // === API Endpoints ===

// // // 1️⃣ Test connection route
// // app.post("/test-connection", (req, res) => {
// //   console.log("Received test connection request from frontend:", req.body);
// //   res.status(200).json({
// //     message: "✅ Backend connection successful! Data received: " + req.body.test,
// //   });
// // });

// // // 2️⃣ Save user route
// // app.post("/save-user", async (req, res) => {
// //   try {
// //     const { name, contact, profession, email, firebaseUid } = req.body;

// //     console.log("--- New User Data Received ---");
// //     console.log(req.body);
    
// //      // Create a new user document
// //     const newUser = new User({ name, contact, profession, email, firebaseUid });
    
// //      // Save to MongoDB
// //     await newUser.save();

// //     console.log("✅ User saved successfully:", newUser);
// //     res.status(200).json({ message: "User data saved successfully!", user: newUser });
// //   } catch (error) {
// //     console.error("❌ Error saving user:", error);
// //     res.status(500).json({ message: "Failed to save user", error: error.message });
// //   }
// // });

// // // === Start the server ===
// // app.listen(PORT, () => {
// //   console.log(🚀 Server running on http://localhost:${PORT});
// // });


// require("dotenv").config();
// const mongoose = require("mongoose");
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const User = require("./models/user");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
//   .catch((err) => console.error("❌ Database Connection Error:", err));

// // Test Connection
// app.post("/test-connection", (req, res) => {
//   console.log("Received test connection request from frontend:", req.body);
//   res.status(200).json({
//     message: "✅ Backend connection successful! Data received: " + req.body.test,
//   });
// });

// // Save User (Match frontend)
// app.post("/save-user", async (req, res) => {
//   try {
//     const { name, contact, profession, email, firebaseUid } = req.body;

//     console.log("--- New User Data Received ---");
//     console.log(req.body);

//     if (!firebaseUid || !email) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const newUser = new User({ name, contact, profession, email, firebaseUid });
//     await newUser.save();

//     console.log("✅ User saved successfully:", newUser);
//     res.status(200).json({ message: "User data saved successfully!", user: newUser });
//   } catch (error) {
//     console.error("❌ Error saving user:", error);
//     res.status(500).json({ message: "Failed to save user", error: error.message });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/user");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch((err) => console.error("❌ Database Connection Error:", err));


// --------------------------------------------------
// 1️⃣ TEST BACKEND
// --------------------------------------------------
app.post("/test-connection", (req, res) => {
  console.log("Received test connection request from frontend:", req.body);
  res.status(200).json({
    message: "Backend working! Received: " + req.body.test,
  });
});


// --------------------------------------------------
// 2️⃣ SAVE USER (Register / First time login)
// --------------------------------------------------
app.post("/save-user", async (req, res) => {
  try {
    const { name, contact, profession, email, firebaseUid } = req.body;

    console.log("--- New User Data Received ---");
    console.log(req.body);

    if (!firebaseUid || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newUser = new User({ name, contact, profession, email, firebaseUid });
    await newUser.save();

    console.log("✅ User saved successfully:", newUser);
    res.status(200).json({
      message: "User data saved successfully!",
      user: newUser,
    });

  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ message: "Failed to save user", error: error.message });
  }
});


// --------------------------------------------------
// 3️⃣ GET USER PROFILE (This is what your Profile page needs)
// --------------------------------------------------
app.get("/api/profile/:uid", async (req, res) => {
  try {
    const firebaseUid = req.params.uid;

    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        profileData: null,
      });
    }

    res.status(200).json({
      message: "Profile data retrieved successfully",
      profileData: user,
    });

  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});


// --------------------------------------------------
// START SERVER
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
