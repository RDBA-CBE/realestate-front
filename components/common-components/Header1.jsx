// components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <h2>Homez</h2>
          </div>
          <nav className="nav">
            <ul>
              <li><a href="#">listing</a></li>
              <li><a href="#">Property</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Pages</a></li>
            </ul>
          </nav>
          <div className="header-actions">
            <a href="#" className="login">Login/Register</a>
            <button className="btn">Add Property</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;