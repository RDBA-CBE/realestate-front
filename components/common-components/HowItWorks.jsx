// components/HeroSection.js
import React from 'react';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>THE BEST WAY TO<br /><span>Find Your Dream Home</span></h1>
          <p>We've more than 745,000 apartments, place & plot.</p>
          <div className="search-tabs">
            <button className="tab active">Buy</button>
            <button className="tab">Rent</button>
            <button className="tab">Sold</button>
          </div>
          <div className="search-box">
            <div className="search-fields">
              <input type="text" placeholder="Search for properties..." />
              <select>
                <option>Property Type</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
              </select>
              <select>
                <option>Location</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
              <button className="btn">Search</button>
            </div>
            <a href="#" className="advanced-search">Advanced</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;