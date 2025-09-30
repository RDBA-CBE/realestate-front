// components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Need help? Talk to our expert.</h3>
            <p>Talk to our experts or Browse through more properties.</p>
            <div className="contact-info">
              <p>+(0) 123 050 945 02</p>
              <p>hi@homez.com</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Apps</h4>
            <div className="app-stores">
              <a href="#">Apple Store</a>
              <a href="#">Google Play</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Follow us on social media</h4>
            <div className="social-links">
              {/* Social media icons would go here */}
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Keep Yourself Up to Date</h4>
            <div className="subscribe">
              <input type="email" placeholder="Your email" />
              <button className="btn">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© ib-themes - All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;