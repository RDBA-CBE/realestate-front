import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Heart,
  Copy,
  Share,
  GitCompareIcon,
  GitCompareArrowsIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  capitalizeFLetter,
  formatNumber,
  formattedNoDecimal,
  formatToINR,
} from "@/utils/function.utils";
import { useState } from "react";

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  listing_type: "rent" | "sale" | "lease";
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  primary_image: string;
  featured?: boolean;
  total_area: string;
  state: string;
  city: string;
  country: string;
}

interface PropertyCardProps {
  property: Property;
  view: "grid" | "list";
}

export function PropertyCard({ property, view }: PropertyCardProps) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Card
        onClick={() => router.push(`property-detail/${property?.id}`)}
        className={`bg-gray-100 border-none overflow-hidden p-3 border shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer  ${
          view === "list" ? "flex flex-row h-48" : ""
        }`}
      >
        {/* Image */}
        <div className={`relative ${view === "list" ? "w-2/5" : ""}`}>
          {property?.primary_image && (
            // <Image
            //   src={
            //     property?.primary_image
            //   }
            //   alt={"property"}
            //   width={400}
            //   height={280}
            //   className={`object-cover ${
            //     view === "list" ? "h-full w-full" : "w-full h-40"
            //   }`}
            // />
            <Image
              src={property?.primary_image}
              alt={"property"}
              width={400}
              height={280}
              className={`object-cover rounded-lg ${
                view === "list" ? "h-full w-full" : "w-full h-70"
              }`}
            />
          )}
          {!hover && (
            <Badge
              className={`absolute top-3 left-3 text-white font-semibold capitalize border-none rounded-full px-4 py-1.5 ${
                property.listing_type === "sale"
                  ? "bg-green-500"
                  : property.listing_type === "lease"
                  ? "bg-blue-500"
                  : property.listing_type === "rent"
                  ? "bg-orange-500"
                  : "bg-gray-500"
              }`}
            >
              For {property.listing_type}
            </Badge>
          )}
          {property.featured && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white font-semibold px-2 py-0.5 text-xs">
              FEATURED
            </Badge>
          )}

          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-2 right-2 flex gap-2"
            >
              {[Heart, GitCompareArrowsIcon, Share].map((Icon, i) => (
                <button
                  key={i}
                  className="bg-white rounded-full p-2 shadow hover:bg-gray-100"
                >
                  <Icon size={16} />
                </button>
              ))}
            </motion.div>
          )}

          <Badge className='absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md'>
          {formatToINR(property.price)}{' '}
          {property.listing_type === 'rent' && '/ mo'}
        </Badge>
        </div>

        {/* Content */}
        <CardContent
          className={`flex flex-col justify-between mx-2 ${
            view === "list" ? "w-3/5 pl-4" : "pt-3"
          }`}
        >
          <div>
            {/* <p className="py-2 text-xl">{formatToINR(property.price)} </p> */}
            <h3
              className={` text-gray-900 pb-1 ${
                view === "list" ? "text-xl mb-1" : "text-xl mb-2"
              }`}
            >
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-5 w-5 mr-1" />
              {/* <span className="text-sm">{`${property.city} , ${property.state} , ${property.country}`}</span> */}
              <span className="text-md">{`${capitalizeFLetter(
                property.city
              )} , ${capitalizeFLetter(property.state)} `}</span>
            </div>

            <div className="flex items-center gap-4 text-gray-500 mb-2 flex-wrap text-md">
              <div className="flex items-center space-x-1">
                <Bed className="h-5 w-5" />
                <span className="text-md">{property.bedrooms} bed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Bath className="h-5 w-5" />
                <span className="text-md">{property.bathrooms} bath</span>
              </div>
              <div className="flex items-center space-x-1">
                <Square className="h-5 w-5" />
                <span className="text-md">
                  {formattedNoDecimal(property.total_area)} sqft
                </span>
              </div>
            </div>
          </div>

          {/* <div className='mt-auto'>
          <Badge
            variant='outline'
            className='border-blue-600 text-blue-600 px-3 py-1 text-xs font-semibold'
          >
            {property.listing_type === 'rent'
              ? 'FOR RENT'
              : property.listing_type === 'sale'
              ? 'FOR SALE'
              : 'FOR LEASE'}
          </Badge>
        </div> */}
        </CardContent>
      </Card>
    </motion.div>
  );
}
