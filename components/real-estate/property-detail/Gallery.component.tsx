"use client";

import { Card } from "@/components/ui/card";
import Image from "next/image";

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  if (!images || images.length === 0) return null;

  // Single image → full width with fixed height (same as multi-image)
  if (images.length === 1) {
    return (
      <Card className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative">
        <Image
          src={images[0]}
          alt="Gallery Image"
          fill
          className="object-cover"
        />
      </Card>
    );
  }

  // Multi-image → left big image (fixed height), right grid (same height)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Left big image with fixed height */}
      <Card className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative">
        <Image
          src={images[0]}
          alt="Main Gallery"
          fill
          className="object-cover"
        />
      </Card>

      {/* Right grid, same fixed height */}
      <div
        className={`grid h-[500px] gap-4 ${
          images.length - 1 === 1
            ? "grid-rows-1"
            : images.length - 1 === 2
            ? "grid-rows-2"
            : images.length - 1 <= 4
            ? "grid-cols-2 grid-rows-2"
            : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {images.slice(1).map((img, i) => (
          <Card
            key={i}
            className="overflow-hidden rounded-2xl shadow-lg relative"
          >
            <Image
              src={img}
              alt={`Gallery ${i}`}
              fill
              className="object-cover"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}
