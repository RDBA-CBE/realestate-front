"use client";
import React, { useState } from "react";
import { MapPin, BedDouble, Bath, Maximize2, Heart, GitCompare } from "lucide-react";
import { capitalizeFLetter, formatPriceRange, Success } from "@/utils/function.utils";
import { useRouter } from "next/navigation";
import Models from "@/imports/models.import";

const PropertyCard = ({ listing }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(listing?.user_wishlists || false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isCompared, setIsCompared] = useState(() => {
    if (typeof window !== "undefined") {
      const compareList = JSON.parse(localStorage.getItem("compare") || "[]");
      return compareList.includes(listing?.id);
    }
    return false;
  });

  const handleClick = () => {
    router.push(`property-detail/${listing?.id}`);
  };

  const handleWishList = async (e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) { setShowLoginPopup(true); return; }
      if (!isWishlisted) {
        await Models.wishlist.add_property({ property_id: listing?.id });
        setIsWishlisted(true);
        Success("Added to your wishlist!");
      } else {
        await Models.wishlist.remove_property({ property_id: listing?.id });
        setIsWishlisted(false);
        Success("Removed from your wishlist!");
      }
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    try {
      const propertyId = listing?.id;
      const compareList = JSON.parse(localStorage.getItem("compare") || "[]");
      let updatedList = [];
      if (compareList.includes(propertyId)) {
        updatedList = compareList.filter((id) => id !== propertyId);
        Success("Removed from compare list!");
      } else {
        updatedList = [...compareList, propertyId];
        Success("Added to compare list!");
      }
      localStorage.setItem("compare", JSON.stringify(updatedList));
      setIsCompared(updatedList.includes(propertyId));
    } catch (error) {
      console.log("✌️error --->", error);
    }
  };

  return (
    <>
      <div
        className="bg-white rounded-2xl overflow-hidden cursor-pointer group h-full flex flex-col shadow-md hover:shadow-xl transition-shadow duration-300"
        onClick={handleClick}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden rounded-t-2xl">
          <img
            src={listing?.primary_image}
            alt={listing?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* For Sale badge */}
          <div className="absolute top-3 left-3 bg-[#9b0f09] text-white text-xs font-semibold px-3 py-1 rounded-full">
            For Sale
          </div>

          {/* Action icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishList}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-[#9b0f09] text-[#9b0f09]" : "text-gray-500"}`} />
            </button>
            <button
              onClick={handleCompare}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition-colors"
            >
              <GitCompare className={`w-4 h-4 ${isCompared ? "text-[#9b0f09]" : "text-gray-500"}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="pt-4 pb-3 px-4 text-start flex flex-col flex-1">
          <p className="text-[#9b0f09] font-bold text-xl mb-1">
            ₹ {formatPriceRange(listing?.price_range?.minimum_price, listing?.price_range?.maximum_price)}
          </p>
          <h3 className="section-in-ti mb-2">{listing?.title}</h3>
          <p className="flex items-center gap-1 mb-4 min-h-[24px]">
            {listing?.location?.name && (<><MapPin className="w-3.5 h-3.5" />{`${capitalizeFLetter(
                                listing.area?.name,
                              )}, ${capitalizeFLetter(listing.location?.name)}`}</>)}
          </p>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-t pt-5 pb-4 border-[#ededed] mt-auto">
            {listing.floor_plans && listing.floor_plans.length > 0 && (
               <span className="flex items-center gap-1"><BedDouble className="w-4 h-4" />   {`${[
                        ...new Set(
                          listing.floor_plans.map((floor_plan: any) =>
                            floor_plan.category?.match(/\d+/)?.[0]
                          )
                        ),
                      ].join(", ")} BHK`}</span>
            )}
           
            {/* <span className="flex items-center gap-1"><Bath className="w-4 h-4" /> {listing?.bathrooms}</span> */}
            <span className="flex items-center gap-1"><Maximize2 className="w-4 h-4" /> {listing?.price_per_sqft} sqft</span>
          </div>
        </div>
      </div>

      {/* Login Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setShowLoginPopup(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-7 h-7 text-[#9b0f09]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Login Required</h3>
            <p className="text-gray-500 text-sm mb-6">Please log in to add properties to your wishlist.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLoginPopup(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => { setShowLoginPopup(false); router.push("/login"); }} className="flex-1 bg-[#9b0f09] text-white py-2.5 rounded-lg font-medium hover:bg-red-800 transition-colors">Login</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyCard;
