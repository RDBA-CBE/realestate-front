// components/HowItWorks.js
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Buy a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      buttonText: 'Find a home',
      image: '/assets/images/real-estate/property-buy.png'
    },
    {
      title: 'Sell a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      buttonText: 'Place an ad',
      image: '/assets/images/real-estate/property-sell.png'
    },
    {
      title: 'Rent a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      buttonText: 'Find a rental',
      image: '/assets/images/real-estate/property-rent.png'
    }
  ];

  return (
    <div className='py-16 bg-white'> 
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">See How Realton Can Help</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-8 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center mx-auto mb-6">
                <img 
                  src={step.image} 
                  alt={step.title}
                  className="w-16 h-16 object-contain" // Increased size for better visibility
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    console.error(`Image failed to load: ${step.image}`);
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 mb-6">{step.description}</p>
              <button className="border border-red-600 text-red-600 font-semibold hover:text-red-600 transition-colors px-4 py-2 rounded">
                {step.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;