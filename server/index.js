
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Required for cross-origin requests

const app = express();
const PORT = 5000; // Must match the port in your React component

// --- MIDDLEWARE ---
// Enable CORS for all routes and origins
app.use(cors());

// Parse incoming JSON data from the React frontend
app.use(bodyParser.json());
// app.use(express.json()); // Alternative to body-parser

// --- ENDPOINTS ---

// 1. Endpoint for testing connection
// (Called by the testBackend function in your React code)
app.post('/test-connection', (req, res) => {
    console.log("Received test connection request from frontend:", req.body);
    // You should see "Hello from frontend" in the Node.js console
    res.status(200).json({ 
        message: "✅ Backend connection successful! Data received: " + req.body.test 
    });
});

// 2. Endpoint to save Firebase user info
// (Called by the sendUserToBackend function in your React code)
app.post('/save-user', (req, res) => {
    const { uid, email, displayName } = req.body;
    
    // ⚠️ CRITICAL STEP: Store or update user in your database
    console.log("--- New User Data Received ---");
    console.log("UID:", uid);
    console.log("Email:", email);
    console.log("Display Name:", displayName);
    
    // In a real application, you would connect to a database (e.g., MongoDB, PostgreSQL)
    // and run an INSERT or UPSERT operation here to store the user details.
    
    // Example: Database.saveUser({ uid, email, displayName });

    if (uid) {
        // Send a success response back to the frontend
        res.status(200).json({ message: "User data saved/updated successfully in backend DB." });
    } else {
        res.status(400).json({ message: "Missing user UID." });
    }
});

// --- SERVER START ---
app.listen(PORT, () => {
    console.log(`Node.js Server running on http://localhost:${PORT}`);
});