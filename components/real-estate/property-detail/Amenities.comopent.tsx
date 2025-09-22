"use client";

import { Card, CardContent } from "@/components/ui/card";

const amenities = [
  "Air Conditioning",
  "Barbeque",
  "Dryer",
  "Gym",
  "Lawn",
  "Microwave",
  "Outdoor Shower",
  "Refrigerator",
  "Swimming Pool",
  "TV Cable",
  "Washer",
  "WiFi6",
];

export default function Amenities() {
  return (
    <Card className="rounded-2xl shadow p-6">
        <h3 className="text-xl font-semibold mb-6">Features & Amenities</h3>

      <CardContent>

        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3">
          {amenities.map((item, i) => (
            <li key={i} className="text-gray-800 list-disc list-inside">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
