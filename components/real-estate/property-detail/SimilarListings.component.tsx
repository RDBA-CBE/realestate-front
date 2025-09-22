"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Bed, Bath, Square, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockProperties = [
  {
    id: "1",
    title: "Equestrian Family Home",
    location: "San Diego City, CA, USA",
    price: 14000,
    priceType: "rent",
    bedrooms: 5,
    bathrooms: 4,
    squareFeet: 900,
    image: "/assets/images/real-estate/1.png",
    featured: true,
    yearBuilt: 2018,
  },
  {
    id: "2",
    title: "Luxury villa in Rego Park",
    location: "California City, CA, USA",
    price: 82000,
    priceType: "rent",
    bedrooms: 6,
    bathrooms: 4,
    squareFeet: 1200,
    image: "/assets/images/real-estate/2.png",
  },
  {
    id: "3",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/3.png",
    yearBuilt: 2020,
  },
  {
    id: "4",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/4.png",
    yearBuilt: 2020,
  },
  {
    id: "5",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/5.png",
    yearBuilt: 2020,
  },
  {
    id: "6",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/6.png",
    yearBuilt: 2020,
  },
  {
    id: "7",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/7.png",
    yearBuilt: 2020,
  },
  {
    id: "8",
    title: "Modern Downtown Apartment",
    location: "New York City, NY, USA",
    price: 750000,
    priceType: "sale",
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 1200,
    image: "/assets/images/real-estate/8.png",
    yearBuilt: 2020,
  },
];

export default function FeaturedListings() {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Discover Our Featured Listings</h2>
          <p className="text-gray-600 text-sm">
            Aliquam lacinia diam quis lacus euismod
          </p>
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
        {mockProperties.map((property) => (
          <SwiperSlide key={property.id}>
            <Card className="overflow-hidden rounded-2xl border shadow-md hover:shadow-xl transition-all duration-300">
              {/* Image */}
              <div className="relative">
                <Image
                  src={property.image}
                  alt={property.title}
                  width={500}
                  height={350}
                  className="w-full h-72 object-cover"
                />
                {property.featured && (
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white font-semibold px-2 py-0.5 text-xs">
                    FEATURED
                  </Badge>
                )}
                <Badge className="absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md">
                  {formatPrice(property.price)}{" "}
                  {property.priceType === "rent" && "/ mo"}
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
                    <span className="text-sm">{property.location}</span>
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
                        {property.squareFeet.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <Badge
                    variant="outline"
                    className="border-blue-600 text-blue-600 px-3 py-1 text-xs font-semibold"
                  >
                    {property.priceType === "rent" ? "FOR RENT" : "FOR SALE"}
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
