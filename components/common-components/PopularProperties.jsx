// components/PopularProperties.js
import React from 'react';

const PopularProperties = () => {
  const properties = [
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Sale'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    },
    {
      title: 'Luxury villa in Rego Park',
      location: 'California City, CA, USA',
      details: { beds: '5', baths: '4' },
      status: 'For Rent'
    }
  ];

  return (
    <section className="section popular-properties">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Discover Popular Properties</h2>
            <p className="section-subtitle">Aliquam lacinia diam quis lacus euismod</p>
          </div>
        </div>
        <div className="grid grid-4">
          {properties.map((property, index) => (
            <div key={index} className="property-card">
              <div className="property-image">
                {/* Property image would go here */}
                <span className="property-status">{property.status}</span>
              </div>
              <div className="property-content">
                <h3>{property.title}</h3>
                <p className="location">{property.location}</p>
                <div className="property-details">
                  <span>{property.details.beds} bed</span>
                  <span>{property.details.baths} bath</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularProperties;