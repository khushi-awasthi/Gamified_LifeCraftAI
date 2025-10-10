// src/Register.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import './Register.css';

export default function Register() {
  const [name, setName] = useState("");
  const [contact, setNum] = useState("");
  const [profession, setprofession] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // src/Register.js (Add this function)

// Function to send user details to Node.js backend
const sendUserToBackend = async (user, profileData) => {
  try {
    const response = await fetch("http://localhost:5000/register-user", { // 👈 Make sure this URL/Port is correct
      method: "POST",
      headers: { 
            "Content-Type": "application/json" 
        },
        body: JSON.stringify({
         uid: user.uid, // Firebase User ID
         email: user.email,
            // Pass all the extra state variables
              ...profileData 
        }),
    });

      if (!response.ok) {
          throw new Error('Failed to save user data in backend.');
      }
      console.log('User data successfully sent to backend.');

    } catch (err) {
      console.error("Error sending user to backend:", err);
// Optional: Display error to the user if the backend fails
       alert("Registration successful, but failed to save profile data.");
   }
   };

  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await createUserWithEmailAndPassword(auth, email, password);
  //     navigate("/profile");
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };
  // src/Register.js (Replace your existing handleRegister with this)

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
// 1. FIREBASE REGISTRATION (Your existing code)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // --- START: NEW CODE BLOCK ---
      
      // 2. COLLECT DATA
      const profileData = {
          name: name,
          contact: contact,
          profession: profession
      };

// 3. SEND TO NODE.JS BACKEND
      await sendUserToBackend(user, profileData);

      // --- END: NEW CODE BLOCK ---

      navigate("/profile");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div class="register-container">
      <div className="register-container">
  <div className="register-box">
    {/* Left side (info panel) */}
    <div className="register-left">
      <h2>LifeCraftAi</h2>
      <p>A Gamified Self-Improvement Platform</p>
      
      <img src="Logo.jpg" alt="host" />
      
      
    </div>

    {/* Right side (your form) */}
    <div className="register-right">
      <h2>Register</h2>
      <p>Enter your information to register.</p>
      <form className="reg-form" onSubmit={handleRegister}>
        <input className="i1" type="name" onChange={(e) => setName(e.target.value)} placeholder="Enter Your Name" />
        <input className="i1" type="contact" onChange={(e) => setNum(e.target.value)} placeholder="Enter Your contact number" />
        <input className="i1" type="profession" onChange={(e) => setprofession(e.target.value)} placeholder="Enter Your profession" />
        <input className="i1" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="i1" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="reg-btn" type="submit">Register</button>
      </form>
    </div>
  </div>
</div>

    </div>
  );
  

}

