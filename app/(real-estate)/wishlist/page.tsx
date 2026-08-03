"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Heart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PropertyCardSkeleton } from "@/components/common-components/skeleton/PropertyCardSkeleton.componenet";
import { useSetState } from "@/utils/function.utils";
import Models from "@/imports/models.import";
import { useRouter } from "next/navigation";
import { PropertyCard } from "@/components/real-estate/property-list/property3And4Column/property-card";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";

const Favorites = () => {
  const router = useRouter();

  const [state, setState] = useSetState({
    properties: [],
    loading: true,
    error: null,
    contactOpen: false,
    selectedProperty: null,
  });

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="section-wid">
        <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        </div>
      </motion.div>
    );
  }

  if (state.error) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="section-wid">
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
  
   const redirect = () => {
    router.push(`/property-list?developerId=${state.detail?.developer?.id}`);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="">

      <section className="  bg-dred h-[65px] md:h-[70px] flex items-center justify-center overflow-hidden">
        
       
        <div className=" text-center text-white ">
          
          <h1 className="text-2xl md:text-2xl text-white pb-0 mb-0">
            My Wishlist
          </h1>
         
        </div>
      </section>
      <div className="py-10 section-wid">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
          <div>
            {/* <h1 className="section-ti">My Wishlist</h1> */}
            <p className="section-cap">
              {state.properties.length} {state.properties.length === 1 ? "property" : "properties"} saved for later.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 !gap-5">
            {state.properties.map((property: any, index: number) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <PropertyCard
                  property={{ ...property, user_wishlists: true }}
                  view="grid"
                  list={state.properties}
                  updateList={(data) => setState({ properties: data })}
                  onContactClick={(prop) => setState({ contactOpen: true, selectedProperty: prop })}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {state.contactOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setState({ contactOpen: false })}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ContactAgentForm
                data={state.selectedProperty}
                onClose={() => setState({ contactOpen: false })}
                token={state.token}
                industryClick={() => redirect()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Favorites;
