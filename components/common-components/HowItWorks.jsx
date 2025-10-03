// components/HowItWorks.js
import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      title: 'Buy a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.'
    },
    {
      title: 'Sell a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.'
    },
    {
      title: 'Rent a property',
      description: 'Nullam sollicitudin blandit eros eu pretium. Nullam maximus ultricies auctor.'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">See How Realton Can Help</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;