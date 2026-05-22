"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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
import { useParams, useRouter } from "next/navigation";
import { PropertyCard } from "../property-list/property3And4Column/property-card";
import { useState } from "react";
import ContactAgentForm from "./ContactAgentForm.component";

export default function FeaturedListings(props: any) {
  const { data } = props;
    const params = useParams();


    const developerId = params?.id;


  const router = useRouter();
   const redirect = () => {
    router.push(`/property-list?developerId=${developerId}`);
  };

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [token, setToken] = useState<string | null>(null);

  return (

    <>
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-ti">Discover Our Featured Listings</h2>
          {/* <p className="text-gray-600 text-sm">
            Aliquam lacinia diam quis lacus euismod
          </p> */}
        </div>

        {/* Custom Navigation */}
        <div className="flex gap-2">
          <button
            className="featured-prev p-2 rounded-full border bg-white shadow hover:bg-color1"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="featured-next p-2 rounded-full border bg-white shadow hover:bg-color1"
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
        {data?.map((property: any, index: number) => (
          <SwiperSlide key={property.id}  className="!flex !h-auto items-stretch">
            
              <div
                key={index}
                className="flex flex-col flex-1"

              >
                <PropertyCard
                  property={property}
                  view="grid"
                  list={data}
                   onContactClick={(prop) => {
                        setSelectedProperty(prop);
                        setIsContactModalOpen(true);
                      }}
                />
              </div>
            
          </SwiperSlide>
        ))}
      </Swiper>

      
    </div>

    <AnimatePresence>
        {isContactModalOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
            />

            {/* MODAL */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <ContactAgentForm
                data={selectedProperty}
                token={token}
                onClose={() => setIsContactModalOpen(false)}
                industryClick={() => redirect()}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </>
  );
}
