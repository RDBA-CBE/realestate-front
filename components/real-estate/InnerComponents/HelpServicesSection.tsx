import React from 'react';
import { ArrowRight } from 'lucide-react';

const services = [
  {
    title: 'Buy a property',
    desc: 'Nullam sollicitudin blandit lacus ut congue. Vestibulum ante ipsum primis in faucibus orci luctus.',
    btn: 'Find a home',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
  {
    title: 'Sell a property',
    desc: 'Nullam sollicitudin blandit lacus ut congue. Vestibulum ante ipsum primis in faucibus orci luctus.',
    btn: 'Place an ad',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=800&auto=format&fit=crop',
    featured: true,
  },
  {
    title: 'Rent a property',
    desc: 'Nullam sollicitudin blandit lacus ut congue. Vestibulum ante ipsum primis in faucibus orci luctus.',
    btn: 'Find a rental',
    image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=800&auto=format&fit=crop',
    featured: false,
  },
];

function ServiceCard({ item }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <img src={item.image} alt={item.title} className="mx-auto h-28 w-auto object-contain" />
      <h3 className="mt-4 text-lg font-semibold text-zinc-900">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{item.desc}</p>
      <button className={`mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${item.featured ? 'bg-rose-500 text-white hover:bg-rose-600' : 'border border-rose-300 text-rose-500 hover:bg-rose-50'}`}>
        {item.btn}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

export default function HelpServicesSection() {
  return (
    <section className="bg-white px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-500">See How We Can Help</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">See How We Can Help</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-zinc-500">We offer complete real estate services including buying, selling, and renting residential and commercial properties.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {services.map((item, index) => (
            <ServiceCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
