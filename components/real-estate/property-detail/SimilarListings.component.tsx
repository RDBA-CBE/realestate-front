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
        {data?.map((property) => (
          <SwiperSlide key={property.id}>
            <Card
              // onClick={() => router.push(`property-detail/${property?.id}`)}
              onClick={() => router.push(`/property-detail/${property?.id}`)}
              className="overflow-hidden cursor-pointer rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative">
                {property?.primary_image && (
                  <Image
                    src={property?.primary_image}
                    alt={"property"}
                    width={500}
                    height={350}
                    className="w-full h-72 object-cover"
                  />
                )}
               
                <Badge className="absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md">
                  {formatPriceRange(
                                property?.price_range?.minimum_price,
                                property?.price_range?.maximum_price
                              )}{" "}
                  {property.listing_type === "rent" && "/ mo"}
                </Badge>
              </div>

              {/* Content */}
              <CardContent className="flex flex-col justify-between p-6 space-y-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg md:text-xl mb-2">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{`${capitalizeFLetter(
                      property.city
                    )} , ${capitalizeFLetter(property.state)} `}</span>
                  </div>

                  <div className="flex items-center gap-6 text-gray-700">
                    <div className="flex items-center space-x-1">
                      <Bed className="h-4 w-4" />
                      <span className="text-sm">{property.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Bath className="h-4 w-4" />
                      <span className="text-sm">{property.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span className="text-sm">
                        {formattedNoDecimal(property.total_area)} sqft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Badge
                    variant="outline"
                    className="border-blue-600 text-blue-600 px-3 py-1 text-xs font-semibold"
                  >
                    {property.listing_type === "rent"
                      ? "FOR RENT"
                      : property.listing_type === "sale"
                      ? "FOR SALE"
                      : "FOR LEASE"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
