"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Heart, MapPin, Bed, Bath, Square } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyCard } from "@/components/real-estate/property-list/property3And4Column/property-card";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import { formatPriceRange, Success, useSetState } from "@/utils/function.utils";
import { properties } from "@/utils/constant.utils";
import Models from "@/imports/models.import";
import { formatToINR } from "@/utils/function.utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Favorites = () => {
  const router = useRouter();

  const [state, setState] = useSetState({
    view: "grid",
    page: 1,
    properties: [],
    loading: true,
    error: null,
  });

  const [hover, setHover] = useState(false);

  useEffect(() => {
    wishlist();
  }, []);

  const wishlist = async () => {
    try {
      setState({ loading: true });
      const wishlist_id = localStorage.getItem("wishlist_id");
      const res: any = await Models.wishlist.list(wishlist_id);
      console.log("✌️res --->", res);
      setState({
        properties: res?.properties || [],
        loading: false,
      });
    } catch (error) {
      console.log("✌️error --->", error);
      setState({
        error: "Failed to load wishlist",
        loading: false,
      });
    }
  };

  const handleRemoveFromWishlist = async (propertyId: number) => {
    try {
      await Models.wishlist.remove_property({
        property_id: propertyId,
      });

      const updatedProperties = state.properties.filter(
        (property: any) => property.id !== propertyId
      );
      setState({ properties: updatedProperties });
      Success("Removed from your wishlist !");
    } catch (error) {
      console.log("✌️error removing from wishlist --->", error);
    }
  };

  const toggleView = (view: string) => {
    setState({ view });
  };

  if (state.loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[85rem] mx-auto"
      >
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (state.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[85rem] mx-auto"
      >
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        </div>
      </motion.div>
    );
  }

  const getListingTypeInfo = (type: string) => {
    const types = {
      sale: { label: "For Sale", className: "bg-blue-100 text-blue-800" },
      rent: { label: "For Rent", className: "bg-green-100 text-green-800" },
      lease: { label: "For Lease", className: "bg-purple-100 text-purple-800" },
    };
    return (
      types[type] || {
        label: "Available",
        className: "bg-gray-100 text-gray-800",
      }
    );
  };

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="max-w-[85rem] mx-auto"
    >
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              My Wishlist
            </h1>
            <p className="text-lg text-gray-500">
              {state.properties.length}{" "}
              {state.properties.length === 1 ? "property" : "properties"} saved
              for later.
            </p>
          </div>

          {/* View Toggle */}
          <div className="hidden md:flex items-center space-x-2 mt-4 md:mt-0">
            <button
              onClick={() => toggleView("grid")}
              className={`p-2 rounded-lg ${
                state.view === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => toggleView("list")}
              className={`p-2 rounded-lg ${
                state.view === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {state.properties.length === 0 ? (
          // <div className="text-center py-12">
          //   <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          //   <h3 className="text-lg font-medium text-gray-900 mb-2">
          //     No favorites yet
          //   </h3>
          //   <p className="text-gray-500">
          //     Properties you add to your wishlist will appear here.
          //   </p>
          // </div>

          <div className="text-center py-12 h-[600px] flex flex-col items-center justify-center">
            <p className="text-gray-500">
              Properties you add to your wishlist will appear here.
            </p>
            <button
              className="w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 text-base rounded-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed "
              onClick={() => router.push("property-list")}
            >
              {" "}
              Add properties to Wishlist
            </button>
          </div>
        ) : (
          <div
            className={
              state.view === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "flex flex-col gap-6"
            }
          >
            {state.properties.map((property: any, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {state.view === "grid" ? (
                  // Grid View Card
                  <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      <Image
                        src={property.primary_image}
                        alt={property.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        onClick={() => handleRemoveFromWishlist(property.id)}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Heart className="w-4 h-4 fill-current text-red-500" />
                      </button>
                      <div className="absolute top-3 left-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            getListingTypeInfo(property.listing_type).className
                          }`}
                        >
                          {getListingTypeInfo(property.listing_type).label}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                      </h3>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>
                          {property.city}, {property.state}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-4">
                          {property.bedrooms > 0 && (
                            <div className="flex items-center">
                              <Bed className="w-4 h-4 mr-1" />
                              <span>{property.bedrooms} bed</span>
                            </div>
                          )}
                          {property.bathrooms > 0 && (
                            <div className="flex items-center">
                              <Bath className="w-4 h-4 mr-1" />
                              <span>{property.bathrooms} bath</span>
                            </div>
                          )}
                          {property.total_area && (
                            <div className="flex items-center">
                              <Square className="w-4 h-4 mr-1" />
                              <span>{property.total_area} sq ft</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          {formatPriceRange(
                            property.minimum_price,
                            property?.maximum_price
                          )}
                        </span>
                        <span className="text-sm text-gray-500">
                          {property.price_per_sqft &&
                            `₹${property.price_per_sqft}/sq ft`}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View Card
                  <div className="bg-gray-100 rounded-lg  overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                    <div
                      className="flex flex-col md:flex-row"
                      style={{ height: 300 }}
                    >
                      <div className="md:w-1/3 relative">
                        <Image
                          src={property.primary_image}
                          alt={property.title}
                          width={300}
                          height={200}
                          className="w-full h-48 md:h-full object-cover"
                        />
                        <button
                          onClick={() => handleRemoveFromWishlist(property.id)}
                          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Heart className="w-4 h-4 fill-current text-red-500" />
                        </button>
                      </div>

                      <div className="md:w-2/3 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-semibold text-xl text-gray-900">
                                {property.title}
                              </h3>
                              <span
                                className={`px-3 py-1 text-sm font-medium rounded-full ${
                                  property.listing_type === "sale"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {property.listing_type === "sale"
                                  ? "For Sale"
                                  : "For Rent"}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-500 text-sm mb-4">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>
                                {property.address}, {property.city},{" "}
                                {property.state}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                              {property.description}
                            </p>

                            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                              {property.bedrooms > 0 && (
                                <div className="flex items-center">
                                  <Bed className="w-4 h-4 mr-2" />
                                  <span>{property.bedrooms} Bedrooms</span>
                                </div>
                              )}
                              {property.bathrooms > 0 && (
                                <div className="flex items-center">
                                  <Bath className="w-4 h-4 mr-2" />
                                  <span>{property.bathrooms} Bathrooms</span>
                                </div>
                              )}
                              {property.total_area && (
                                <div className="flex items-center">
                                  <Square className="w-4 h-4 mr-2" />
                                  <span>{property.total_area} Sq Ft</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div>
                              <span className="text-2xl font-bold text-gray-900">
                                {formatPriceRange(
                                  property.minimum_price,
                                  property?.maximum_price
                                )}
                              </span>
                              {property.price_per_sqft && (
                                <span className="text-sm text-gray-500 ml-2">
                                  ₹{property.price_per_sqft}/sq ft
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                router.push(`property-detail/${property?.id}`)
                              }
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
