"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";

interface GalleryProps {
  images: any[];
}

export default function Gallery({ images }: GalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpen = (index: number) => {
    setStartIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      {/* Layout with next/image */}
      {images.length === 1 ? (
        <Card
          className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative cursor-pointer"
          onClick={() => handleOpen(0)}
        >
          <Image
            src={images?.[0]?.image}
            alt="Gallery Image"
            fill
            className="object-cover"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left big image */}
          <Card
            className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative cursor-pointer"
            onClick={() => handleOpen(0)}
          >
            <Image
              src={images?.[0]?.image}
              alt="Main Gallery"
              fill
              className="object-cover"
            />
          </Card>

          {/* Right grid */}
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
                className="overflow-hidden rounded-2xl shadow-lg relative cursor-pointer"
                onClick={() => handleOpen(i + 1)}
              >
                <Image
                  src={img?.image}
                  alt={`Gallery ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
