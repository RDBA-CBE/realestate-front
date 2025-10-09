"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Copy, Share, Bed, Bath, Square, MapPin } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PropertyCard({
  property,
  view,
}: {
  property: any;
  view: "grid" | "list";
}) {
  const [hover, setHover] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card
        className={`overflow-hidden border shadow-sm transition-all duration-300 ${
          view === "list" ? "flex flex-row h-48" : ""
        }`}
      >
        <div className={`relative ${view === "list" ? "w-2/5" : ""}`}>
          <Image
            src={property.image}
            alt={property.title}
            width={400}
            height={280}
            className={`object-cover ${
              view === "list" ? "h-full w-full" : "w-full h-64"
            }`}
          />

          {!hover && (
            <Badge className="absolute top-2 left-2 bg-black/70 text-white font-semibold">
              {property.priceType === "rent" ? "FOR RENT" : "FOR SALE"}
            </Badge>
          )}

          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-2 right-2 flex gap-2"
            >
              {[Heart, Copy, Share].map((Icon, i) => (
                <button
                  key={i}
                  className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
                >
                  <Icon size={16} />
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <CardContent
          className={`flex flex-col justify-between ${
            view === "list" ? "w-3/5 p-4" : "p-6"
          }`}
        >
          <div>
            <h3
              className={`font-bold text-gray-900 ${
                view === "list" ? "text-lg mb-1" : "text-xl mb-2"
              }`}
            >
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-700 mb-2">
              <div className="flex items-center space-x-1">
                <Bed className="h-4 w-4" />
                <span className="text-xs">{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="h-4 w-4" />
                <span className="text-xs">{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span className="text-xs">
                  {/* {property.squareFeet.toLocaleString()} sqft */}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            <Badge
              variant="outline"
              className="border-blue-600 text-blue-600 px-3 py-1 text-xs font-semibold"
            >
              {formatPrice(property.price)}
              {property.priceType === "rent" && " /mo"}
            </Badge>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
