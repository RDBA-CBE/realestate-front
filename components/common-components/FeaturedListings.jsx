
import React from 'react';

const FeaturedListings = () => {
  const listings = [
    {
      price: '$82,000 / mo',
      title: 'Equestrian Family Home',
      location: 'New York City, CA, USA',
      details: { beds: '1', baths: '2', sqft: '1200' },
      status: 'For Rent'
    },
    {
      price: '$14,000 / mo',
      title: 'Equestrian Family Home',
      location: 'Texas City, CA, USA',
      details: { beds: '2', baths: '1', sqft: '1300' },
      status: 'For Rent'
    },
    {
      price: '$82,000 / mo',
      title: 'Luxury villa in Rego Park',
      location: 'New York City, CA, USA',
      details: { beds: '4', baths: '3', sqft: '1000' },
      status: 'For Rent'
    }
  ];

  return (
    <section className="section featured-listings">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Discover Our Featured Listings</h2>
            <p className="section-subtitle">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a href="#" className="view-all">See All Properties</a>
        </div>
        <div className="grid grid-3">
          {listings.map((listing, index) => (
            <div key={index} className="listing-card">
              <div className="listing-image">
                {/* Property image would go here */}
                <div className="listing-price">{listing.price}</div>
              </div>
              <div className="listing-content">
                <h3>{listing.title}</h3>
                <p className="location">{listing.location}</p>
                <div className="listing-details">
                  <span>{listing.details.beds} bed</span>
                  <span>{listing.details.baths} bath</span>
                  <span>{listing.details.sqft} sqft</span>
                </div>
                <div className="listing-footer">
                  <span className="status">{listing.status}</span>
                  <button className="btn-outline">Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;