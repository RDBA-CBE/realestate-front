"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Bath,
  Calendar,
  Car,
  Maximize2,
  Home,
} from "lucide-react";

const details = [
  { icon: Bed, label: "Bedroom", value: "1" },
  { icon: Bath, label: "Bath", value: "2" },
  { icon: Calendar, label: "Year Built", value: "2018" },
  { icon: Car, label: "Garage", value: "2" },
  { icon: Maximize2, label: "Sqft", value: "1200" },
  { icon: Home, label: "Property Type", value: "Houses" },
];

export default function PropertyDetails() {
  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-xl font-semibold mb-6">Overview</h3>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {details.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <div className="p-3 rounded-xl border w-12 h-12 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{item.label}</h4>
              <p className="text-gray-600 text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
