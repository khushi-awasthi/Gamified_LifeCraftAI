import React, { useEffect, useRef, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, getAuth } from 'firebase/auth';

import { auth } from './firebase'; 
const chartColors = {
  primaryBlue: '#4c51bf',
  activeGreen: '#48bb78',
  proYellow: '#ecc94b',
  slate700: '#374151',
  darkText: '#d1d5db',
};

// Custom Chart.js Plugin to display the percentage in the center of the Doughnut
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw(chart) {
    const { ctx, width, height } = chart;
    const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
    const achieved = chart.data.datasets[0].data[0];
    const percentage = Math.round((achieved / total) * 100);

    let textColor = chartColors.darkText;
    if (chart.canvas.id === 'careerChart') {
      textColor = chartColors.primaryBlue;
    } else if (chart.canvas.id === 'studyChart') {
      textColor = chartColors.activeGreen;
    } else if (chart.canvas.id === 'financialChart') {
      textColor = chartColors.proYellow;
    }

    ctx.restore();
    const fontSize = (height / 180).toFixed(2);
    ctx.font = `bold ${fontSize}em Inter, sans-serif`;
    ctx.textBaseline = 'middle';

    const text = `${percentage}%`;
    const textX = Math.round((width - ctx.measureText(text).width) / 2);
    const textY = height / 2;

    ctx.fillStyle = textColor;
    ctx.fillText(text, textX, textY);
    ctx.save();
  },
};

// Utility function to create the Doughnut Chart
const createDoughnutChart = (canvasId, label, dataValue, max, customColor) => {
  // Check if Chart is available globally (as it was in the original HTML setup)
  if (typeof window.Chart === 'undefined') return;

  const ctx = document.getElementById(canvasId)?.getContext('2d');
  if (!ctx) return;

  // Register plugin if it hasn't been already
  if (!window.Chart.isPluginRegistered(centerTextPlugin.id)) {
    window.Chart.register(centerTextPlugin);
  }

  // Destroy existing chart to prevent duplicates on re-render
  if (window.Chart.getChart(canvasId)) {
    window.Chart.getChart(canvasId).destroy();
  }

  new window.Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [label, 'Remaining'],
      datasets: [{
        data: [dataValue, max - dataValue],
        backgroundColor: [customColor, chartColors.slate700],
        hoverBackgroundColor: [customColor, chartColors.slate700],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: '85%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
        centerText: true,
      },
      hover: {
        mode: null
      }
    }
  });
};



