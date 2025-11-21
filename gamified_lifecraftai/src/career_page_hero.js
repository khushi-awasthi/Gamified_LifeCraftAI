import React from 'react';

// You can name the component after the file
const CareerPageHero = () => {
  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#1e2029' }}>
      <iframe
        // 🚨 Confirmed: Points to the file in the public folder
        src="/career_page_hero.html" 
        title="Career Page Hero"
        style={{ width: '100%', height: '100vh', border: 'none' }}
      ></iframe>
    </div>
  );
};

// 🚨 Must be exported as default
export default CareerPageHero;