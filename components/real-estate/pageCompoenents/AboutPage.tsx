"use client";

import React from "react";
import { CheckCircle2, Target, Award, ShieldCheck, ArrowRight, Users, Building2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

 

const stats = [
  { label: "Years Experience", value: "15+", icon: TrendingUp },
  { label: "Properties Sold", value: "2,500+", icon: Building2 },
  { label: "Happy Clients", value: "1,800+", icon: Users },
  { label: "Expert Agents", value: "50+", icon: Star },
];

const values = [
  {
    icon: Target,
    title: " Mission",
    desc: "To make property buying, selling, and investing simple through trusted listings, expert guidance, and transparent real estate services.",
  },
  {
    icon: Award,
    title: " Vision",
    desc: "To be the most trusted real estate platform by delivering seamless property experiences with innovation, transparency, and customer satisfaction.",
  },
  {
    icon: ShieldCheck,
    title: "Core Values",
    desc: "We are committed to integrity, transparency, innovation, and customer satisfaction, delivering reliable real estate solutions with excellence.",
  },
];

const team = [
  { name: "Arjun Mehta", role: "Founder & CEO", img: "/assets/images/real-estate/home/dev-reg-1.png" },
  { name: "Priya Sharma", role: "Head of Sales", img: "/assets/images/real-estate/home/dev-reg-2.png" },
  { name: "Ravi Kumar", role: "Lead Consultant", img: "/assets/images/real-estate/home/dev-reg-3.png" },
];



const AboutPage = () => {


  const router = useRouter();

  const OnTypeClick = (card) => {
    router.push(`${card.url}`);
  };
  
  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ── */}
      <section className="relative h-[500px] flex items-end overflow-hidden">
        <img
          src="/assets/images/real-estate/about/about.webp"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover object-bottom"
          onError={(e) => { e.currentTarget.src = "/assets/images/real-estate/banner.jpg"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-10 section-wid pb-16">
          <span className="text-xs uppercase tracking-[0.25em]  text-white mb-3 block">
            Who We Are
          </span>
          <h1 className="adv-title leading-tight max-w-2xl">
            Building Dreams, <br />Delivering Homes
          </h1>
          <p className="adv-subtitle">
           Helping buyers, sellers, and developers achieve their goals through reliable listings and dedicated real estate expertise
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
                  className={`flex  gap-4 py-8 px-6 ${i < 3 ? "md:border-r border-white/20" : ""}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl  text-white pb-2 mb-0">{stat.value}</p>
                    <p className="text-white/70 text-xs uppercase tracking-wider">{stat.label}</p>
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
                src="/assets/images/real-estate/about/about-1.webp"
                alt="Our Story"
                className="absolute top-0 left-0 w-[65%] h-[60%] object-cover rounded-3xl shadow-xl"
              />
              <img
                src="/assets/images/real-estate/about/home-right.webp"
                alt="Properties"
                className="absolute bottom-0 right-0 w-[60%] h-[55%] object-cover rounded-3xl shadow-xl"
              />
              {/* Badge */}
              <div className="absolute bottom-[45%] left-[55%] -translate-x-1/2 bg-white rounded-2xl shadow-2xl px-5 py-4 z-10 border border-gray-100 text-center min-w-[130px]">
                <p className="text-3xl text-dred font-semibold leading-none mb-0 pb-3">15+</p>
                <p className="text-xs  uppercase tracking-wider font-semibold">Years of Trust</p>
              </div>
              {/* Decorative blob */}
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-dred/8 rounded-full blur-3xl -z-10" />
            </div>

            {/* Text */}
            <div>
              <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">
                Established 2026
              </span>
              <h2 className="section-ti mb-6">
                Connecting you to better properties
              </h2>
              <p className="section-cap mb-8 leading-relaxed">
                At Boom Realtys, we believe finding the perfect property should be simple, transparent and rewarding. Since our inception, we've been dedicated to connecting buyers, sellers, investors and developers through a trusted real estate platform that delivers verified listings, expert guidance and seamless experiences. Whether you're buying, selling a property or exploring investment opportunities, Boom Realty provides the expertise, transparency and support you need to make confident decisions.
              </p>

              <div className="grid sm:grid-cols-2 !gap-4 mb-10">
                {["Verified property listings", "Local market expertise", "Personalized property solutions", "End-to-end real estate support"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="text-dred h-5 w-5" />
                    </div>
                    <span className=" ">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/property-list"
                className="inline-flex items-center gap-2 bg-dred text-white px-8 py-3 rounded-full hover:bg-[#7d0c07] transition-all group"
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
            <h2 className="section-ti">Find, Buy & Sell with Confidence</h2>
            <p className="section-cap mt-3 max-w-xl mx-auto">
              Explore verified property listings, compare options and discover perfect homes matching your lifestyle and budget
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
      title: "Looking for the new home?",
      description:
        "Browse thousands of trusted listings, explore prime locations, and confidently move into the home you've always wanted.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/home/buy-1.webp",
      bgImage:
        "/assets/images/real-estate/home/Buy.webp",
      url: "/property-list?type=Sale",
    },
    {
      title: "Want to sell your home?",
      description:
        "Market your home to the right audience, attract serious buyers, and close successful deals with complete confidence.",
      buttonText: "Get Started",
      image: "/assets/images/real-estate/home/sale-1.webp",
      bgImage:
        "/assets/images/real-estate/home/Sale.webp",
      url: "/post-property",
    },
            ].map((card, i) => (
               <div
                            key={i}
                            className="relative overflow-hidden rounded-2xl min-h-[360px] group"
                          >
                            {/* Background Image */}
                            <img
                              src={card.bgImage}
                              alt={card.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
              
                            {/* Overlay */}
                             <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/35 to-black/20 z-[1]" />
              
                            {/* Floating Content Card */}
                            <div className="absolute bottom-5 left-5 right-5 z-[2]">
                              <div className="bg-white/10 rounded-2xl px-5 py-8 flex items-center justify-between gap-4 shadow-xl">
                                {/* Left Content */}
                                <div className="flex-1">
                                  <h3 className="section-in-ti mb-2 !text-white">
                                    {card.title}
                                  </h3>
              
                                  <p className=" mb-4 max-w-md leading-relaxed !text-white">
                                    {card.description}
                                  </p>
              
                                  <button
                                    onClick={() => OnTypeClick(card)}
                                    className="flex items-center gap-2 bg-dred hover:bg-[#fff6f6] hover:text-[#9b0f09] text-sm text-white hover:border hover:border-[#9b0f09] px-5 py-2 rounded-full transition-colors"
                                  >
                                    {card.buttonText}
                                    <ArrowRight size={14} />
                                  </button>
                                </div>
              
                                {/* Right Small Image */}
                                <div className="hidden sm:block shrink-0">
                                  <div className="w-28 h-28 rounded-2xl overflow-hidden">
                                    <img
                                      src={card.image}
                                      alt={card.title}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="section-pad bg-white ">
        <div className="section-wid py-5">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Text side */}
            <div>
              <span className="text-dred font-bold uppercase tracking-[0.2em] text-xs mb-4 inline-block">Our principles</span>
              <h2 className="section-ti mb-4">Driven by purpose and values</h2>
              <p className="section-cap mb-10 leading-relaxed">
               Everything we do is guided by integrity, innovation, transparency, and customer-first values that create meaningful property experiences together.
              </p>
              <div className="space-y-6">
                {values.map((item, i) => (
                  <div key={i} className="flex gap-5 items-start group border-b border-[#d1d0d0]">
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
              {/* <div className="absolute inset-0 bg-black/30" /> */}
              <img
                src="/assets/images/real-estate/about/about-2.webp"
                alt="Our Values"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/assets/images/real-estate/home/banner-4.png"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Our Promise</p>
                <h3 className="text-white text-2xl  leading-snug">
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
              src="/assets/images/real-estate/about/about-frame.webp"
              alt="CTA Background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-black/70" /> */}
            <div className="relative z-10 w-full text-center px-6 py-16">
              <h2 className="section-ti mb-5 !text-white">
                Begin your property journey with Boom Realtys
              </h2>
              <p className="text-white  mb-10 max-w-xl mx-auto ">
                Start exploring verified properties, connect with trusted experts, and discover a home that perfectly fits your lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/property-list"
                  className="bg-dred !text-white px-8 py-3 rounded-full  hover:bg-[#7d0c07] transition-all hover:-translate-y-0.5"
                >
                  Explore Properties
                </Link>
                {/* <Link
                  href="/contact"
                  className="border-2 border-white text-white px-8 py-3 rounded-full  hover:bg-white/10 transition-all hover:-translate-y-0.5"
                >
                  Contact Our Experts
                </Link> */}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
