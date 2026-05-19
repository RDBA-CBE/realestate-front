import React from "react";
import { ArrowRight } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="section-pad bg-white">
      <div className="section-wid py-5">
        <div className="grid gap-14 lg:grid-cols-2 items-center">
          <div>
            <span className="text-dred font-semibold uppercase tracking-wider text-sm">Our Legacy</span>
            <h2 className="section-ti mt-2 mb-6">About our real estate firm</h2>
            <p className="section-cap mb-8 max-w-xl">
              With over 15 years of excellence, we have established ourselves as a leader in luxury property management and sales. Our commitment to transparency and client satisfaction remains our top priority.
            </p>
            <a 
              href="/about" 
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition hover:bg-slate-900 group"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                alt="Modern real estate home"
                className="h-[450px] w-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Decorative background blur */}
            <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-dred/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
