// components/HowItWorks.js
"use client";

import React from 'react';
import { useRouter } from "next/navigation";

const HowItWorks = () => {
  const router = useRouter();

  const OnTypeClick = (type) => {
    const params = new URLSearchParams();

    params.append("type", type);
    router.push(`/property-list?${params.toString()}`);
  };

  const steps = [
    {
      title: 'Buy a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      buttonText: 'Find Sale Property',
      image: '/assets/images/real-estate/property-buy.png',
      type: "Sale",
    },
    // {
    //   title: 'Sell a property',
    //   description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
    //   buttonText: 'Place an ad',
    //   image: '/assets/images/real-estate/property-sell.png'
    // },
    {
      title: 'Lease a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.',
      buttonText: 'Find Lease Property',
      image: '/assets/images/real-estate/property-rent.png',
      type: "Lease",
    }
  ];

  return (
    <div className='py-14 bg-lred'> 
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">See How We Can Help</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              <button
                className="border border-[#9b0f09] text-dred font-semibold hover:text-dred transition-colors px-4 py-2 rounded"
                onClick={() => OnTypeClick(step.type)}
              >
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