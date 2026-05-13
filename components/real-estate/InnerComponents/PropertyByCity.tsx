"use client";
import React from "react";
import { useRouter } from "next/navigation";

const PropertyByCity = ({ cityList = [] }) => {
  const router = useRouter();

  const handleClick = (city) => {
    router.push(`/property-list?location=${city?.id}`);
  };

  console.log("cityList", cityList);
  

  const locations = [
  {
    name: "Coimbatore",
    count: "+500",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Chennai",
    count: "+750",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Tiruchirappalli",
    count: "+8,100",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Bangalore",
    count: "+1,000",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Coimbatore",
    count: "+2,500",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Chennai",
    count: "+2,000",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Tiruchirappalli",
    count: "+1,500",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
  {
    name: "Bangalore",
    count: "+8,100",
    img: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop",
  },
];

  return (
    <section className="exp-wrapper">
      <div className="exp-container section-wid">

        {/* Heading */}
        <div className="exp-header">
          <h2 className="section-ti">Properties by Cities</h2>
          <p className="section-cap">Aliquam lacinia diam quis lacus euismod</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 !gap-4 md:!gap-7 mt-10 md:mt-14 mb-5">
          {cityList.slice(0,8).map((item, index) => (
            <div key={index} className="exp-card" onClick={() => handleClick(item)}>
              <img src="https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=400&h=300&fit=crop" alt={item.name} className="exp-img" />
              <div className="exp-content">
                <h4 className="section-in-ti">{item.name}</h4>
                {/* <p>{item.count} {item.count === 1 ? "Property" : "Properties"}</p> */}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PropertyByCity;
