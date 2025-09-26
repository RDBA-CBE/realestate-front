"use client";

import { motion } from "framer-motion";
import Gallery from "@/components/real-estate/property-detail/Gallery.component";
import PropertyDetails from "@/components/real-estate/property-detail/PropertyDetails.component";
import PropertyHeader from "@/components/real-estate/property-detail/PropertyHeader.component";
import MapSection from "@/components/real-estate/property-detail/MapSection.component";
import FloorPlans from "@/components/real-estate/property-detail/FloorPlans.component";
import Amenities from "@/components/real-estate/property-detail/Amenities.component";
import Reviews from "@/components/real-estate/property-detail/Reviews.component";
import SimilarListings from "@/components/real-estate/property-detail/SimilarListings.component";
import PropertyDesc from "@/components/real-estate/property-detail/PropertyDesc.component";
import Nearby from "@/components/real-estate/property-detail/Nearby.component";
import WalkScore from "@/components/real-estate/property-detail/Walkscore.component";
import ContactAgentForm from "@/components/real-estate/property-detail/ContactAgentForm.component";
import PropertyTabs from "@/components/real-estate/PropertyTabs.component";
import ImageCarousel from "@/components/real-estate/ImageCarousel.component";
import Video from "@/components/real-estate/property-detail/Video.component";
import VirtualTour from "@/components/real-estate/property-detail/VirtualTour.component";

export default function Home() {
  const images = [
    "/assets/images/real-estate/01.png",
    "/assets/images/real-estate/02.png",
    "/assets/images/real-estate/03.png",
    "/assets/images/real-estate/04.png",
    "/assets/images/real-estate/05.png",
    "/assets/images/real-estate/6.png",
    "/assets/images/real-estate/7.png",
  ];

  return (
    <div className="container mx-auto px-9 py-6 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      />

      {/* Header + Gallery */}
      <PropertyHeader />
      {/* <ImageCarousel images={images} /> */}
      <Gallery images={images} />

      {/* Sticky Tabs */}
      <PropertyTabs />

      {/* Content sections with IDs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div id="overview">
            <PropertyDetails />
          </div>
          <div id="desc">
            <PropertyDesc />
          </div>

          <div id="map">
            <MapSection />
          </div>

          <div id="amenities">
            <Amenities />
          </div>

          <div id="floorplans">
            <FloorPlans />
          </div>

          <div id="video">
            <Video />
          </div>

          <div id="virtualtour">
            <VirtualTour />
          </div>

          <div id="nearby">
            <Nearby />
          </div>

          <div id="walkscore">
            <WalkScore />
          </div>

          <div id="reviews">
            <Reviews />
          </div>
        </div>

        {/* Sticky Contact Form on the right */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ContactAgentForm />
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <SimilarListings />
    </div>
  );
}
