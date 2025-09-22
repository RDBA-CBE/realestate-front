"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

const images = [
  "/assets/images/real-estate/01.png", // Big left
  "/assets/images/real-estate/02.png",
  "/assets/images/real-estate/03.png",
  "/assets/images/real-estate/04.png",
  "/assets/images/real-estate/05.png",
];

export default function Gallery() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left big image */}
      <Card className="overflow-hidden rounded-2xl shadow-lg">
        <Image
          src={images[0]}
          alt="Main House"
          width={900}
          height={700}
          className="w-full h-full object-cover"
        />
      </Card>

      {/* Right side: 2x2 grid */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {images.slice(1).map((img, i) => (
          <Card
            key={i}
            className="overflow-hidden rounded-2xl shadow-lg"
          >
            <Image
              src={img}
              alt={`Gallery ${i}`}
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
