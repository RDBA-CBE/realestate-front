"use client";

import { motion } from "framer-motion";
import Gallery from "@/components/real-estate/property-detail/Gallery.component";
import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
import MapSection from "@/components/real-estate/property-detail/MapSection.component";
import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
import Amenities from "@/components/real-estate/property-detail/Amenities.comopent";
import Reviews from "@/components/real-estate/property-detail/Reviews.component";
import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
import PropertyDesc from "@/components/real-estate/property-detail/PropertyDesc.component";
import Nearby from "@/components/real-estate/property-detail/Nearby.component";
import WalkScore from "@/components/real-estate/property-detail/Walkscore.component";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";

export default function Home() {
  return (
    <div className="container mx-auto px-9 py-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      ></motion.div>

      <PropertyHeader />
      <Gallery />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PropertyDetails />
          <PropertyDesc />
          <MapSection />
          <Amenities />
          <FloorPlans />
          <Nearby />
          <WalkScore />
          <Reviews />
        </div>
        <div className="lg:col-span-1">
    <div className="sticky top-24">
      <ContactAgentForm />
    </div>
  </div>
      </div>
      <SimilarListings />
    </div>
  );
}
