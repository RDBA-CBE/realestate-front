"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const tabs = ["Education", "Health & Medical", "Transportation"];

const education = [
  {
    name: "South Londonderry Elementary School",
    grade: "PK-6",
    distance: "3.7 mi",
    rating: "4/10",
    stars: 4,
  },
  {
    name: "Londonderry Senior High School",
    grade: "PK-6",
    distance: "3.7 mi",
    rating: "5/10",
    stars: 5,
  },
  {
    name: "Londonderry Middle School",
    grade: "PK-6",
    distance: "3.7 mi",
    rating: "5/10",
    stars: 5,
  },
];

const health = [
  {
    name: "Londonderry Medical Center",
    type: "Hospital",
    distance: "2.1 mi",
    rating: "4/5",
    stars: 4,
  },
  {
    name: "Green Valley Clinic",
    type: "Clinic",
    distance: "1.4 mi",
    rating: "5/5",
    stars: 5,
  },
];

const transport = [
  {
    name: "Londonderry Bus Station",
    type: "Bus Stop",
    distance: "0.8 mi",
    rating: "4/5",
    stars: 4,
  },
  {
    name: "Central Train Station",
    type: "Train",
    distance: "4.2 mi",
    rating: "5/5",
    stars: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex text-lime-500">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={16} fill="currentColor" stroke="none" />
      ))}
    </div>
  );
}

function ItemRow({
  rating,
  name,
  subtitle,
  stars,
}: {
  rating: string;
  name: string;
  subtitle: string;
  stars: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center border-2 border-lime-500 text-lime-600 rounded-full font-semibold">
          {rating}
        </div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <Stars count={stars} />
    </div>
  );
}

export default function Nearby() {
  const [activeTab, setActiveTab] = useState("Education");

  const getData = () => {
    if (activeTab === "Education") return education;
    if (activeTab === "Health & Medical") return health;
    if (activeTab === "Transportation") return transport;
    return [];
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
     <h3 className="text-lg font-semibold mb-4">{"What's Nearby?"}</h3>


      <CardContent>
        {/* Custom Tabs */}
        <div className="flex gap-8 border-b mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-gray-700 font-medium relative ${
                activeTab === tab ? "text-black" : ""
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black rounded"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {getData().map((item, i) => (
            <ItemRow
              key={i}
              rating={item.rating}
              name={item.name}
              subtitle={
                item.grade
                  ? `Grades: ${item.grade} • Distance: ${item.distance}`
                  : `${item.type} • Distance: ${item.distance}`
              }
              stars={item.stars}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
