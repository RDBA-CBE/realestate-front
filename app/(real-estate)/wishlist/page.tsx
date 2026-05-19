"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Heart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import { useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { useRouter } from "next/navigation";
import PropertyCard from "@/components/real-estate/InnerComponents/PropertyCard";

const Favorites = () => {
  const router = useRouter();

  const [state, setState] = useSetState({
    page: 1,
    properties: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    wishlist();
  }, []);

  const wishlist = async () => {
    try {
      setState({ loading: true });
      const wishlist_id = localStorage.getItem("wishlist_id");
      const res: any = await Models.wishlist.list(wishlist_id);
      setState({ properties: res?.properties || [], loading: false });
    } catch (error) {
      setState({ error: "Failed to load wishlist", loading: false });
    }
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto"
    >
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="section-ti">My Wishlist</h1>
            <p className="section-cap">
              {state.properties.length}{" "}
              {state.properties.length === 1 ? "property" : "properties"} saved for later.
            </p>
          </div>
        </div>

        {state.properties.length === 0 ? (
          <div className="text-center py-12 h-[600px] flex flex-col items-center justify-center">
            <Heart className="mx-auto h-16 w-16 text-gray-200 mb-4" />
            <p className="text-gray-500 mb-4">Properties you add to your wishlist will appear here.</p>
            <button
              className="bg-[#9b0f09] hover:bg-[#7d0c07] text-white font-semibold py-2 px-6 rounded-lg"
              onClick={() => router.push("/property-list")}
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {state.properties.map((property: any, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PropertyCard listing={{ ...property, user_wishlists: true }} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Favorites;
