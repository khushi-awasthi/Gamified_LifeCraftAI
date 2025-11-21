
// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import HeroPage from "./HeroPage";
import CareerPageHero from "./career_page_hero";

import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/HeroPage" element={<HeroPage />} />
          <Route path="/career-page" element={
    <ProtectedRoute>
      
      <CareerPageHero /> 
    </ProtectedRoute>
  } 
/>
          <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
