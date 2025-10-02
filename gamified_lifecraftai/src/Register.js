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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
