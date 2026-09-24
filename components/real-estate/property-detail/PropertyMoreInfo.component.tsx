"use client";

import Image from "next/image";

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
  const images = data.filter((item) => item.image_url || item.image);

  if (!images.length) return null;

  return (
    <div>
      <div className="mb-5">
        <h3 className="section-in-ti mb-1">More Information</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {images.map((item, index) => (
          <figure key={item.id ?? `${item.image_url ?? item.image}-${index}`} className="m-0">
            <Image
              src={item.image_url || item.image}
              alt={item.caption || "Property information QR code"}
              width={192}
              height={192}
              className="h-32 w-32 object-contain"
              unoptimized
            />
            {item.caption && (
              <figcaption className="mt-2 max-w-48 text-sm text-gray-500">
                {item.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  );
}