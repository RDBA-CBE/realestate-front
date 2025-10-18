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
  Success,
  useSetState,
} from "@/utils/function.utils";
import { useEffect, useState } from "react";
import Models from "@/imports/models.import";

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
  is_compare: string;
  user_wishlists: boolean;
}

interface PropertyCardProps {
  property: Property;
  view: "grid" | "list";
}

export function PropertyCard({ property, view }: PropertyCardProps) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  const [state, setState] = useSetState({
    is_compare: false,
    is_liked:false
  });

  const handleIconClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // ✅ prevent card click
    console.log("✌️index --->", index);
    if (index == 0) {
      handleWishList();
    } else if (index == 1) {
      handleCompareList();
    } else {
      handleShare();
    }
  };



  const handleWishList = async () => {
    try {


      const getWishlist=await Models.wishlist.details(property?.id)
console.log('✌️getWishlist --->', getWishlist);
      // const body = {
      //   properties: [property?.id],
      // };
      // if (state.is_liked || property?.user_wishlists){
      // const res = await Models.wishlist.delete(property?.id);
      // setState({is_liked:false})

      // }else{
      //   const res = await Models.wishlist.create(body);
      //   console.log("✌️res --->", res);
      //   setState({is_liked:true})
      // }

   
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleCompareList = () => {
    try {
      const propertyId = property?.id;
      const compareList = JSON.parse(localStorage.getItem("compare") || "[]");

      let updatedList = [];
      if (compareList.includes(propertyId)) {
        updatedList = compareList.filter((id: string) => id !== propertyId);
        Success("Removed from your compare list !");
      } else {
        Success("Added to your compare list !");

        updatedList = [...compareList, propertyId];
      }

      localStorage.setItem("compare", JSON.stringify(updatedList));

      const compares = localStorage.getItem("compare");
      if (compares?.length > 0) {
        const is_compared = compares?.includes(property?.id);
        setState({ is_compare: is_compared });
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleShare = async () => {
    try {
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

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

          {hover && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-2 right-2 flex gap-2"
            >
              {[Heart, GitCompareArrowsIcon, Share].map((Icon, i) => {
                const isCompareIcon = Icon === GitCompareArrowsIcon;
                const like = Icon === Heart;

                return (
                  <button
                    key={i}
                    className={`rounded-full p-2 shadow hover:bg-gray-100 transition-colors ${
                      isCompareIcon
                        ? state.is_compare || property?.is_compare
                          ? "bg-green-500 text-white hover:bg-green-500 hover:text-white" // added to compare list
                          : "bg-white text-black" // default for compare icon
                        :  like
                        ? state.is_liked || property?.user_wishlists
                          ? "bg-red-500 text-white hover:bg-red-500 hover:text-white" // liked
                          : "bg-white text-black" // not liked
                        : "bg-white text-black" // default for other icons
                    }`}
                    onClick={(e) => {
                      handleIconClick(i, e);
                    }}
                  >
                    <Icon size={16} />
                  </button>
                );
              })}
            </motion.div>
          )}

          <Badge className="absolute top-2 right-2 bg-white text-black font-bold px-2 py-1 text-sm shadow-md">
            {formatToINR(property.price)}{" "}
            {property.listing_type === "rent" && "/ mo"}
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