const App = () => {

   // START: ADD THIS BLOCK
   const navigate = useNavigate();
    const [userProfile, setUserProfile] = useState({
        name: 'Guest User',
        email: 'Loading...',
        loading: true,
    }); 
    
   
  


// }, []);
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
      await fetch('http://localhost:5000/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firebaseUid: user.uid,   // ✅ match backend
          email: user.email,
          name: user.displayName || 'Name Not Set',
          profession: 'Professional',
          contact: '',
        }),
      });

     const res = await fetch(`http://localhost:5000/api/profile/${user.uid}`);

      const result = await res.json();

      setUserProfile({
        name: result.profileData?.name || 'Khushi Awasthi',
        email: user.email,
        profession: result.profileData?.profession || 'Professional',
        loading: false,
      });
    } catch (err) {
      console.error(err);
      setUserProfile({
        name: 'Khushi',
        email: user.email,
        profession: 'Professional',
        loading: false,
      });
    }
  });

  return () => unsubscribe();
}, []);

    
  // Use a ref for the style element to manage custom CSS
  const styleRef = useRef(null);
  
  // Chart data moved inside the component
  const chartData = {
    career: { value: 65, max: 100, color: chartColors.primaryBlue, backText: '65%', backLabel: 'Target Completed' },
    study: { value: 4, max: 10, color: chartColors.activeGreen, backText: '4/10', backLabel: 'Books Read' },
    financial: { value: 2500, max: 10000, color: chartColors.proYellow, backText: '$2500', backLabel: 'Saved' },
  };

  // useEffect to run Chart.js setup after the component mounts
  useEffect(() => {
    createDoughnutChart('careerChart', 'Career', chartData.career.value, chartData.career.max, chartData.career.color);
    createDoughnutChart('studyChart', 'Study', chartData.study.value, chartData.study.max, chartData.study.color);
    createDoughnutChart('financialChart', 'Financial', chartData.financial.value, chartData.financial.max, chartData.financial.color);
    
    // Cleanup function (optional but good practice, though less critical for global Chart.js)
    return () => {
      if (window.Chart) {
        Object.keys(chartData).forEach(key => {
          const chartId = `${key}Chart`;
          const chartInstance = window.Chart.getChart(chartId);
          if (chartInstance) chartInstance.destroy();
        });
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  // Inject the custom CSS and Tailwind config using React's mechanisms
  // NOTE: In a true React project, this custom CSS would be in a separate file (e.g., App.css) 
  // and the Tailwind config would be in a postcss.config.js/tailwind.config.js.
  // We're consolidating for the single-file requirement.
  const customStyles = `
    /* Custom scrollbar styling for a cleaner dark theme look */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #4a5568; /* Tailwind gray-600 */
      border-radius: 4px;
    }
    ::-webkit-scrollbar-track {
      background-color: #1a202c; /* Tailwind gray-900 */
    }
    /* Setting the Inter font */
    html { font-family: 'Inter', sans-serif; }
    
    /* --- CSS FOR 3D FLIP EFFECT (Hover-based) --- */
    .flip-card {
      perspective: 1000px; /* Gives the 3D depth effect */
      cursor: pointer;
      height: 250px; /* Fixed height to prevent collapse during flip */
    }
    .flip-card-inner {
      position: relative;
      width: 100%;
      height: 100%;
      transition: transform 0.6s;
      transform-style: preserve-3d; /* Key for 3D rotation */
    }
    .flip-card:hover .flip-card-inner {
      transform: rotateY(180deg);
    }
    .flip-card-front, .flip-card-back {
      position: absolute;
      width: 100%;
      height: 100%;
      -webkit-backface-visibility: hidden; 
      backface-visibility: hidden;
      border-radius: 0.75rem; /* rounded-xl */
      padding: 1.25rem; /* p-5 */
      border: 1px solid #374151; /* slate-700/50 */
      background-color: #2b2e3a; /* card-bg */
      display: flex;
      flex-direction: column;
    }
    .flip-card-back {
      transform: rotateY(180deg);
      justify-content: center;
      align-items: center;
    }
    .chart-container {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      max-height: 160px; 
      margin-top: 1rem;
    }
    .quick-overview-card-wrapper {
        padding: 0 !important;
        border: none !important;
    }
  `;

  return (
    // The <style> tag includes all the custom CSS, making the component self-contained.
    <>
      <style ref={styleRef} dangerouslySetInnerHTML={{ __html: customStyles }} />
      {/* In a real React app using the Tailwind CLI, you'd configure these colors 
        in tailwind.config.js and they'd be available as standard classes. 
        Since we're embedding everything and the original HTML used inline CDN + config,
        we rely on the browser having configured these via the CDN script or using hardcoded values 
        for 'dark-bg', 'card-bg', 'primary-blue', etc., which is what the CSS does.
        We use the hardcoded values as fallback Tailwind classes won't be pre-configured.
      */}
      <div className="bg-[#1e2029] min-h-screen text-[#d1d5db] p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Layout: 2/3 for Main Content, 1/3 for Sidebar (on large screens) */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* COL 1: Main Content (Takes 2/3 space on large screens) */}
            <div className="lg:col-span-2 space-y-6">

              {/* 1. Profile Header Card */}
              <div className="bg-[#2b2e3a] rounded-xl shadow-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4c51bf]/80">
                <div className="flex items-center mb-4 sm:mb-0">
                  {/* Profile Image Placeholder */}
                  <div className="w-16 h-16 rounded-full bg-slate-700 overflow-hidden mr-4">
                    <svg className="w-full h-full text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.247 2.378 11.996 5.993zM16.012 8.5a4.006 4.006 0 11-8.012 0 4.006 4.006 0 018.012 0z" />
                    </svg>
                  </div>
                  <div>
                    {
                      <div>

                    <h1 className="text-2xl font-bold text-white">
                      {userProfile.loading ? 'Loading...' : userProfile.name}</h1> 
                    <p className="text-slate-400 mb-2"> {userProfile.email}</p></div>}
                    <div className="flex space-x-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#ecc94b] text-slate-900">Professional</span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#48bb78] text-slate-900">Active</span>
                    </div>
                  </div>
                </div>
                <button className="flex items-center space-x-1 px-4 py-2 bg-[#4c51bf] hover:bg-indigo-600 text-white font-medium rounded-lg transition duration-200 text-sm">
                  {/* SVG for Edit Icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* 2. Quick Overview Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Quick Overview</h2>
                  <button className="text-slate-400 hover:text-white transition duration-200">
                    {/* SVG for Refresh Icon */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 15m15.356-2H15V9"></path></svg>
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">

                  {/* Chart Card 1: Career Progress (FLIP CARD) */}
                  <FlipCard id="careerCard" data={chartData.career} title="Career Progress" chartId="careerChart" />

                  {/* Chart Card 2: Study Milestones (FLIP CARD) */}
                  <FlipCard id="studyCard" data={chartData.study} title="Study Milestones" chartId="studyChart" />

                  {/* Chart Card 3: Financial Goals (FLIP CARD) */}
                  <FlipCard id="financialCard" data={chartData.financial} title="Financial Goals" chartId="financialChart" />

                </div>
              </div>

              {/* 3. Goal Tracker Section (Left Bottom) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Goal Tracker</h2>
                  <button className="text-white hover:text-slate-300 transition duration-200">
                    {/* SVG for Plus Icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Goal Item 1 */}
                  <GoalItem category="Career" title="Complete Advanced Certification" dueDate="August 30, 2023" progress={65} color={chartColors.primaryBlue} />
                  {/* Goal Item 2 */}
                  <GoalItem category="Study" title="Read 20 Books This Year" dueDate="December 31, 2023" progress={40} color={chartColors.activeGreen} />
                  {/* Goal Item 3 */}
                  <GoalItem category="Eco" title="Save Electricity" dueDate="January 15, 2024" progress={25} color={chartColors.proYellow} />
                </div>
              </div>

              {/* 4. Calm Space Card (Bottom Middle) */}
              <div className="bg-[#2b2e3a] rounded-xl shadow-lg p-5 border border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4c51bf]/80">
                <h2 className="text-xl font-semibold text-white mb-4">Calm Space</h2>
                <div className="flex justify-between text-center mb-6">
                  <div>
                    <p className="text-slate-400 text-sm">Last Mood</p>
                    <span className="font-medium text-lg text-white">Balanced</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Last Session</p>
                    <span className="font-medium text-lg text-[#4c51bf]">15 min</span>
                  </div>
                  <div>
                    <p className="text-slate-400 text-sm">Streak</p>
                    <span className="font-medium text-lg text-[#48bb78]">7 days</span>
                  </div>
                </div>

                <h3 className="font-medium text-slate-300 mb-3">Recent Sessions</h3>
                <div className="space-y-3 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-transparent transition-all duration-300 hover:bg-slate-700 hover:border-[#4c51bf]/80">
                    <p  className="text-white font-medium">Morning Meditation</p>
                    <p className="text-xs text-slate-400">Today, 7:30 AM • 15min</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 border border-transparent transition-all duration-300 hover:bg-slate-700 hover:border-[#4c51bf]/80">
                    <p className="text-white font-medium">Breathing Exercise</p>
                    <p className="text-xs text-slate-400">Yesterday, 6:00 PM • 5min</p>
                  </div>
                </div>

                <button onClick={() => window.location.href = '/calm_space_updated.html'} className="w-full px-4 py-3 bg-[#4c51bf] hover:bg-indigo-600 text-white font-bold rounded-lg transition duration-200 shadow-md shadow-[#4c51bf]/30">
                  Start New Session
                </button>
              </div>
            </div>

            {/* COL 2: Sidebar (Takes 1/3 space on large screens) */}
            <div className="lg:col-span-1 space-y-6">

              {/* 5. Resume & Career Card */}
              <div className="bg-[#2b2e3a] rounded-xl shadow-lg p-5 border border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4c51bf]/80">
                <h2 className="text-xl font-semibold text-white mb-4">Resume & Career</h2>
                <p className="text-xs text-slate-400 mb-4">Last updated: Nov 10, 2025</p>

                <div className="flex space-x-3 mb-6">
                  <button onClick={() => window.location.href = '/resume_builder3.html'} className="flex items-center space-x-1 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-sm transition duration-200">
                    {/* SVG for View Icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    <span>View</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg text-sm transition duration-200">
                    {/* SVG for Edit Icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    <span>Edit</span>
                  </button>
                  <button onClick={() => window.location.href = '/resume_builder3.html'}className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm transition duration-200">
                    {/* SVG for PDF Icon */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <span>PDF</span>
                  </button>
                </div>

                <h3 className="font-medium text-slate-300 mb-3">Recent Applications</h3>
                <div className="space-y-3">
                  <div className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center border border-transparent transition-all duration-300 hover:bg-slate-700 hover:border-[#4c51bf]/80">
                    <div>
                      <p className="text-white font-medium">Senior Developer</p>
                      <p className="text-xs text-slate-400">TechCorp Inc.</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#48bb78]/30 text-[#48bb78]">Interview</span>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 flex justify-between items-center border border-transparent transition-all duration-300 hover:bg-slate-700 hover:border-[#4c51bf]/80">
                    <div>
                      <p className="text-white font-medium">Product Manager</p>
                      <p className="text-xs text-slate-400">Innovate Solutions</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#4c51bf]/30 text-[#4c51bf]">Interview</span>
                  </div>
                </div>
              </div>

              {/* 6. Settings Card */}
              <div className="bg-[#2b2e3a] rounded-xl shadow-lg p-5 border border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4c51bf]/80">
                <h2 className="text-xl font-semibold text-white mb-4">Settings</h2>

                <div className="space-y-5">
                  {/* Setting 1: Dark Mode (with toggle placeholder) */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                    <div>
                      <p className="text-white font-medium">Dark Mode</p>
                      <p className="text-xs text-slate-400">Toggle between light and dark theme</p>
                    </div>
                    {/* Custom Toggle Switch (Pure CSS) */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4c51bf]"></div>
                    </label>
                  </div>

                  {/* Setting 2: Notifications */}
                  <div className="pb-2 border-b border-slate-700/50">
                    <p className="text-white font-medium">Notifications</p>
                    <p className="text-xs text-slate-400">Manage your notification preferences</p>
                  </div>

                  {/* Setting 3: Language (with selection placeholder) */}
                  <div className="flex justify-between items-center pb-2 border-b border-slate-700/50">
                    <div>
                      <p className="text-white font-medium">Language</p>
                      <p className="text-xs text-slate-400">Choose your preferred language</p>
                    </div>
                    <select className="bg-[#2b2e3a] text-white border border-slate-700 rounded-lg p-1 text-sm appearance-none">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>

                  {/* Setting 4: Privacy */}
                  <div className="flex justify-between items-center pb-4">
                    <div>
                      <p className="text-white font-medium">Privacy</p>
                      <p className="text-xs text-slate-400">Manage your privacy settings</p>
                    </div>
                    <button className="text-[#4c51bf] hover:text-indigo-400 font-medium text-sm transition duration-200">Configure</button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between space-x-4 pt-4 border-t border-slate-700/50">
                    <button className="w-1/2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition duration-200">
                      Log Out
                    </button>
                    <button className="w-1/2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition duration-200">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Component for the flip cards to keep the main component cleaner
const FlipCard = ({ id, data, title, chartId }) => (
  <div id={id} className="flip-card quick-overview-card-wrapper transition-all duration-300 hover:border-[#4c51bf]/80">
    <div className="flip-card-inner">
      {/* Front Face (Chart) */}
      <div className="flip-card-front">
        <h3 className="font-medium mb-4 text-slate-300">{title}</h3>
        <div className="chart-container">
          <canvas id={chartId}></canvas>
        </div>
      </div>
      {/* Back Face (Value) */}
      <div className="flip-card-back">
        <p className={`text-7xl font-extrabold`} style={{ color: data.color }}>{data.backText}</p>
        <p className="text-slate-400 mt-4 text-lg">{data.backLabel}</p>
      </div>
    </div>
  </div>
);

// Component for the individual goal tracker items
const GoalItem = ({ category, title, dueDate, progress, color }) => (
  <div className="bg-[#2b2e3a] rounded-xl shadow-md p-4 flex items-center justify-between border border-slate-700/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#4c51bf]/80">
    <div className="w-full mr-4">
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full`} style={{ backgroundColor: `${color}30`, color: color }}>
        {category}
      </span>
      <p className="text-white font-medium my-1">{title}</p>
      <p className="text-xs text-slate-400 mb-2">Due: {dueDate}</p>
      {/* Progress Bar */}
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-slate-700">
          <div style={{ width: `${progress}%`, backgroundColor: color }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full"></div>
        </div>
        <span className="text-xs font-semibold absolute top-0 right-0">{progress}%</span>
      </div>
    </div>
    <button className="text-slate-500 hover:text-white transition duration-200">
      {/* SVG for vertical dots menu */}
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
    </button>
  </div>
);


export default App;

