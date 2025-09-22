"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const floorPlans = [
  {
    id: "first",
    title: "First Floor",
    size: "1267 Sqft",
    bedrooms: 2,
    bathrooms: 2,
    price: "$920,99",
    image: "/assets/images/real-estate/floor.png",
  },
  {
    id: "second",
    title: "Second Floor",
    size: "1267 Sqft",
    bedrooms: 2,
    bathrooms: 2,
    price: "$920,99",
    image: "/assets/images/real-estate/floor.png",
  },
  {
    id: "third",
    title: "Third Floor",
    size: "1267 Sqft",
    bedrooms: 2,
    bathrooms: 2,
    price: "$920,99",
    image: "/assets/images/real-estate/floor.png",
  },
];

export default function FloorPlans() {
  return (
    <Card className="rounded-2xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Floor Plans</h3>

      <CardContent className="space-y-4">
        <Accordion type="single" collapsible>
          {floorPlans.map((plan) => (
            <AccordionItem
              key={plan.id}
              value={plan.id}
              className="border-b py-2"
            >
              {/* Trigger row */}
              <AccordionTrigger className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-left">
                <span className="font-medium">{plan.title}</span>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-700">
                  <span>
                    <strong>Size:</strong> {plan.size}
                  </span>
                  <span>
                    <strong>Bedrooms:</strong> {plan.bedrooms}
                  </span>
                  <span>
                    <strong>Bathrooms:</strong> {plan.bathrooms}
                  </span>
                  <span>
                    <strong>Price:</strong> {plan.price}
                  </span>
                </div>
              </AccordionTrigger>

              {/* Content with floor plan image */}
              <AccordionContent className="pt-4">
                <Image
                  src={plan.image}
                  alt={plan.title}
                  width={800}
                  height={500}
                  className="rounded-lg object-cover w-full"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
