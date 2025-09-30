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
    <section className="section testimonials">
      <div className="container">
        <div className="section-header">
          <div>
            <h2 className="section-title">People Love Living with Realton</h2>
            <p className="section-subtitle">Aliquam lacinia diam quis lacus euismod</p>
          </div>
        </div>
        <div className="grid grid-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <h3>Great Work</h3>
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <strong>{testimonial.author}</strong>
                  <span>{testimonial.company}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;