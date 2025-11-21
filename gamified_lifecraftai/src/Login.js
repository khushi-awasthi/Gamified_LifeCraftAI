
import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Send Firebase user info to Node backend
  const sendUserToBackend = async (user) => {
    try {
      await fetch("http://localhost:5000/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
        }),
      });
    } catch (err) {
      console.error("Error sending user to backend:", err);
    }
  };

  // Firebase email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send user info to backend
      await sendUserToBackend(user);

      navigate("/HeroPage");
      
    } catch (err) {
      alert(err.message);
    }
  };

  // Firebase Google login
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Send user info to backend
      await sendUserToBackend(user);

      navigate("/HeroPage");
       
    } catch (err) {
      alert(err.message);
    }
  };

  // Test connection to backend
  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ test: "Hello from frontend" }),
      });

      const data = await response.json();
      alert(data.message); // ✅ Frontend connected to backend
    } catch (err) {
      console.error(err);
      alert("Backend not reachable!");
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: "url('/background GIF.gif')" }}>
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        <input className="l1" type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="l1" type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="log-btn" type="submit">Login</button>
        <button className="log-btn" type="button" onClick={handleGoogleSignIn}>Sign in with Google</button>

      
        

        <p>Don’t have an account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  );
}
