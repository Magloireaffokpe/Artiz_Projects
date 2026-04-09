import React from 'react';

const ServicesGrid = () => (
  <div className="services-grid">
    <div className="service-card">
      <div className="service-icon" style={{ background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)' }}>🔧</div>
      <h3>Plomberie</h3>
      <p>Installation, réparation de canalisations</p>
    </div>
    <div className="service-card">
      <div className="service-icon" style={{ background: 'linear-gradient(45deg, #4ecdc4, #44a08d)' }}>⚡</div>
      <h3>Électricité</h3>
      <p>Installation électrique, dépannage</p>
    </div>
    <div className="service-card">
      <div className="service-icon" style={{ background: 'linear-gradient(45deg, #45b7d1, #96c93d)' }}>🪚</div>
      <h3>Menuiserie</h3>
      <p>Mobilier sur mesure, portes, fenêtres</p>
    </div>
    <div className="service-card">
      <div className="service-icon" style={{ background: 'linear-gradient(45deg, #f093fb, #f5576c)' }}>✂️</div>
      <h3>Couture</h3>
      <p>Confection, retouches, costumes</p>
    </div>
  </div>
);

export default ServicesGrid;