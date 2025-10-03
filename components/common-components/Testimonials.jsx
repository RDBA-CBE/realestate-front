// components/Testimonials.js
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      text: 'Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn\'t on our original designs.',
      author: 'MP Leslie Alexander',
      company: 'Nintendo'
    },
    {
      text: 'Amazing design, easy to customize and a design quality superlative account on its cloud platform for the optimized performance. And we didn\'t on our original designs.',
      author: 'Floyd Miles',
      company: 'Bank of America'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">People Love Living with Realton</h2>
          <p className="text-gray-600">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-red-600 font-semibold mb-4">Great Work</h3>
              <p className="text-gray-600 mb-6">{testimonial.text}</p>
              <div>
                <strong className="text-gray-900">{testimonial.author}</strong>
                <p className="text-gray-600 text-sm">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;