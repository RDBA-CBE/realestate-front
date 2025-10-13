"use client"
import React from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyCard } from "@/components/real-estate/property-list/property3And4Column/property-card";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import { useSetState } from "@/utils/function.utils";
import { properties } from "@/utils/constant.utils";

// (Assuming PropertyCard is in a separate file, or defined above)
// import PropertyCard from './PropertyCard';

 const Favorites = () => {

    const [state, setState] = useSetState({
      view:"grid"
    })
  

 

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-[85rem] mx-auto "
    >
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Your Wishlist
        </h1>
        <p className="text-lg text-gray-500 mb-8">
          {properties.length} properties saved for later.
        </p>

        

          {/* Tab Content - Commercial */}
         
          
           
                <div
                  className={
                    state.view === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {properties.map((property: any, index: number) => (
                    <div
                      key={index}
                      
                    >
                      <PropertyCard property={property} view={state.view} />
                    </div>
                  ))}
                </div>
              
              {/* {getFilteredProperties("Commercial").map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))} */}
           
          
      </div>
    </motion.div>
  );
};

export default Favorites
