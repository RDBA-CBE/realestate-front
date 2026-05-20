"use client";

import React from "react";
import { CheckCircle2, Target, Award, ShieldCheck, ArrowRight, Users, Building2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Years Experience", value: "15+", icon: TrendingUp },
  { label: "Properties Sold", value: "2,500+", icon: Building2 },
  { label: "Happy Clients", value: "1,800+", icon: Users },
  { label: "Expert Agents", value: "50+", icon: Star },
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

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", img: "/assets/images/real-estate/home/dev-reg-1.png" },
  { name: "Priya Sharma", role: "Head of Sales", img: "/assets/images/real-estate/home/dev-reg-2.png" },
  { name: "Ravi Kumar", role: "Lead Consultant", img: "/assets/images/real-estate/home/dev-reg-3.png" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[500px] flex items-end overflow-hidden">
        <img
          src="/assets/images/real-estate/home/About.png"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.currentTarget.src = "/assets/images/real-estate/banner.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 section-wid pb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/60 mb-3 block">
            Who We Are
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-5 leading-tight max-w-2xl">
            Building Dreams, <br />Delivering Homes
          </h1>
          <p className="text-white/75 text-base md:text-lg max-w-xl leading-relaxed">
            More than a real estate firm — your dedicated partners in finding the perfect property.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="bg-dred">
        <div className="section-wid">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-4 py-8 px-6 ${i < 3 ? "md:border-r border-white/20" : ""}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-white leading-none">{stat.value}</p>
                    <p className="text-white/70 text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION ── */}
      <section className="section-pad">
        <div className="section-wid">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Images collage */}
            <div className="relative h-[520px]">
              <img
                src="/assets/images/real-estate/home/banner-1.png"
                alt="Our Story"
                className="absolute top-0 left-0 w-[65%] h-[60%] object-cover rounded-3xl shadow-xl"
              />
              <img
                src="/assets/images/real-estate/home/banner-2.png"
                alt="Properties"
                className="absolute bottom-0 right-0 w-[60%] h-[55%] object-cover rounded-3xl shadow-xl"
              />
              {/* Badge */}
              <div className="absolute bottom-[38%] left-[55%] -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-5 py-4 z-10 border border-gray-100 text-center min-w-[130px]">
                <p className="text-3xl font-bold text-dred leading-none">15+</p>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Years of Trust</p>
              </div>
              {/* Decorative blob */}
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-dred/8 rounded-full blur-3xl -z-10" />
            </div>

            {/* Text */}
            <div>
              <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">
                Established 2005
              </span>
              <h2 className="section-ti mb-6">
                Redefining the Real Estate Experience
              </h2>
              <p className="section-cap mb-8 leading-relaxed">
                JustHome was founded with a singular vision — to transform the way people discover and acquire their dream homes. By combining decades of industry expertise with innovative digital tools, we offer a seamless journey for buyers, sellers, and investors alike.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {["Local Market Experts", "Global Reach & Network", "Premium Property Selection", "End-to-End Support"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-dred h-4 w-4" />
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/property-list"
                className="inline-flex items-center gap-2 bg-dred text-white px-8 py-4 rounded-full font-semibold hover:bg-[#7d0c07] transition-all group"
              >
                Explore Properties
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS STYLE CARDS ── */}
      <section className="section-pad bg-[#f8f8f8]">
        <div className="section-wid">
          <div className="text-center mb-12">
            <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-3 inline-block">What We Offer</span>
            <h2 className="section-ti">Buy, Sell or Rent with Confidence</h2>
            <p className="section-cap mt-3 max-w-xl mx-auto">
              Whether you're looking to buy your dream home or sell your property, we make it simple.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Looking for a New Home?",
                desc: "Browse thousands of verified listings across top cities. Find the perfect home that fits your lifestyle and budget.",
                btn: "Browse Listings",
                href: "/property-list",
                bg: "/assets/images/real-estate/home/Buy.png",
                inner: "/assets/images/real-estate/home/hit-in-buy.png",
              },
              {
                title: "Want to Sell Your Property?",
                desc: "List your property with us and reach thousands of serious buyers. Fast, transparent, and hassle-free.",
                btn: "Post Property",
                href: "/post-property",
                bg: "/assets/images/real-estate/home/Sale.png",
                inner: "/assets/images/real-estate/home/hit-in-sale.png",
              },
            ].map((card, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl min-h-[360px] group">
                <img
                  src={card.bg}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/15" />
                <div className="absolute bottom-5 left-5 right-5 z-10">
                  <div className="bg-white rounded-2xl px-5 py-6 flex items-center justify-between gap-4 shadow-xl">
                    <div className="flex-1">
                      <h3 className="section-in-ti mb-2">{card.title}</h3>
                      <p className="text-sm text-gray-500 mb-4 max-w-xs">{card.desc}</p>
                      <Link
                        href={card.href}
                        className="inline-flex items-center gap-2 bg-dred text-white text-sm px-5 py-2 rounded-full hover:bg-[#7d0c07] transition-colors"
                      >
                        {card.btn} <ArrowRight size={14} />
                      </Link>
                    </div>
                    <div className="hidden sm:block shrink-0 w-24 h-24 rounded-2xl overflow-hidden">
                      <img src={card.inner} alt={card.title} className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-pad bg-white">
        <div className="section-wid">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Text side */}
            <div>
              <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Our Foundation</span>
              <h2 className="section-ti mb-4">What Drives Us Every Day</h2>
              <p className="section-cap mb-10 leading-relaxed">
                We are driven by a commitment to excellence and a passion for helping our clients achieve their real estate dreams.
              </p>
              <div className="space-y-6">
                {values.map((item, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-dred transition-colors duration-300">
                      <item.icon className="h-6 w-6 text-dred group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="section-in-ti mb-1">{item.title}</h3>
                      <p className="text-gray-500 text-[15px] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image side */}
            <div className="relative rounded-3xl overflow-hidden h-[500px] shadow-2xl">
              <img
                src="/assets/images/real-estate/home/banner-3.png"
                alt="Our Values"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/assets/images/real-estate/home/banner-4.png"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Our Promise</p>
                <h3 className="text-white text-2xl font-bold leading-snug">
                  Trusted by 1,800+ <br />happy families
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      {/* <section className="section-pad bg-[#f8f8f8]">
        <div className="section-wid">
          <div className="text-center mb-12">
            <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-3 inline-block">The People</span>
            <h2 className="section-ti">Meet Our Expert Team</h2>
            <p className="section-cap mt-3 max-w-xl mx-auto">
              Our experienced professionals are here to guide you every step of the way.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                <div className="h-64 overflow-hidden">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.src = "/assets/images/dummy-profile.jpg"; }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="section-in-ti">{member.name}</h3>
                  <p className="text-dred text-sm font-medium mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ── CTA ── */}
      <section className="section-pad !pb-20">
        <div className="section-wid">
          <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-center">
            <img
              src="/assets/images/real-estate/home/home-banner1.jpg"
              alt="CTA Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 w-full text-center px-6 py-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-snug">
                Ready to Find Your Perfect Place?
              </h2>
              <p className="text-white/75 text-base md:text-lg mb-10 max-w-xl mx-auto font-light">
                Whether you&apos;re looking for a cozy apartment or a sprawling estate, our team is ready to help.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/property-list"
                  className="bg-dred text-white px-8 py-4 rounded-full font-bold hover:bg-[#7d0c07] transition-all hover:-translate-y-0.5"
                >
                  Browse Listings
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/50 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  Contact Our Experts
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
