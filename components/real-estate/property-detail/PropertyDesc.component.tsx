"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

const description =
  "This 3-bed with a loft, 2-bath home in the gated community of The Hideout has it all. From the open floor plan to the abundance of light from the windows, this home is perfect for entertaining. The living room and dining room have vaulted ceilings and a beautiful fireplace. You will love spending time on the deck taking in the beautiful views. In the kitchen, you'll find stainless steel appliances and a tile backsplash, as well as a breakfast bar.";

const details = [
  { label: "Property ID", value: "RT48" },
  { label: "Garage", value: "2" },
  { label: "Price", value: "$252,000" },
  { label: "Garage Size", value: "200 SqFt" },
  { label: "Property Size", value: "1500 Sq Ft" },
  { label: "Year Built", value: "2022" },
  { label: "Bathrooms", value: "3" },
  { label: "Property Type", value: "Apartment" },
  { label: "Bedrooms", value: "2" },
  { label: "Property Status", value: "For Sale" },
];

export default function PropertyDesc(props: any) {
  const { data } = props;

  const [expanded, setExpanded] = useState(false);
  const MAX_LENGTH = 300;

  if (!data?.description) return null; // ✅ Avoid crash if undefined

  const isLong = data.description.length > MAX_LENGTH;
  const shortText = isLong
    ? data.description.slice(0, MAX_LENGTH) + "..."
    : data.description;


  return (
    <Card className="border-none shadow-none bg-transparent space-y-6">
      {/* Description */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Property Description</h3>
        <p className="text-gray-700 leading-relaxed">
        {expanded ? data.description : shortText}
      </p>

      {isLong && ( // ✅ Show button only if text is long
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 font-semibold text-black hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
      </div>

      {/* Property Details */}
      {/* <div>
        <h3 className="text-xl font-semibold mb-6">Property Details</h3>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {details.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between border-b md:border-none pb-2 md:pb-0"
            >
              <span className="font-semibold text-gray-800">{item.label}</span>
              <span className="text-gray-700">{item.value}</span>
            </div>
          ))}
        </CardContent>
      </div> */}
    </Card>
  );
}
