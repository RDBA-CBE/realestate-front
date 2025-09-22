"use client";

import { SlideshowLightbox } from "lightbox.js-react";

type LightboxGalleryProps = {
  images: string[];
};

export default function LightboxGallery({ images }: LightboxGalleryProps) {
  return (
    <SlideshowLightbox
      className="grid grid-cols-3 gap-2"
      showThumbnails={true}
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Image ${i + 1}`}
          className="cursor-pointer rounded-lg object-cover w-full h-32"
        />
      ))}
    </SlideshowLightbox>
  );
}
