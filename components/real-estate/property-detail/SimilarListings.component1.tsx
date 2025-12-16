"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  capitalizeFLetter,
  formatPriceRange,
  formattedNoDecimal,
  formatToINR,
} from "@/utils/function.utils";
import { useRouter } from "next/navigation";
import { PropertyCard } from "../property-list/property3And4Column/property-card";

export default function FeaturedListings(props: any) {
  const { data } = props;

  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discover Our Featured Listings</h2>
          {/* <p className="text-gray-600 text-sm">
            Aliquam lacinia diam quis lacus euismod
          </p> */}
        </div>

        {/* Custom Navigation */}
        <div className="flex gap-2">
          <button
            className="featured-prev p-2 rounded-full border bg-white shadow hover:bg-gray-100"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="featured-next p-2 rounded-full border bg-white shadow hover:bg-gray-100"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Swiper */}
      <Swiper
        
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={{ prevEl: ".featured-prev", nextEl: ".featured-next" }}
        breakpoints={{
          640: { slidesPerView: 1 },
          1024: { slidesPerView: 3 },
        }}
      >
        {data?.map((property: any, index: number) => (
          <SwiperSlide key={property.id}  className="!flex !h-auto items-stretch">
            
              <div
                key={index}
                className="flex flex-col flex-1"

              >
                <PropertyCard
                  property={property}
                  view="grid"
                  list={data}
                  
                />
              </div>
            
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
