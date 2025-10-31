"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Car, Banknote, Shield, Zap, ShoppingBag, Landmark, Users } from 'lucide-react';

export  default function Amenities({ data }) {
  

  

// A function to map amenity names to appropriate Lucide icons
const getIcon = (name) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('security')) return Shield;
  if (lowerName.includes('parking')) return Car;
  if (lowerName.includes('atm') || lowerName.includes('bank')) return Banknote;
  if (lowerName.includes('power backup')) return Zap;
  if (lowerName.includes('convenience store')) return ShoppingBag;
  if (lowerName.includes('sports')) return Landmark;
  if (lowerName.includes('visitor')) return Users;
  // Default icon if no match is found
  return CheckCircle2;
};

  return (
   <Card className="border-none shadow-none bg-transparent p-0">
        {/* Title remains clear and prominent */}

        <h3 className="text-xl font-semibold mb-4">
         Features & Amenities
      </h3>
        

        {/* Responsive Icon Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.map((item, i) => {
                const Icon = getIcon(item.name);
                return (
                    // Card for each amenity
                    <div
                        key={i}
                        className="flex flex-col items-center p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm transition duration-300 ease-in-out hover:shadow-md hover:border-blue-500"
                    >
                        {/* Icon - larger and colored for visibility */}
                        <div className="mb-2 p-2 bg-red-50   rounded-full">
                            <Icon className="w-6 h-6 text-red-500" aria-hidden="true" />
                        </div>

                        {/* Feature Name - bold and easy to read */}
                        <p className="text-sm font-medium text-gray-700 leading-snug">
                            {item.name}
                        </p>
                    </div>
                );
            })}
        </div>
    </Card>
  );
}
