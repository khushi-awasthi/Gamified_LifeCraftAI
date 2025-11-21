import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
// Note: Removed './HomePage.css' as you embedded CSS via <style> tag.

// --- Start: Component Data (UNCHANGED) ---
const featureData = [
    { icon: 'fas fa-briefcase', title: '🎯 Career Path', desc: 'Build your roadmap, resume, and reach your dream job with AI-powered guidance and industry insights.', link: 'career_page_hero.html' },
    { icon: 'fas fa-seedling', title: '🌱 Eco Goals', desc: 'Track and gamify your sustainable habits for the planet with carbon footprint tracking and eco-challenges.', link: 'eco_updated.html' },
    { icon: 'fas fa-book-open', title: '📚 Study Goals', desc: 'Stay consistent with personalized learning paths, focus modes, and progress analytics.', link: 'career_guidance.html' },
    { icon: 'fas fa-spa', title: '🧘 Calm Space', desc: 'Relax with ambient music, journaling, mood tracking, and guided reflection exercises.', link: 'calm_space_updated.html' },
];

const testimonialData = [
    { name: 'Aryan R.', title: 'Software Engineer', initials: 'AR', content: "LifeCraft helped me land my dream job at Google! The career roadmap and resume builder were game-changers." },
    { name: 'Sneha P.', title: 'Environmental Scientist', initials: 'SP', content: "The eco goals feature helped me reduce my carbon footprint by 40% in just 3 months. Love the gamification!" },
    { name: 'Vikram K.', title: 'Medical Student', initials: 'VK', content: "As a student, the study goals feature keeps me focused and motivated. The focus timer is my secret weapon!" },
];

const statData = [
    { value: '50K+', label: 'Active Users' },
    { value: '120+', label: 'Countries' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '2M+', label: 'Goals Set' },
];

// --- End: Component Data ---


// --- Start: Reusable Sub-Components ---

