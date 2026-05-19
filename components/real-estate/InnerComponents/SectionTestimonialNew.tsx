"use client";
import React from "react";

const testimonials = [
  {
    text: "Every property radiates top-notch quality and absolute comfort here. The team went above and beyond to make sure everything was perfect.",
    author: "John Carter",
    role: "Home Buyer, Los Angeles",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    text: "Amazing service and attention to detail. I felt supported during the entire process and couldn't be happier with my new home.",
    author: "Lisa Monroe",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    text: "Fast responses, honest advice and great listings — highly recommended for anyone searching for a new place.",
    author: "Samuel Green",
    role: "Property Investor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  },
  {
    text: "The best real estate experience I've ever had. Professional, transparent and genuinely caring about finding the right home.",
    author: "Priya Sharma",
    role: "Verified Buyer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

const Stars = ({ count = 5, size = "w-4 h-4" }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} className={`${size} text-yellow-400 fill-yellow-400`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Avatar = ({ name, image }: { name: string; image?: string }) => (
  <div className="flex items-center gap-3">
    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#9b0f09] flex items-center justify-center shrink-0">
      {image ? (
        <img src={image} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-bold text-sm">{name.charAt(0)}</span>
      )}
      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
    </div>
    <div>
      <p className="text-sm font-semibold text-gray-900 leading-tight">{name}</p>
      <p className="text-xs text-gray-400">Verified buyer</p>
    </div>
  </div>
);

export default function SectionTestimonialNew() {
  return (
    <section className="section-pad bg-[#f5f5f5]">
      <div className="section-wid pb-5">

        {/* Header */}
        <div className="text-center mb-12">
          {/* <p className="text-[#9b0f09] text-sm font-semibold uppercase tracking-widest mb-2">Testimonials</p> */}
          <h2 className="section-ti">What our customers say about us</h2>
          <p className="section-cap mt-2 max-w-xl mx-auto">
            Real stories from real people who found their dream property with us.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">

          {/* Card 1 — Dark image card (tall, col 1 row 1+2) */}
          <div className="relative rounded-2xl overflow-hidden row-span-2 min-h-[380px]">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=700&fit=crop"
              alt="property"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="relative z-10 flex flex-col justify-end h-full p-6">
              <span className="text-white/60 text-3xl font-serif leading-none mb-3">"</span>
              <p className="text-white text-[15px] leading-relaxed font-medium">
                {testimonials[0].text}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src={testimonials[0].image}
                  alt={testimonials[0].author}
                  className="w-9 h-9 rounded-full object-cover border-2 border-white/40"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{testimonials[0].author}</p>
                  <p className="text-white/50 text-xs">{testimonials[0].role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Property image with label (col 2, row 1) */}
          <div className="relative rounded-2xl overflow-hidden min-h-[220px]">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop"
              alt="property"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end h-full p-5">
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Customer Story</p>
              <h4 className="text-white text-xl font-bold">{testimonials[1].author}</h4>
            </div>
          </div>

          {/* Card 3 — Rating highlight card (col 3, row 1) */}
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm min-h-[220px]">
            <p className="text-5xl font-bold text-gray-900 leading-none">4.9</p>
            <p className="text-sm text-gray-400 mt-1 mb-3">3,126 Reviews</p>
            <Stars size="w-6 h-6" />
            <p className="section-in-ti mt-4 leading-snug">
              Trusted by thousands <br /> of home buyers
            </p>
          </div>

          {/* Card 4 — Quote card (col 4, row 1) */}
          <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[220px]">
            <div>
              <Stars />
              <p className="text-gray-700 text-sm leading-relaxed mt-3">
                "{testimonials[2].text}"
              </p>
            </div>
            <div className="mt-5">
              <Avatar name={testimonials[2].author} image={testimonials[2].image} />
            </div>
          </div>

          {/* Card 5 — Quote card (col 2, row 2) */}
          <div className="bg-[#fff] rounded-2xl p-6 flex flex-col justify-between shadow-sm min-h-[180px]">
            <div>
              <span className="text-[#9b0f09] text-3xl font-serif leading-none">"</span>
              <p className="text-gray-700 text-sm leading-relaxed mt-1">
                {testimonials[1].text}
              </p>
            </div>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900">{testimonials[1].author}</p>
              <p className="text-xs text-gray-400">{testimonials[1].role}</p>
            </div>
          </div>

          {/* Card 6 — Person image with quote overlay (col 3+4, row 2) */}
          <div className="relative rounded-2xl overflow-hidden min-h-[180px] lg:col-span-2">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=400&fit=crop&crop=top"
              alt="testimonial"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#9b0f09]/80 via-[#9b0f09]/40 to-transparent" />
            <div className="relative z-10 flex flex-col justify-end h-full p-6 max-w-xs">
              <Stars />
              <p className="text-white text-[15px] font-semibold leading-snug mt-3">
                "{testimonials[3].text}"
              </p>
              <div className="mt-4">
                <p className="text-white text-sm font-bold">{testimonials[3].author}</p>
                <p className="text-white/60 text-xs">{testimonials[3].role}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
