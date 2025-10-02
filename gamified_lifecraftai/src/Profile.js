// // // src/Profile.js
// // import { useAuth } from "./AuthContext";

// // export default function Profile() {
// //   const { user, logout } = useAuth();

// //   return (
// //     <div class="profile-container">
// //       <img src="Logo.jpg" alt="host" />
// //     <div>
// //       <h2>Profile</h2>
// //       {user ? (
// //         <>
// //           <p>Email: {user.email}</p>
// //           <button onClick={logout}>Logout</button>
// //         </>
// //       ) : (
// //         <p>No user logged in</p>
// //       )}
// //     </div>
// //     </div>

// //   );
  
// // }

// // src/Profile.js
// import { useAuth } from "./AuthContext";
// import "./Profile.css"; // Import the styling

// export default function Profile() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="profile-container"style={{ backgroundImage: "url('/background GIF.gif')" }}>
//       {/* Top bar with logo (left) and menu (right) */}
//       <div className="top-bar">
//         <img src="Logo.jpg" alt="host" className="logo" />

//         <div className="menu">☰</div>
//         <div className="dropdown">
//           <ul>
//             <li>Eco</li>
//             <li>Calm Space</li>
//             <li>Career Growth</li>
//           </ul>
//         </div>
//       </div>

//       {/* Profile Details */}
//       <div className="profile-content">
//         <h2>LifeCraftAI: A gamified SelfImprovement Plateform</h2>
//         {user ? (
//           <>
//             <p>Email: {user.email}</p>
//             <button onClick={logout}>Logout</button>
//           </>
//         ) : (
//           <p>No user logged in</p>
//         )}

//         {/* Extra Buttons */}
//         <div className="extra-buttons">
//           <button>Resume</button>
//           <button>Bar Graph</button>
//           <button>Chatbot</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// src/Profile.js
// import { useAuth } from "./AuthContext";
// import { useNavigate } from "react-router-dom";
// import "./Profile.css";

// export default function Profile() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   return (
    
//        <div className="profile-container" style={{ backgroundImage: "url('/background GIF.gif')" }}>
//       {/* Top Navigation */}
//       <div className="top-bar">
//         <div className="logo-section">
//           <img src="Logo.jpg" alt="host" className="logo" />
//           <h1 className="brand">LifeCraftAI</h1>
//         </div>

//         {/* Dropdown */}
//         <div className="menu-wrapper">
//           <button className="menu-btn">☰ Menu</button>
//           <div className="dropdown">
//             <ul>
//               <li onClick={() => navigate("/eco")}>🌱 Eco</li>
//               <li onClick={() => navigate("/calm-space")}>🧘 Calm Space</li>
//               <li onClick={() => navigate("/career-growth")}>🚀 Career Growth</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Profile Content */}
//       <div className="profile-content">
//         <h2>LifeCraftAI: A Gamified Self-Improvement Platform</h2>

//         {user ? (
//           <>
//             <p>📧 {user.email}</p>
//             <button className="logout-btn" onClick={logout}>
//               Logout
//             </button>
//           </>
//         ) : (
//           <p>⚠️ No user logged in</p>
//         )}

//         {/* Resume Section */}
//         <div className="resume-card">
//           <h3>📄 My Resume</h3>
//           <iframe
//             src="/resume.pdf"   // 👉 place resume.pdf in your public/ folder or use a hosted link
//             title="Resume"
//             className="resume-frame"
//           ></iframe>
//         </div>

//         {/* Buttons */}
//         <div className="extra-buttons">
//           <button onClick={() => navigate("/bargraph")}>📊 Performance Bar Graph</button>
//           <button onClick={() => navigate("/chatbot")}>🤖 Chatbot Assistant</button>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/Profile.js
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Dummy data for bar chart (replace later with Eco page data)
  const data = [
    { name: "Week 1", score: 65 },
    { name: "Week 2", score: 80 },
    { name: "Week 3", score: 72 },
    { name: "Week 4", score: 90 },
  ];

  return (
    <div className="profile-container"style={{ backgroundImage: "url('/background GIF.gif')" }}>
      {/* Top Navigation */}
      <div className="top-bar">
        <div className="logo-section">
          <img src="Logo.jpg" alt="host" className="logo" />
          <h1 className="brand">LifeCraftAI</h1>
        </div>

        <div className="menu-wrapper">
          <button className="menu-btn">☰ Menu</button>
          <div className="dropdown">
            <ul>
              <li onClick={() => navigate("/eco")}>🌱 Eco</li>
              <li onClick={() => navigate("/calm-space")}>🧘 Calm Space</li>
              <li onClick={() => navigate("/career-growth")}>🚀 Career Growth</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <h2>LifeCraftAI: A Gamified Self-Improvement Platform</h2>

        {user ? (
          <>
           
            <p>📧 <strong>{user.email}</strong></p>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <p>⚠️ No user logged in</p>
        )}

        {/* Resume Section */}
        <div className="resume-card">
          <h3>📄 My Resume</h3>
          <iframe
            src="/resume.pdf"  // Put resume.pdf in public/ folder
            title="Resume"
            className="resume-frame"
          ></iframe>
        </div>

        {/* Bar Chart Section */}
        <div className="chart-card">
          <h3>📊 Performance Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Buttons */}
        <div className="extra-buttons">
          <button onClick={() => navigate("/chatbot")}>🤖 Chatbot Assistant</button>
        </div>
      </div>
    </div>
  );
}
