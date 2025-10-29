"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { SlideshowLightbox } from "lightbox.js-react";
import LightboxGallery from "@/components/common-components/Lightbox.component";

interface GalleryProps {
  images: any[];
}

export default function Gallery({ images }: GalleryProps) {
  const [startIndex, setStartIndex] = useState(0);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [clickedImageIndex, setClickedImageIndex] = useState(0);
  console.log("✌️clickedImageIndex --->", clickedImageIndex);

  const openLightbox = (index: number) => {
    setClickedImageIndex(index);
    setLightboxOpen(true);
  };

  if (!images || images.length === 0) return null;

  const handleOpen = (index: number) => {
    setStartIndex(index);
    setLightboxOpen(true);
    setClickedImageIndex(index);
  };

  return (
    <>
      {/* Layout with next/image */}

      {images.length === 1 ? (
        <div className="container">
          <Card
            className="overflow-hidden rounded-2xl shadow-lg h-[500px] relative cursor-pointer"
            onClick={() => handleOpen(0)}
          >
            {/* Blurry background */}
            <div
              className="absolute inset-0 z-0 bg-cover bg-center filter blur-lg scale-110"
              style={{ backgroundImage: `url(${images?.[0]?.image})` }}
            ></div>

            {/* Main Image */}
            <Image
              src={images?.[0]?.image}
              alt="Gallery Image"
              fill
              className="object-contain relative z-10"
            />
          </Card>
        </div>
      ) : (
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 ">
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
                  : images.length - 1 >= 2
                  ? "grid-cols-1 grid-rows-2"
                  : "grid-cols-1 grid-rows-2"
              }`}
            >
              {images.slice(1, 3).map((img, i) => {
                const remaining = images.length - 3; // total - shown (1 main + 2)
                const isLastCard = i === 1 && images.length > 3; // show overlay only if > 3

                return (
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

                    {isLastCard && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">
                          + {remaining} more
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="h-full wi-full">
        <LightboxGallery
          images={images}
          initialIndex={clickedImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          autoSlide={false}
        />
      </div>
    </>
  );
}
