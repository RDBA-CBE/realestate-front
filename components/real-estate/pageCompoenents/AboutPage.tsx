"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Users, Building2, Target, Award, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Years Experience", value: "15+" },
  { label: "Properties Sold", value: "2,500+" },
  { label: "Happy Clients", value: "1,800+" },
  { label: "Expert Agents", value: "50+" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    desc: "To provide the most professional, informative, loyal and dedicated service in the industry through cutting-edge technology and local expertise.",
  },
  {
    icon: Award,
    title: "Our Vision",
    desc: "To be the leading real estate service provider in the region, recognized for excellence, innovation, and an unwavering commitment to our clients.",
  },
  {
    icon: ShieldCheck,
    title: "Core Values",
    desc: "Integrity, transparency, and excellence are at the heart of everything we do. We believe in building lasting relationships based on trust.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <section className="relative h-[450px] flex items-center justify-center overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            alt="Modern Architecture"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Our Story, Your Future</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-light">
              We are more than just a real estate firm. We are your dedicated partners in navigating the complex world of property ownership.
            </p>
          </div>
        </section>

        {/* Company Overview */}
        <section className="section-pad">
          <div className="section-wid">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="relative order-2 lg:order-1">
                <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 h-[500px]">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1073&auto=format&fit=crop"
                    alt="Modern Office"
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-dred/10 rounded-full blur-3xl -z-0" />
                
                <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-2xl shadow-2xl hidden md:block z-20 border border-gray-100">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-dred rounded-full flex items-center justify-center text-white shadow-lg shadow-dred/20">
                      <Award className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900 leading-none">15+</p>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">Years Excellence</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Established 2005</span>
                <h2 className="section-ti mb-8">Redefining the Luxury Real Estate Experience</h2>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                  JustHome was founded with a singular vision: to transform the way people discover and acquire their dream homes. By combining decades of industry expertise with innovative digital tools, we offer a seamless journey for buyers, sellers, and investors alike.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  {[
                    "Local Market Experts",
                    "Global Reach & Network",
                    "Premium Property Selection",
                    "End-to-End Support"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-dred/10 flex items-center justify-center">
                        <CheckCircle2 className="text-dred h-4 w-4" />
                      </div>
                      <span className="text-gray-800 font-medium">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-900 transition-all flex items-center gap-2 group">
                  Explore Our Journey <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Banner */}
        <section className="bg-gray-50 border-y border-gray-100 py-20">
          <div className="section-wid">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center group">
                  <h3 className="text-5xl font-bold text-gray-900 mb-2 transition-colors group-hover:text-dred">{stat.value}</h3>
                  <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="section-pad bg-white">
          <div className="section-wid">
            <div className="text-center mb-20">
              <h2 className="section-ti">Our Foundation & Values</h2>
              <p className="section-cap mx-auto max-w-2xl mt-4">
                We are driven by a commitment to excellence and a passion for helping our clients achieve their real estate dreams.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              {values.map((item, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                  <div className="h-16 w-16 bg-red-50 text-dred rounded-2xl flex items-center justify-center mb-8 group-hover:bg-dred group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <h3 className="section-in-ti mb-5 text-2xl">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-base">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modern Call to Action */}
        <section className="section-pad pb-24">
          <div className="section-wid">
            <div className="relative rounded-[3rem] overflow-hidden bg-dred px-6 py-20 md:p-24 text-center">
              {/* Abstract decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />

              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-[1.2]">Ready to Find Your Perfect Place?</h2>
                <p className="text-white/80 text-lg md:text-xl mb-12 font-light">
                  Whether you&apos;re looking for a cozy apartment or a sprawling estate, our team is ready to help you find precisely what you&apos;re looking for.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <Link
                    href="/property-list"
                    className="bg-white text-dred px-10 py-5 rounded-full font-bold shadow-lg hover:shadow-white/20 transition-all transform hover:-translate-y-1"
                  >
                    Browse Listings
                  </Link>
                  <Link
                    href="/contact"
                    className="bg-transparent border-2 border-white/40 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all transform hover:-translate-y-1"
                  >
                    Contact Our Experts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutPage;