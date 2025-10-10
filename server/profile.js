const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const PORT = 5000; 

// --- Configuration and Middleware ---

// Mock Database (In-memory storage)
const mockDatabase = {};

// Enable CORS for all requests (important for React running on a different port)
app.use(cors());

// Parse incoming JSON data
app.use(bodyParser.json());

// --- Endpoints ---

// 1. REGISTRATION ENDPOINT (To save extra user data)
// This should be called from your React Registration component (Register.js)
app.post('/register-user', (req, res) => {
    const { uid, email, name, contact, profession } = req.body;
    
    if (!uid) {
        return res.status(400).json({ message: "UID is required for registration." });
    }

    // Save the complete user profile into our mock database
    mockDatabase[uid] = {
        name,
        email,
        contact,
        profession,
        registeredAt: new Date().toISOString()
    };
    
    console.log(`[DB] User registered: ${email}. Saved data for UID: ${uid}`);
    console.log(`[DB] Current DB size: ${Object.keys(mockDatabase).length} users.`);

    res.status(201).json({ 
        message: "User registration complete. Profile data saved to backend DB." 
    });
});

// 2. PROFILE RETRIEVAL ENDPOINT (To fetch extra user data for Profile.js)
// This is called from your React Profile component
app.get('/api/profile/:uid', (req, res) => {
    const { uid } = req.params;
    
    // Look up user data in the mock database
    const profileData = mockDatabase[uid];
    
    if (profileData) {
        console.log(`[API] Successfully retrieved profile for UID: ${uid}`);
        
        // Return the saved data
        return res.status(200).json({
            message: 'Profile data retrieved successfully',
            profileData: profileData
        });
    } else {
        console.log(`[API] Profile not found for UID: ${uid}`);
        
        // If not found, return a 404 (or default data)
        return res.status(404).json({
            message: 'Profile data not found in backend database.',
            profileData: { contact: 'N/A', profession: 'N/A' }
        });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Node.js Server running on http://localhost:${PORT}`);
});
