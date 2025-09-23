"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback } from "react";

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

export default function ImageCarousel({
  images,
  height = 500,
}: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center", // keeps images centered in loop
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full">
      {/* Viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-4">
          {images.map((src, i) => (
            <div
              key={i}
              className={`relative flex-[0_0_90%] sm:flex-[0_0_70%] lg:flex-[0_0_50%] ${
                i === 0 ? "ml-4" : "" // space before first
              } ${i === images.length - 1 ? "mr-4" : ""}`} // space after last
              style={{ height: `${height}px` }}
            >
              <Image
                src={src}
                alt={`Slide ${i + 1}`}
                fill
                className="object-cover rounded-xl"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={scrollPrev}
        className="absolute top-1/2 left-2 -translate-y-1/2 z-20 bg-white/70 rounded-full p-3 hover:bg-white shadow"
      >
        ◀
      </button>
      <button
        onClick={scrollNext}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-20 bg-white/70 rounded-full p-3 hover:bg-white shadow"
      >
        ▶
      </button>
    </div>
  );
}
