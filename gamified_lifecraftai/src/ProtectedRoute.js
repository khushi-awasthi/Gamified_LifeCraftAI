// // src/ProtectedRoute.js
// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function ProtectedRoute({ children }) {
//   const { user } = useAuth();
//   return user ? children : <Navigate to="/" />;
// }
// src/ProtectedRoute.js

import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children }) {
    // 🚨 1. Get both 'user' and the new 'loading' state from the context
    const { user, loading } = useAuth(); 

    // 2. CHECK LOADING STATE
    // If loading is true, we haven't determined the user's status yet.
    // Return a temporary loading screen to prevent immediate redirect.
    if (loading) {
        return (
            <div style={{ 
                height: '100vh', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                backgroundColor: '#1e2029',
                color: '#d1d5db',
                fontSize: '1.2rem'
            }}>
                Checking user session...
            </div>
        );
    }

    // 3. CHECK AUTHENTICATION STATE (Only runs if loading is false)
    // If loading is finished (false) AND there is no user, navigate to the login page.
    if (!user) {
        return <Navigate to="/" />;
    }

    // 4. RENDER CONTENT
    // If a user is found and loading is complete, render the protected content.
    return children;
}