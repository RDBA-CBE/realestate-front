// components/FeaturedListings.js
import React from 'react';

const FeaturedListings = () => {
  const listings = [
    {
      price: '$14,000 / mo',
      title: 'Equestrian Family Home',
      location: 'New York City, CA, USA',
      details: { beds: '1', baths: '2', sqft: '1200' },
      status: 'For Rent'
    },
    {
      price: '$82,000 / mo',
      title: 'Luxury villa in Rego Park',
      location: 'Texas City, CA, USA',
      details: { beds: '2', baths: '1', sqft: '1300' },
      status: 'For Rent'
    },
    {
      price: '$82,000 / mo',
      title: 'Equestrian Family Home',
      location: 'New York City, CA, USA',
      details: { beds: '4', baths: '3', sqft: '1000' },
      status: 'For Rent'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Discover Our Featured Listings</h2>
            <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
          </div>
          <a href="#" className="text-red-600 font-medium">See All Properties →</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map((listing, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded text-sm font-semibold text-red-600">
                  {listing.price}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{listing.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{listing.location}</p>
                <div className="flex space-x-4 text-sm text-gray-600 mb-4">
                  <span>{listing.details.beds} bed</span>
                  <span>{listing.details.baths} bath</span>
                  <span>{listing.details.sqft} sqft</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {listing.status}
                  </span>
                  <button className="text-red-600 border border-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">
                    Details
                  </button>
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