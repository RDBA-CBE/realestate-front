"use client";

import { Card, CardContent } from "@/components/ui/card";
import { capitalizeFLetter, formatNumber } from "@/utils/function.utils";
import { Bed, Bath, Calendar, Car, Maximize2, Home } from "lucide-react";
import { useState } from "react";

export default function PropertyDetails({ data }: any) {
console.log('✌️data --->', data);


    const [expanded, setExpanded] = useState(false);
    const MAX_LENGTH = 300;
  
    if (!data?.description) return null; 
  
    const isLong = data.description.length > MAX_LENGTH;
    const shortText = isLong
      ? data.description.slice(0, MAX_LENGTH) + "..."
      : data.description;
  
  const details = [
    { icon: Bed, label: "Bedroom", value: data?.bedrooms ?? "-" },
    { icon: Bath, label: "Bath", value: data?.bathrooms ?? "-" },
    { icon: Calendar, label: "Year Built", value: data?.built_year ?? "-" },
    // { icon: Car, label: "Garage", value: data?.garage ?? "-" },
    { icon: Maximize2, label: "Total Area", value: formatNumber(data?.total_area) ?? "-" },
    { icon: Maximize2, label: "Build up Area", value: formatNumber(data?.built_up_area) ?? "-" },

    { icon: Home, label: "Offer Type", value: capitalizeFLetter(data?.listing_type) ?? "-" },

    // { icon: Home, label: "Property Type", value: data?.property_type?.name ?? "-" },
  ];

  

  return (
    <Card className="border-none shadow-none bg-transparent">
      <h3 className="text-xl font-semibold mb-6">Overview</h3>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="p-3 rounded-xl border w-12 h-12 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{item?.label}</h4>
              {item?.value &&
              <p className="text-gray-600 text-sm">{item?.value}</p>
            }
            </div>
          </div>
        ))}
      </CardContent>
      {/* <h3 className="text-xl font-semibold mb-3">Description</h3>
      <div>
        <p className="text-gray-700 leading-relaxed">
        {expanded ? data.description : shortText}
      </p>

      {isLong && ( 
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 font-semibold text-black hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      </div> */}

    </Card>
  );
}
