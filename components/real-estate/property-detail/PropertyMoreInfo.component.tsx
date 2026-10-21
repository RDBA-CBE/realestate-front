"use client";

import { useState } from "react";
import Image from "next/image";
import LightboxGallery from "@/components/common-components/Lightbox.component";
import { Expand } from "lucide-react";

interface MoreInfoItem {
  id?: number;
  image?: string;
  image_url?: string;
  caption?: string | null;
}

interface PropertyMoreInfoProps {
  data?: MoreInfoItem[];
}

export default function PropertyMoreInfo({ data = [] }: PropertyMoreInfoProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = data.filter((item) => item.image_url || item.image);

  const lightboxImages = images.map((item) => ({
    image_url: (item.image_url || item.image) as string,
    alt: item.caption || "Property information",
  }));

  if (!images.length) return null;

  return (
    <div>
      <div className="mb-5">
        <h3 className="section-in-ti mb-1 !font-bold">More Information</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((item, index) => (
          <figure
            key={item.id ?? `${item.image_url ?? item.image}-${index}`}
            className="m-0 group cursor-zoom-in relative"
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
          >
            <div className="relative">
              <Image
                src={item.image_url || item.image}
                alt={item.caption || "Property information QR code"}
                width={192}
                height={192}
                className="h-auto max-h-60 w-32 object-contain rounded-lg transition-opacity group-hover:opacity-90"
                unoptimized
              />
              {/* Expand hint on hover */}
              <div className="absolute inset-0 flex items-end justify-end pb-1 pr-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black/60 text-white rounded-md px-1.5 py-0.5 flex items-center gap-1 text-[10px]">
                  <Expand className="w-3 h-3" /> View
                </div>
              </div>
            </div>
            {item.caption && (
              <figcaption className="mt-2 max-w-48 text-sm text-gray-500">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      <LightboxGallery
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        autoSlide={false}
      />
    </div>
  );
}
