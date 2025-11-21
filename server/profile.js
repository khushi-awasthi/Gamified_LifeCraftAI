// // const express = require('express');
// // const bodyParser = require('body-parser');
// // const cors = require('cors'); 

// // const app = express();
// // const PORT = 5000; 

// // // --- Configuration and Middleware ---

// // // Mock Database (In-memory storage)
// // const mockDatabase = {};

// // // Enable CORS for all requests (important for React running on a different port)
// // app.use(cors());

// // // Parse incoming JSON data
// // app.use(bodyParser.json());

// // // --- Endpoints ---

// // // 1. REGISTRATION ENDPOINT (To save extra user data)
// // // This should be called from your React Registration component (Register.js)
// // app.post('/register-user', (req, res) => {
// //     const { uid, email, name, contact, profession } = req.body;
    
// //     if (!uid) {
// //         return res.status(400).json({ message: "UID is required for registration." });
// //     }

// //     // Save the complete user profile into our mock database
// //     mockDatabase[uid] = {
// //         name,
// //         email,
// //         contact,
// //         profession,
// //         registeredAt: new Date().toISOString()
// //     };
    
// //     console.log(`[DB] User registered: ${email}. Saved data for UID: ${uid}`);
// //     console.log(`[DB] Current DB size: ${Object.keys(mockDatabase).length} users.`);

// //     res.status(201).json({ 
// //         message: "User registration complete. Profile data saved to backend DB." 
// //     });
// // });

// // // 2. PROFILE RETRIEVAL ENDPOINT (To fetch extra user data for Profile.js)
// // // This is called from your React Profile component
// // app.get('/api/profile/:uid', (req, res) => {
// //     const { uid } = req.params;
    
// //     // Look up user data in the mock database
// //     const profileData = mockDatabase[uid];
    
// //     if (profileData) {
// //         console.log(`[API] Successfully retrieved profile for UID: ${uid}`);
        
// //         // Return the saved data
// //         return res.status(200).json({
// //             message: 'Profile data retrieved successfully',
// //             profileData: profileData
// //         });
// //     } else {
// //         console.log(`[API] Profile not found for UID: ${uid}`);
        
// //         // If not found, return a 404 (or default data)
// //         return res.status(404).json({
// //             message: 'Profile data not found in backend database.',
// //             profileData: { contact: 'N/A', profession: 'N/A' }
// //         });
// //     }
// // });

// // // --- Start Server ---
// // app.listen(PORT, () => {
// //     console.log(`Node.js Server running on http://localhost:${PORT}`);
// // });

// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const User = require('./models/user'); // MongoDB User model

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log('✅ MongoDB connected successfully'))
//   .catch((err) => console.error('❌ MongoDB connection error:', err));

// // --- ROUTES ---

// // Create or update user profile
// app.post('/register-user', async (req, res) => {
//   try {
//     const { uid, email, name, contact, profession } = req.body;
//     if (!uid || !email) return res.status(400).json({ message: 'Missing UID or Email' });

//     // Check if user already exists
//     let user = await User.findOne({ firebaseUid: uid });

//     if (user) {
//       // Update existing user (optional)
//       user.name = name || user.name;
//       user.profession = profession || user.profession;
//       user.contact = contact || user.contact;
//       await user.save();
//       return res.status(200).json({ message: 'User profile updated', profileData: user });
//     }

//     // Create new user
//     user = new User({
//       firebaseUid: uid,
//       name,
//       email,
//       contact,
//       profession,
//     });

//     await user.save();
//     res.status(201).json({ message: 'User registration complete', profileData: user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to save user', error });
//   }
// });

// // Fetch user profile
// app.get('/api/profile/:uid', async (req, res) => {
//   try {
//     const user = await User.findOne({ firebaseUid: req.params.uid });
//     if (!user) return res.status(404).json({ message: 'User not found', profileData: null });

//     res.status(200).json({
//       message: 'Profile data retrieved successfully',
//       profileData: user,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to fetch profile', error });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/user"); // Assumes your Mongoose model is correctly imported

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

// Test Connection
app.post("/test-connection", (req, res) => {
    console.log("Received test connection request from frontend:", req.body);
    res.status(200).json({
        message: "✅ Backend connection successful! Data received: " + req.body.test,
    });
});

// --- CORE PROFILE ROUTES ---

// 1. PROFILE UPSERT / INITIAL REGISTRATION ENDPOINT (Replaces /save-user)
// Creates a new user if not found, or updates existing data if found.
app.post("/register-user", async (req, res) => {
    try {
        const { name, contact, profession, email, firebaseUid } = req.body;
        console.log("Received /register-user request:", req.body);

        if (!firebaseUid || !email) {
            return res.status(400).json({ message: "Missing required fields (firebaseUid or email)." });
        }

        // Use findOneAndUpdate with upsert: true to create or update the user
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: firebaseUid }, // Find by UID
            { 
                // Set the fields. Use $set in a real application, but here we update all provided fields
                name: name || 'Name Not Set',
                contact: contact, 
                profession: profession, 
                email: email, 
            }, 
            { 
                new: true, // Return the new document
                upsert: true, // Create the document if it doesn't exist
                runValidators: true // Run schema validators
            }
        );

        console.log(`✅ Profile Upsert successful for UID: ${firebaseUid}`);
        res.status(200).json({ 
            message: "User data created/updated successfully!", 
            profileData: updatedUser 
        });
    } catch (error) {
        console.error("❌ Error performing upsert on user profile:", error);
        res.status(500).json({ message: "Failed to process user profile", error: error.message });
    }
});

// 2. PROFILE RETRIEVAL ENDPOINT (GET)
// Essential for loading the profile dashboard
app.get('/api/profile/:uid', async (req, res) => {
    try {
        const user = await User.findOne({ firebaseUid: req.params.uid });
        
        if (!user) {
            // Return a default structure if the user isn't found yet
            return res.status(404).json({ 
                message: 'User not found.', 
                profileData: { name: 'Guest User', profession: 'Professional' } 
            });
        }

        console.log(`[API] Successfully retrieved profile for UID: ${req.params.uid}`);
        res.status(200).json({
            message: 'Profile data retrieved successfully',
            profileData: user,
        });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
    }
});

// 3. PROFILE UPDATE ENDPOINT (PUT)
// Used when the user explicitly clicks "Edit Profile" and saves changes
app.put('/api/profile/update', async (req, res) => {
    try {
        const { uid, name, contact, profession } = req.body;

        if (!uid) {
            return res.status(400).json({ message: 'UID is required for updating the profile.' });
        }

        // We use an object to only include fields that were provided in the request body
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (contact !== undefined) updateFields.contact = contact;
        if (profession !== undefined) updateFields.profession = profession;

        // Find the user by their Firebase UID and update
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: uid },
            updateFields,
            { new: true } // Returns the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found for update.' });
        }

        console.log(`[API] Profile updated successfully for UID: ${uid}`);
        res.status(200).json({ 
            message: 'Profile updated successfully', 
            profileData: updatedUser 
        });

    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
