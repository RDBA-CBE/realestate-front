"use client";

import { Card, CardContent } from "@/components/ui/card";

const addresses = [
  {
    address: "10425 Tabor St",
    city: "Los Angeles",
    state: "California",
  },
  {
    address: "10 Downing Street",
    city: "London",
    state: "Greater London",
  },
];

export default function MapSection() {
  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold mb-6">Address</h3>

      {/* Address details */}
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {addresses.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-800 w-28">Address</span>
              <span className="text-gray-700">{item.address}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-800 w-28">City</span>
              <span className="text-gray-700">{item.city}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-800 w-28">State/county</span>
              <span className="text-gray-700">{item.state}</span>
            </div>
          </div>
        ))}
      </CardContent>

      {/* Google Map */}
      <iframe
        className="w-full h-64 rounded-2xl"
        src="https://maps.google.com/maps?q=Los%20Angeles&t=&z=13&ie=UTF8&iwloc=&output=embed"
      />
    </Card>
  );
}
