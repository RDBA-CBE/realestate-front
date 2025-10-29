"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function VirtualTour() {
  return (
    <Card className="border-none shadow-none bg-transparent">
      <h3 className="text-lg font-semibold mb-4">360° Virtual Tour</h3>
      <CardContent className="space-y-4">
        <div className="relative w-full h-56 md:h-80 rounded-lg overflow-hidden">
          <Image
            src="/assets/images/real-estate/compare1.png"
            alt="360 Virtual Tour"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
