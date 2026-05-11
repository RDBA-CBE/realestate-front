import React from 'react';
import { BadgeDollarSign, Clock3, Building2 } from 'lucide-react';

const items = [
  {
    title: 'Find Excellent Deals',
    desc: 'We offer complete real estate services for buying, selling, and renting.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Friendly Host & Fast Support',
    desc: 'We offer complete real estate services for buying, selling, and renting.',
    icon: Clock3,
  },
  {
    title: 'List Your Own Property',
    desc: 'We offer complete real estate services for buying, selling, and renting.',
    icon: Building2,
  },
];

function Feature({ item }) {
  const Icon = item.icon;
  return (
    <div className="text-center border border-[#d1d0d0] p-6 rounded-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#9b0f09] bg-white shadow-sm">
        <Icon className="h-8 w-8 text-[#9b0f09]" />
      </div>
      <h3 className="mt-5 section-in-ti">{item.title}</h3>
      <p className="mx-auto mt-3 max-w-xs ">{item.desc}</p>
    </div>
  );
}

export default function SellingOptionsSection() {
  return (
    <section className="section-pad ">
      

      <div className="section-wid pb-8">
        <div className="text-center mb-16">
          <h2 className="section-ti">Let's Find The Right Selling Option For You</h2>
          <p className="section-cap">We offer complete real estate services for buying, selling, and renting residential properties.</p>
        </div>

        <div className=" grid gap-10 md:grid-cols-3 ">
          {items.map((item, index) => (
            <Feature key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
