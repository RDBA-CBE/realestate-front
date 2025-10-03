// components/HeroSection.js
import React, { useState } from 'react';

const HeroSection = () => {
  const [activeTab, setActiveTab] = useState('buy');

  const tabs = [
    { id: 'buy', label: 'Buy' },
    { id: 'rent', label: 'Rent' },
    { id: 'sold', label: 'Sold' }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            THE BEST WAY TO.<br />
            <span className="text-red-600">Find Your Dream Home</span>
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            We've more than 745,000 apartments, place & plot.
          </p>

          {/* Search Tabs */}
          <div className="flex justify-center space-x-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <input 
                type="text" 
                placeholder="Search for properties..." 
                className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-500"
              />
              <select className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-500">
                <option>Property Type</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Villa</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-red-500">
                <option>Location</option>
                <option>New York</option>
                <option>Los Angeles</option>
                <option>Chicago</option>
              </select>
              <button className="bg-red-600 text-white py-3 px-6 rounded font-medium hover:bg-red-700 transition-colors">
                Search
              </button>
            </div>
            <div className="text-center">
              <a href="#" className="text-red-600 text-sm font-medium hover:text-red-800">
                Advanced
              </a>
            </div>
          </div>

          {/* Display active tab for demonstration */}
          <div className="mt-8 text-sm text-gray-600">
            Currently viewing: <span className="font-semibold capitalize">{activeTab}</span> properties
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;