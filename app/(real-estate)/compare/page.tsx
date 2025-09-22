"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  type: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  size: string;
  propertyId: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  amenities: {
    airConditioning: boolean;
    barbeque: boolean;
    gym: boolean;
    pool: boolean;
    cable: boolean;
  };
};

const properties: Property[] = [
  {
    id: "1",
    title: "Home in Metric Way",
    price: "$14,000 / mo",
    location: "California City, CA, USA",
    image: "/assets/images/real-estate/compare1.png",
    type: "Apartment",
    address: "Quincy St",
    city: "New York",
    state: "New York",
    zip: "10013",
    country: "United States",
    size: "2560 Sq Ft",
    propertyId: "R43",
    bedrooms: 3,
    bathrooms: 1,
    garage: 1,
    amenities: {
      airConditioning: true,
      barbeque: false,
      gym: true,
      pool: true,
      cable: true,
    },
  },
  {
    id: "2",
    title: "Villa on Hollywood Boulevard",
    price: "$14,000 / mo",
    location: "California City, CA, USA",
    image: "/assets/images/real-estate/compare2.png",
    type: "Studio",
    address: "8100 S Ashland Ave",
    city: "Chicago",
    state: "New York",
    zip: "10013",
    country: "United States",
    size: "2560 Sq Ft",
    propertyId: "R43",
    bedrooms: 2,
    bathrooms: 4,
    garage: 4,
    amenities: {
      airConditioning: true,
      barbeque: false,
      gym: true,
      pool: true,
      cable: true,
    },
  },
  {
    id: "3",
    title: "Explore Old Barcelona",
    price: "$14,000 / mo",
    location: "California City, CA, USA",
    image: "/assets/images/real-estate/compare3.png",
    type: "Villa",
    address: "194 Mercer Street",
    city: "New York",
    state: "New York",
    zip: "10013",
    country: "United States",
    size: "2560 Sq Ft",
    propertyId: "R43",
    bedrooms: 5,
    bathrooms: 3,
    garage: 3,
    amenities: {
      airConditioning: true,
      barbeque: false,
      gym: true,
      pool: true,
      cable: true,
    },
  },
];

const attributes = [
  { label: "Property Type", key: "type" },
  { label: "Address", key: "address" },
  { label: "City", key: "city" },
  { label: "State/county", key: "state" },
  { label: "Zip/Postal Code", key: "zip" },
  { label: "Country", key: "country" },
  { label: "Property Size", key: "size" },
  { label: "Property ID", key: "propertyId" },
  { label: "Bedrooms", key: "bedrooms" },
  { label: "Bathrooms", key: "bathrooms" },
  { label: "Garage", key: "garage" },
];

const amenities = [
  { label: "Air Conditioning", key: "airConditioning" },
  { label: "Barbeque", key: "barbeque" },
  { label: "Gym", key: "gym" },
  { label: "Swimming Pool", key: "pool" },
  { label: "TV Cable", key: "cable" },
];

export default function ComparePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-6 space-y-6"
    >
      {/* Header Tabs */}
      <div className="grid grid-cols-3 bg-gray-50 rounded-lg overflow-hidden text-center">
        {properties.map((property) => (
          <div
            key={property.id}
            className="p-4 font-medium border-r last:border-r-0"
          >
            {property.title}
          </div>
        ))}
      </div>

      {/* Property Images */}
      <div className="grid grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="rounded-xl overflow-hidden shadow"
          >
            <Image
              src={property.image}
              alt={property.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 text-center">
              <h4 className="text-lg font-semibold">{property.price}</h4>
              <p className="text-gray-500 text-sm">{property.location}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Attribute Rows */}
    {/* Attribute Rows + Amenities */}
<div className="border rounded-lg overflow-hidden">
  {/* Attributes */}
  {attributes.map((attr, index) => (
    <div
      key={attr.key}
      className={cn(
        "grid grid-cols-[200px_repeat(3,1fr)] p-4 text-sm items-center",
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      )}
    >
      {/* Label column */}
      <div className="font-semibold">{attr.label}</div>

      {/* Property values */}
      {properties.map((property) => (
        <div key={property.id} className="text-center">
          {property[attr.key ]}
        </div>
      ))}
    </div>
  ))}

  {/* Amenities */}
  {amenities.map((amenity, index) => (
    <div
      key={amenity.key}
      className={cn(
        "grid grid-cols-[200px_repeat(3,1fr)] p-4 text-sm items-center",
        index % 2 === 0 ? "bg-gray-50" : "bg-white"
      )}
    >
      {/* Label column */}
      <div className="font-semibold">{amenity.label}</div>

      {/* Amenity values */}
      {properties.map((property) => (
        <div key={property.id} className="flex items-center justify-center">
          {property.amenities[amenity.key as keyof typeof property.amenities] ? (
            <span className="text-green-500">✔</span>
          ) : (
            <span className="text-red-500">✘</span>
          )}
        </div>
      ))}
    </div>
  ))}
</div>

    </motion.div>
  );
}