const AboutModal = ({ isOpen, onClose }) => {
    // Escape key handling
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    const benefitData = [
        { icon: 'fas fa-brain', title: 'AI-Powered Clarity', desc: 'Get smart suggestions tailored to your goals and mood.' },
        { icon: 'fas fa-heart', title: 'Emotion-Aware Tracking', desc: 'Your progress adapts to how you feel—because life isn’t linear.' },
        { icon: 'fas fa-globe', title: 'Planet-Positive', desc: 'Every eco-goal you complete plants real trees 🌱' },
    ];

    

    return (
        <div id="about-modal" className={`about-modal ${isOpen ? 'active' : ''}`} onClick={onClose}>
            <div className="about-content" onClick={e => e.stopPropagation()}>
                <button className="close-btn" aria-label="Close about section" onClick={onClose}>&times;</button>
                <div className="about-icon"><i className="fas fa-sparkles"></i></div>
                <h2>Why LifeCraft?</h2>
                <p className="about-text">
                    LifeCraft isn’t just another app—it’s your <span className="highlight">personal growth companion</span>.
                    Born from the idea that every life is a masterpiece in progress, we blend mindfulness,
                    goal science, and playful design to help you <span className="highlight">build the future you deserve</span>.
                </p>
                <div className="benefits-grid">
                    {benefitData.map((benefit, index) => (
                        <div key={index} className="benefit-card">
                            <i className={benefit.icon}></i>
                            <h3>{benefit.title}</h3>
                            <p>{benefit.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="footer-note">Crafted with care in 2025 • For dreamers, doers, and healers.</div>
            </div>
        </div>
    );
};

const AssistantWidget = () => {
    // Note: The logic below has been corrected to make a real fetch call to your Express backend.
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ text: 'Hello! How can I assist you today?', sender: 'bot' }]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // State to handle loading/disabling input

    const togglePanel = () => setIsOpen(!isOpen);
    const closePanel = () => setIsOpen(false);

    const handleSend = async () => {
        const text = inputMessage.trim();
        if (!text || isLoading) return;

        // 1. Add user message
        setMessages(prev => [...prev, { text, sender: 'user' }]);
        setInputMessage('');
        setIsLoading(true);

        // 2. Add temporary 'Thinking' message
        const loadingMsg = { text: 'Thinking...', sender: 'bot', loading: true, id: Date.now() };
        setMessages(prev => [...prev, loadingMsg]);

        try {
            // 3. Make the actual API call to your backend
            // FIX: Ensure 'question' key is used for your server.js endpoint
            // const response = await fetch('http://localhost:3000/ask', {
            const response = await fetch('http://localhost:5000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: text }), // FIX APPLIED HERE
            });

            if (!response.ok) {
                // Read server error for better feedback
                const errorData = await response.json().catch(() => ({ answer: `Server error (${response.status})` }));
                throw new Error(errorData.answer || `Server error: ${response.status}`);
            }

            const data = await response.json();
            
            // Your backend returns { answer: "..." }
            const botResponse = data.answer || "Sorry, I couldn't get a clear answer from the server.";
            
            // 4. Update messages with the real response
            setMessages(prev => {
                const newMessages = prev.filter(msg => msg.id !== loadingMsg.id); // Remove the loading message
                return [...newMessages, { text: botResponse, sender: 'bot' }];
            });

        } catch (error) {
            console.error('Error fetching bot response:', error.message);
            // 5. Handle error in UI
            setMessages(prev => {
                const newMessages = prev.filter(msg => msg.id !== loadingMsg.id);
                const userMessage = error.message.includes("Server error") 
                    ? `Server issue: ${error.message}` 
                    : "Oops! Could not connect to the assistant server. Is the Express server running?";
                return [...newMessages, { text: userMessage, sender: 'bot' }];
            });
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };
    
    // Auto-scroll to bottom of messages container
    useEffect(() => {
        const container = document.getElementById('assistant-messages');
        if (container) {
            // Added slight delay for DOM update
            setTimeout(() => {
                container.scrollTop = container.scrollHeight;
            }, 100);
        }
    }, [messages]);


    return (
        <div id="assistant-widget">
            <button id="assistant-toggle" aria-label="Open assistant" onClick={togglePanel}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H15V9H21ZM19 23H5V11H19V23ZM7 13V21H17V13H7Z" fill="currentColor"/>
                </svg>
            </button>
            
            <div id="assistant-panel" className={isOpen ? 'assistant-panel-active' : ''} role="dialog" aria-modal="true" aria-labelledby="assistant-title">
                <div id="assistant-header">
                    <div id="assistant-title">Assistant</div>
                    <button id="assistant-close" aria-label="Close assistant" onClick={closePanel}>&times;</button>
                </div>
                <div id="assistant-messages">
                    {messages.map((msg, index) => (
                        <div key={msg.id || index} className={`message ${msg.sender}-message ${msg.loading ? 'loading' : ''}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div id="assistant-input-area">
                    <input 
                        type="text" 
                        id="assistant-input" 
                        placeholder={isLoading ? "Waiting for response..." : "Type your message..."}
                        aria-label="Type your message"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <div className="input-actions">
                        <button id="voice-btn" className="action-btn" aria-label="Voice input" title="Voice input" disabled>
                            <span>🎤</span>
                        </button>
                        <button 
                            id="send-btn" 
                            className="action-btn" 
                            aria-label="Send message" 
                            title="Send" 
                            onClick={handleSend} 
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- End: Reusable Sub-Components ---



const Header = ({ onOpenAbout, onScrollTo }) => {
    const navigate = useNavigate(); // ✅ add this hook

    const handleNavLinkClick = (e, href) => {
        e.preventDefault();
        if (href === 'about') {
            onOpenAbout();
        } else {
            onScrollTo(href);
        }
    };

    return (
        <header>
            <div className="container header-container">
                <div className="logo">
                    <i className="fas fa-cube logo-icon"></i>
                    <div className="logo-text">LifeCraft</div>
                </div>

                <nav className="centered-nav">
                    <a href="#features" onClick={(e) => handleNavLinkClick(e, 'features')}>Features</a>
                    <a href="#testimonials" onClick={(e) => handleNavLinkClick(e, 'testimonials')}>Testimonials</a>
                    <a href="#about" onClick={(e) => handleNavLinkClick(e, 'about')}>About</a>
                    <a href="#contact" onClick={(e) => handleNavLinkClick(e, 'contact')}>Contact</a>
                </nav>

                {/* ✅ Replaced old link with button navigation */}
                <button
                    className="profile-btn"
                    aria-label="Your profile"
                    onClick={() => navigate('/profile')}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "white",
                        fontSize: "1.5rem",
                    }}
                >
                    <i className="fas fa-user"></i>
                </button>
            </div>
        </header>
    );
};


const Hero = () => (
    <section className="hero">
        <div className="container">
            <h1>Shape Your Future with LifeCraft</h1>
            <p className="subtitle">Transform your life through personalized growth paths, habit tracking, and mindful reflection</p>
            <div className="tagline">Gamify your journey • Build your future • Grow every day</div>
            <div className="hero-cta">
                <a href="career_page_hero.html" className="cta-button">Get Started</a>
            </div>
        </div>
    </section>
);

const Features = () => (
    <section className="features" id="features">
        <div className="container">
            <h2 className="section-title">Your Growth Ecosystem</h2>
            <div className="features-grid">
                {featureData.map((feature, index) => (
                    <a key={index} href={feature.link} className="feature-card">
                        <div className="feature-icon"><i className={feature.icon}></i></div>
                        <h3>{feature.title}</h3>
                        <p>{feature.desc}</p>
                    </a>
                ))}
            </div>
        </div>
    </section>
);

const StatsSection = () => (
    <section className="stats-section">
        <div className="container">
            <h2 className="section-title">Our Impact</h2>
            <div className="stats-grid">
                {statData.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const Testimonials = () => (
    <section className="testimonials" id="testimonials">
        <div className="container">
            <h2 className="section-title">User Success Stories</h2>
            <div className="testimonial-grid">
                {testimonialData.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                        <p className="testimonial-content">"{testimonial.content}"</p>
                        <div className="testimonial-author">
                            <div className="author-avatar">{testimonial.initials}</div>
                            <div className="author-info">
                                <h4>{testimonial.name}</h4>
                                <p>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CtaSection = () => (
    <section className="cta-section">
        <div className="container">
            <div className="cta-content">
                <h2>Ready to Transform Your Life?</h2>
                <p>Join thousands of users who are already shaping their future with LifeCraft. Start your journey today!</p>
                <a href="career_page_hero.html" className="cta-button">Get Started</a>
            </div>
        </div>
    </section>
);

const Footer = ({ onScrollTo }) => (
    <footer id="contact">
        <div className="container">
            <div className="footer-content">
                <div className="footer-column">
                    <h3>LifeCraft</h3>
                    <p style={{ color: '#aaa', lineHeight: 1.7, marginTop: '1rem' }}>
                        Empowering individuals to achieve their goals through personalized growth paths and mindful reflection.
                    </p>
                </div>
                <div className="footer-column">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="career_page_hero.html"><i className="fas fa-chevron-right"></i> Career Path</a></li>
                        <li><a href="eco_updated.html"><i className="fas fa-chevron-right"></i> Eco Goals</a></li>
                        <li><a href="career_guidance.html"><i className="fas fa-chevron-right"></i> Study Goals</a></li>
                        <li><a href="calm_space_updated.html"><i className="fas fa-chevron-right"></i> Calm Space</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Resources</h3>
                    <ul className="footer-links">
                        <li><a href="#"><i className="fas fa-chevron-right"></i> Blog</a></li>
                        <li><a href="#"><i className="fas fa-chevron-right"></i> Tutorials</a></li>
                        <li><a href="#"><i className="fas fa-chevron-right"></i> Community</a></li>
                        <li><a href="#"><i className="fas fa-chevron-right"></i> Support</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>Connect</h3>
                    <ul className="footer-links">
                        <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
                        <li><a href="#"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
                        <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
                        <li><a href="#"><i className="fas fa-envelope"></i> Email Us</a></li>
                    </ul>
                </div>
            </div>
            <div className="copyright">
                <p>© 2025 LifeCraft. Made with ❤ for self-growth. All rights reserved.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#777' }}>
                    Upcoming: WASM tools, AI Assistants, Flowcharts, Progress Analytics, Mobile App
                </p>
            </div>
        </div>
    </footer>
);

// --- End: Main Layout Components ---


// --- Start: Main App Component (LifeCraftApp) ---

const LifeCraftApp = () => {
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

    // Effect for handling the body overflow when the modal is open
    useEffect(() => {
        document.body.style.overflow = isAboutModalOpen ? 'hidden' : '';
        // Cleanup function for when the component unmounts
        return () => { document.body.style.overflow = ''; };
    }, [isAboutModalOpen]);
    
    // Function to handle smooth scrolling
    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        // Fragment is used here instead of a body tag
        <>
            <style dangerouslySetInnerHTML={{ __html: `
                /* Past your entire CSS block here for a single-file solution */
                /* === ORIGINAL LIFECRAFT STYLES (UNCHANGED) === */
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: 'Poppins', sans-serif;
                }

                :root {
                    --primary: #6c63ff;
                    --primary-light: #8a85ff;
                    --secondary: #4cc9f0;
                    --accent: #f72585;
                    --dark: #121212;
                    --darker: #0a0a0a;
                    --light: #f8f9fa;
                    --card-bg: rgba(30, 30, 46, 0.7);
                    --card-hover: rgba(40, 40, 60, 0.85);
                    --transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                body {
                    background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
                    color: white;
                    line-height: 1.6;
                    overflow-x: hidden;
                }

                /* Full width container */
                .container {
                    width: 100%;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 2rem;
                }

                /* === IMPROVED HEADER LAYOUT === */
                header {
                    padding: 1.5rem 0;
                    position: relative;
                }

                .header-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: relative;
                    gap: 1rem;
                }

                /* Logo stays on the left */
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    z-index: 2;
                }

                .logo-icon {
                    font-size: 2rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .logo-text {
                    font-size: 1.8rem;
                    font-weight: 700;
                    background: linear-gradient(90deg, #bb86fc, #03dac6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Centered navigation */
                .centered-nav {
                    display: flex;
                    justify-content: center;
                    gap: 1.8rem;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1;
                }

                .centered-nav a {
                    color: #e0e0e0;
                    text-decoration: none;
                    font-weight: 500;
                    transition: var(--transition);
                    font-size: 1rem;
                    position: relative;
                }

                .centered-nav a:hover {
                    color: var(--primary);
                }

                .centered-nav a::after {
                    content: '';
                    position: absolute;
                    bottom: -3px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--primary);
                    transition: width 0.3s ease;
                }

                .centered-nav a:hover::after {
                    width: 100%;
                }

                /* Profile button - fixed in top-right corner */
                .profile-btn {
                    position: absolute;
                    top: 16px;
                    right: 16px;
                    width: 42px;
                    height: 42px;
                    border-radius: 50%;
                    background: linear-gradient(145deg, #6a5acd, #7b68ee);
                    box-shadow: 0 0 15px rgba(123, 104, 238, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    text-decoration: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(8px);
                    z-index: 10;
                }

                .profile-btn:hover {
                    background: rgba(237, 240, 234, 0.93);
                    transform: translateY(-2px);
                    border-color: rgba(243, 239, 236, 1);
                    box-shadow: 0 4px 12px rgba(245, 239, 236, 0.97);
                }

                .profile-btn i {
                    font-size: 18px;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Responsive: Stack on small screens */
                @media (max-width: 768px) {
                    .header-container {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1.2rem;
                    }

                    .centered-nav {
                        position: static;
                        transform: none;
                        justify-content: flex-start;
                        width: 100%;
                        flex-wrap: wrap;
                        gap: 1.2rem;
                    }

                    .profile-btn {
                        position: static;
                        margin-left: auto;
                        top: auto;
                        right: auto;
                    }
                }

                /* Hero Section */
                .hero {
                    padding: 5rem 0;
                    text-align: center;
                }

                .hero h1 {
                    font-size: 4.5rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(90deg, #bb86fc, #03dac6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -1px;
                    line-height: 1.2;
                }

                .hero p.subtitle {
                    font-size: 1.4rem;
                    margin-bottom: 2rem;
                    color: #e0e0e0;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                    line-height: 1.6;
                }

                .tagline {
                    display: inline-block;
                    background: rgba(108, 99, 255, 0.2);
                    padding: 0.4rem 1.2rem;
                    border-radius: 30px;
                    font-size: 0.95rem;
                    margin-top: 1.5rem;
                    border: 1px solid rgba(108, 99, 255, 0.3);
                    color: #e0e0e0;
                }

                .hero-cta {
                    margin-top: 2rem;
                }

                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    color: white;
                    padding: 1rem 2.5rem;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1.1rem;
                    text-decoration: none;
                    transition: var(--transition);
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 5px 15px rgba(108, 99, 255, 0.4);
                }

                .cta-button:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 20px rgba(108, 99, 255, 0.6);
                }

                /* Features Section */
                .features {
                    padding: 5rem 0;
                }

                .section-title {
                    text-align: center;
                    font-size: 2.5rem;
                    margin-bottom: 3rem;
                    color: white;
                    position: relative;
                }

                .section-title::after {
                    content: "";
                    position: absolute;
                    bottom: -15px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 80px;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary), var(--secondary));
                    border-radius: 2px;
                }

                .features-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2.5rem;
                }

                .feature-card {
                    background: var(--card-bg);
                    border-radius: 20px;
                    padding: 2.5rem 2rem;
                    backdrop-filter: blur(12px);
                    cursor: pointer;
                    transition: var(--transition);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                    text-align: center;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: linear-gradient(90deg, var(--primary), var(--secondary));
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.5s ease;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    background: var(--card-hover);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
                }

                .feature-card:hover::before {
                    transform: scaleX(1);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 1.5rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .feature-card h3 {
                    font-size: 1.6rem;
                    margin-bottom: 1.2rem;
                    color: white;
                }

                .feature-card p {
                    font-size: 1rem;
                    color: #ccc;
                    line-height: 1.6;
                    flex-grow: 1;
                }

                /* Stats Section */
                .stats-section {
                    background: rgba(20, 20, 35, 0.6);
                    border-radius: 20px;
                    padding: 3.5rem 2rem;
                    margin: 5rem 0;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 2.5rem;
                    margin-top: 2rem;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 2.8rem;
                    font-weight: 700;
                    background: linear-gradient(90deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 0.5rem;
                }

                .stat-label {
                    font-size: 1.1rem;
                    color: #ccc;
                }

                /* Testimonials */
                .testimonials {
                    padding: 5rem 0;
                }

                .testimonial-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2.5rem;
                    margin-top: 2.5rem;
                }

                .testimonial-card {
                    background: rgba(30, 30, 46, 0.6);
                    border-radius: 18px;
                    padding: 2rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    height: 100%;
                }

                .testimonial-content {
                    font-style: italic;
                    color: #e0e0e0;
                    margin-bottom: 1.5rem;
                    line-height: 1.7;
                    font-size: 1.1rem;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                }

                .author-avatar {
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: white;
                    font-size: 1.2rem;
                }

                .author-info h4 {
                    color: white;
                    margin-bottom: 0.2rem;
                    font-size: 1.2rem;
                }

                .author-info p {
                    color: #aaa;
                    font-size: 0.95rem;
                }

                /* CTA Section */
                .cta-section {
                    background: linear-gradient(135deg, rgba(108, 99, 255, 0.2), rgba(76, 201, 240, 0.2));
                    border-radius: 20px;
                    padding: 4rem 2rem;
                    margin: 5rem 0;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    text-align: center;
                }

                .cta-content h2 {
                    font-size: 2.8rem;
                    margin-bottom: 1.5rem;
                    color: white;
                }

                .cta-content p {
                    font-size: 1.3rem;
                    color: #e0e0e0;
                    margin-bottom: 2.5rem;
                    max-width: 700px;
                    margin-left: auto;
                    margin-right: auto;
                    line-height: 1.6;
                }

                /* Footer */
                footer {
                    background: rgba(10, 10, 20, 0.8);
                    padding: 3rem 0 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                }

                .footer-content {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2.5rem;
                    margin-bottom: 2.5rem;
                }

                .footer-column h3 {
                    color: white;
                    margin-bottom: 1.5rem;
                    font-size: 1.4rem;
                }

                .footer-links {
                    list-style: none;
                }

                .footer-links li {
                    margin-bottom: 0.8rem;
                }

                .footer-links a {
                    color: #aaa;
                    text-decoration: none;
                    transition: var(--transition);
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                }

                .footer-links a:hover {
                    color: var(--primary);
                }

                .footer-links i {
                    width: 20px;
                    color: var(--primary);
                }

                .copyright {
                    text-align: center;
                    color: #888;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    font-size: 0.95rem;
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .hero h1 { font-size: 3.8rem; }
                }

                @media (max-width: 768px) {
                    .hero { padding: 3rem 0; }
                    .hero h1 { font-size: 3rem; }
                    .hero p.subtitle { font-size: 1.2rem; }
                    .features, .testimonials { padding: 3.5rem 0; }
                    .section-title { font-size: 2.2rem; }
                    .cta-content h2 { font-size: 2.2rem; }
                    .cta-content p { font-size: 1.1rem; }
                }

                @media (max-width: 480px) {
                    .hero h1 { font-size: 2.4rem; }
                    .hero p.subtitle { font-size: 1rem; }
                    .feature-card { padding: 2rem 1.5rem; }
                    .feature-card h3 { font-size: 1.4rem; }
                    .stat-value { font-size: 2.2rem; }
                    .cta-button { padding: 0.9rem 2rem; font-size: 1rem; }
                    .stats-grid { grid-template-columns: 1fr; }
                    .tagline { font-size: 0.9rem; padding: 0.3rem 1rem; }
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Note: React handles animations differently, using CSS classes for demonstration */
                .feature-card, .testimonial-card {
                    /* Removed inline animation-delay for simple conversion */
                    opacity: 1; /* Set to 1 in React or handle visibility on mount/scroll */
                }
                
                /* ==========================================
                    AI ASSISTANT WIDGET STYLES (EMBEDDED)
                    ==========================================
                */
                #assistant-widget {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                #assistant-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: #6366f1;
                    color: white;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                    outline: none;
                }

                #assistant-toggle:hover {
                    background: #4f46e5;
                    transform: scale(1.05);
                }

                #assistant-toggle:focus {
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.4);
                }

                #assistant-panel {
                    position: absolute;
                    bottom: 76px;
                    right: 0;
                    width: 360px;
                    max-height: 500px;
                    background: #1e1e2e;
                    border-radius: 16px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
                    display: none; /* Controlled by React state/class */
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid #333;
                    opacity: 0;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    transform: translateY(10px);
                }
                
                .assistant-panel-active {
                    display: flex !important;
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }


                #assistant-header {
                    padding: 16px;
                    background: #25253a;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }

                #assistant-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #e0e0ff;
                }

                #assistant-close {
                    background: transparent;
                    border: none;
                    color: #a0a0c0;
                    font-size: 20px;
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                #assistant-close:hover {
                    background: #3a3a5a;
                    color: #fff;
                }

                #assistant-messages {
                    flex: 1;
                    padding: 16px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 14px;
                    line-height: 1.4;
                    font-size: 14px;
                    word-break: break-word;
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .user-message {
                    background: #4f46e5;
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 4px;
                }

                .bot-message {
                    background: #2d2d44;
                    color: #e0e0ff;
                    align-self: flex-start;
                    border-bottom-left-radius: 4px;
                }

                .bot-message.loading {
                    position: relative;
                }
                
                .bot-message.loading::after {
                    content: "";
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border: 2px solid transparent;
                    border-top-color: #a0a0ff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-left: 8px;
                    vertical-align: middle;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 8px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                
                .bot-message.loading {
                    padding-right: 32px; /* Make space for spinner */
                }

                #assistant-input-area {
                    padding: 16px;
                    background: #25253a;
                    display: flex;
                    gap: 10px;
                    border-top: 1px solid #333;
                }

                #assistant-input {
                    flex: 1;
                    padding: 12px 16px;
                    border-radius: 24px;
                    border: 1px solid #444;
                    background: #1a1a2a;
                    color: #fff;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                }

                #assistant-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                }

                #assistant-input::placeholder {
                    color: #777;
                }

                .input-actions {
                    display: flex;
                    gap: 8px;
                }

                .action-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: none;
                    background: #3a3a5a;
                    color: #a0a0c0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .action-btn:hover {
                    background: #4a4a6a;
                    color: #fff;
                }

                .action-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                #send-btn {
                    background: #6366f1;
                    color: white;
                }

                #send-btn:hover:not(:disabled) {
                    background: #4f46e5;
                }

                @media (max-width: 480px) {
                    #assistant-panel {
                        width: calc(100% - 40px);
                        right: 20px;
                        bottom: 80px;
                    }
                }

                /* === ABOUT MODAL STYLES === */
                .about-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(10, 8, 25, 0.85);
                    backdrop-filter: blur(6px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: opacity 0.4s ease, visibility 0.4s ease;
                }

                .about-modal.active {
                    opacity: 1;
                    visibility: visible;
                }

                .about-content {
                    background: rgba(25, 25, 45, 0.75);
                    border: 1px solid rgba(108, 99, 255, 0.3);
                    border-radius: 24px;
                    padding: 2.5rem;
                    max-width: 700px;
                    width: 90%;
                    position: relative;
                    backdrop-filter: blur(16px);
                    transform: translateY(20px);
                    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
                }

                .about-modal.active .about-content {
                    transform: translateY(0);
                }

                .close-btn {
                    position: absolute;
                    top: 1.2rem;
                    right: 1.2rem;
                    background: rgba(255, 255, 255, 0.1);
                    color: #e0e0e0;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                .close-btn:hover {
                    background: rgba(108, 99, 255, 0.3);
                    color: white;
                    transform: rotate(90deg);
                }

                .about-icon {
                    text-align: center;
                    margin-bottom: 1.2rem;
                }

                .about-icon i {
                    font-size: 3rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .about-content h2 {
                    text-align: center;
                    font-size: 2.2rem;
                    margin-bottom: 1.5rem;
                    color: white;
                    background: linear-gradient(90deg, #bb86fc, #03dac6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .about-text {
                    color: #e0e0e0;
                    font-size: 1.1rem;
                    line-height: 1.7;
                    margin-bottom: 2rem;
                    text-align: center;
                }

                .highlight {
                    background: linear-gradient(90deg, #bb86fc, #03dac6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    font-weight: 600;
                }

                .benefits-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 1.5rem;
                    margin: 2rem 0;
                }

                .benefit-card {
                    background: rgba(40, 40, 60, 0.5);
                    border-radius: 16px;
                    padding: 1.4rem;
                    text-align: center;
                    transition: transform 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .benefit-card:hover {
                    transform: translateY(-5px);
                    background: rgba(50, 50, 75, 0.6);
                }

                .benefit-card i {
                    font-size: 1.8rem;
                    margin-bottom: 1rem;
                    background: linear-gradient(135deg, var(--primary), var(--secondary));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .benefit-card h3 {
                    color: white;
                    font-size: 1.2rem;
                    margin-bottom: 0.6rem;
                }

                .benefit-card p {
                    color: #ccc;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .footer-note {
                    text-align: center;
                    color: #888;
                    font-size: 0.9rem;
                    margin-top: 1.5rem;
                    padding-top: 1.2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }

                /* Responsive */
                @media (max-width: 600px) {
                    .about-content {
                        padding: 1.8rem;
                    }
                    
                    .about-content h2 {
                        font-size: 1.8rem;
                    }
                    
                    .about-text {
                        font-size: 1rem;
                    }
                    
                    .benefits-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}} />
            
            <Header onOpenAbout={() => setIsAboutModalOpen(true)} onScrollTo={handleScrollTo} />

            <main>
                <Hero />
                <Features />
                <StatsSection />
                <Testimonials />
                <CtaSection />
            </main>

            <Footer onScrollTo={handleScrollTo} />
            
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
            
            <AssistantWidget />
        </>
    );
};

export default LifeCraftApp;